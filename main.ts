// --- Types for API responses ---
type AdviceSlipResponse = { slip: { id: number; advice: string } };
type AdviceErrorResponse = { message: { type: string; text: string } };
type AdviceByIdResponse = AdviceSlipResponse | AdviceErrorResponse;

// --- DOM elements ---
const resultsAdviceParagraph =
  document.querySelector<HTMLParagraphElement>('#results');
const adviceIdHeading =
  document.querySelector<HTMLHeadingElement>('#advice-id');
const getDataBtn = document.querySelector<HTMLButtonElement>('#getData');
const getByIdBtn = document.querySelector<HTMLButtonElement>('#getById');
const adviceInputElement =
  document.querySelector<HTMLInputElement>('#advice-input');

// --- Fetch random advice ---
function fetchRandomAdvice(): void {
  fetch('https://api.adviceslip.com/advice', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<AdviceSlipResponse>;
    })
    .then((data) => {
      const adviceObj = data.slip;
      if (adviceIdHeading)
        adviceIdHeading.textContent = `ADVICE #${adviceObj.id}`;
      if (resultsAdviceParagraph)
        resultsAdviceParagraph.textContent = `"${adviceObj.advice}"`;
    })
    .catch((err) => {
      console.error('Error fetching random advice:', err);
      if (resultsAdviceParagraph)
        resultsAdviceParagraph.textContent = 'Error fetching advice!';
      if (adviceIdHeading) adviceIdHeading.textContent = '';
    });
}

// --- Fetch advice by ID ---
function getAdviceById(id: number): void {
  fetch(`https://api.adviceslip.com/advice/${id}`, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<AdviceByIdResponse>;
    })
    .then((data) => {
      if ('slip' in data) {
        const adviceObj = data.slip;
        if (adviceIdHeading)
          adviceIdHeading.textContent = `ADVICE #${adviceObj.id}`;
        if (resultsAdviceParagraph)
          resultsAdviceParagraph.textContent = `"${adviceObj.advice}"`;
      } else if ('message' in data) {
        if (resultsAdviceParagraph)
          resultsAdviceParagraph.textContent = data.message.text;
        if (adviceIdHeading) adviceIdHeading.textContent = '';
      } else {
        if (resultsAdviceParagraph)
          resultsAdviceParagraph.textContent = 'No advice found for this ID!';
        if (adviceIdHeading) adviceIdHeading.textContent = '';
      }
    })
    .catch((err) => {
      console.error('Error fetching advice by ID:', err);
      if (resultsAdviceParagraph)
        resultsAdviceParagraph.textContent = 'Error fetching advice!';
      if (adviceIdHeading) adviceIdHeading.textContent = '';
    });
}

// --- Event listeners ---
getDataBtn?.addEventListener('click', () => fetchRandomAdvice());

getByIdBtn?.addEventListener('click', () => {
  const id = Number(adviceInputElement?.value);
  if (id > 0) {
    getAdviceById(id);
    // Clear the input after fetching
    if (adviceInputElement) adviceInputElement.value = '';
  } else {
    if (resultsAdviceParagraph)
      resultsAdviceParagraph.textContent = 'Please enter a valid ID!';
  }
});
