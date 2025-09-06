// --- DOM elements ---
var resultsAdviceParagraph = document.querySelector('#results');
var adviceIdHeading = document.querySelector('#advice-id');
var getDataBtn = document.querySelector('#getData');
var getByIdBtn = document.querySelector('#getById');
var adviceInputElement = document.querySelector('#advice-input');
// --- Fetch random advice ---
function fetchRandomAdvice() {
    fetch('https://api.adviceslip.com/advice', { cache: 'no-store' })
        .then(function (res) {
        if (!res.ok)
            throw new Error("HTTP ".concat(res.status));
        return res.json();
    })
        .then(function (data) {
        var adviceObj = data.slip;
        if (adviceIdHeading)
            adviceIdHeading.textContent = "ADVICE #".concat(adviceObj.id);
        if (resultsAdviceParagraph)
            resultsAdviceParagraph.textContent = "\"".concat(adviceObj.advice, "\"");
    })
        .catch(function (err) {
        console.error('Error fetching random advice:', err);
        if (resultsAdviceParagraph)
            resultsAdviceParagraph.textContent = 'Error fetching advice!';
        if (adviceIdHeading)
            adviceIdHeading.textContent = '';
    });
}
// --- Fetch advice by ID ---
function getAdviceById(id) {
    fetch("https://api.adviceslip.com/advice/".concat(id), { cache: 'no-store' })
        .then(function (res) {
        if (!res.ok)
            throw new Error("HTTP ".concat(res.status));
        return res.json();
    })
        .then(function (data) {
        if ('slip' in data) {
            var adviceObj = data.slip;
            if (adviceIdHeading)
                adviceIdHeading.textContent = "ADVICE #".concat(adviceObj.id);
            if (resultsAdviceParagraph)
                resultsAdviceParagraph.textContent = "\"".concat(adviceObj.advice, "\"");
        }
        else if ('message' in data) {
            if (resultsAdviceParagraph)
                resultsAdviceParagraph.textContent = data.message.text;
            if (adviceIdHeading)
                adviceIdHeading.textContent = '';
        }
        else {
            if (resultsAdviceParagraph)
                resultsAdviceParagraph.textContent = 'No advice found for this ID!';
            if (adviceIdHeading)
                adviceIdHeading.textContent = '';
        }
    })
        .catch(function (err) {
        console.error('Error fetching advice by ID:', err);
        if (resultsAdviceParagraph)
            resultsAdviceParagraph.textContent = 'Error fetching advice!';
        if (adviceIdHeading)
            adviceIdHeading.textContent = '';
    });
}
// --- Event listeners ---
getDataBtn === null || getDataBtn === void 0 ? void 0 : getDataBtn.addEventListener('click', function () { return fetchRandomAdvice(); });
getByIdBtn === null || getByIdBtn === void 0 ? void 0 : getByIdBtn.addEventListener('click', function () {
    var id = Number(adviceInputElement === null || adviceInputElement === void 0 ? void 0 : adviceInputElement.value);
    if (id > 0) {
        getAdviceById(id);
        // Clear the input after fetching
        if (adviceInputElement)
            adviceInputElement.value = '';
    }
    else {
        if (resultsAdviceParagraph)
            resultsAdviceParagraph.textContent = 'Please enter a valid ID!';
    }
});
