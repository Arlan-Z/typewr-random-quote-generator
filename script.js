document.addEventListener('DOMContentLoaded', async function() {
    const typedTextElement = document.getElementById('typewriter-text');
    const cursorElement = document.getElementById('typewriter-cursor');

    if (!typedTextElement || !cursorElement) {
        console.error("Required <div> elements (#typewriter-text or #typewriter-cursor) not found!");
        return;
    }

    const TYPING_SPEED_MS = 100;
    const UNTYPING_SPEED_MS = 60;
    const PAUSE_AFTER_TYPING_MS = 2500;
    const PAUSE_AFTER_UNTYPING_MS = 700;
    const INITIAL_DELAY_MS = 500;

    let currentText = "This is the default text if quotes fail to load.";
    let charIndex = 0;
    let allQuotes = [];

    function getRandomQuote() {
        if (!allQuotes || allQuotes.length === 0) {
            return "This is a very long string of text that should automatically wrap to multiple lines if it doesn't fit within the specified container width. We can also use the \nnewline character.";
        }
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        return allQuotes[randomIndex].quote;
    }

    try {
        allQuotes = await fetchData();
        if (allQuotes && allQuotes.length > 0) {
            currentText = getRandomQuote();
        } else {
            console.warn("Quotes not loaded or array is empty. Using default text.");
        }
    } catch (error) {
        console.error("Error during initial quote loading:", error);
    }

    typedTextElement.textContent = ''; 


    function type() {
        cursorElement.style.animation = 'none'; 
        cursorElement.style.backgroundColor = 'orange'; 

        if (charIndex < currentText.length) {
            typedTextElement.textContent += currentText.charAt(charIndex);
            charIndex++;
            setTimeout(type, TYPING_SPEED_MS);
        } else {
            cursorElement.style.animation = 'blink-caret .75s step-end infinite'; 
            setTimeout(untype, PAUSE_AFTER_TYPING_MS);
        }
    }


    function untype() {
        cursorElement.style.animation = 'none'; 
        cursorElement.style.backgroundColor = 'orange'; 

        if (charIndex > 0) {
            typedTextElement.textContent = currentText.slice(0, charIndex - 1);
            charIndex--;
            setTimeout(untype, UNTYPING_SPEED_MS);
        } else {
            currentText = getRandomQuote();
            cursorElement.style.animation = 'blink-caret .75s step-end infinite'; 
            setTimeout(type, PAUSE_AFTER_UNTYPING_MS);
        }
    }

    cursorElement.style.animation = 'blink-caret .75s step-end infinite'; 
    setTimeout(type, INITIAL_DELAY_MS);
});

async function fetchData() {
    try {
        const response = await fetch('quotes.json'); 
        if (!response.ok) {
            throw new Error(`JSON not found: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            console.error('Data from quotes.json is not an array.');
            return [{ quote: "Error: invalid data format in quotes.json" }]; 
        }
        if (data.length > 0 && !data.some(q => q.quote.length > 100)) {
             data.push({quote: "This is a very long test quote added to check line wrapping. It should display correctly on multiple lines if the container width is limited. We are testing this."});
             data.push({quote: "Another phrase.\nWith a forced line break\nusing the newline character."});
        }
        return data;
    } catch (error) {
        console.error('Error loading data (fetchData):', error);
        return [{ quote: "Failed to load quotes. Please try again later." }]; 
    }
}