const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // do not reload page when submitted
    getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    try {
        resultDiv.innerHTML = "Fetching Data...";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        console.log(data);

        let defn = data[0].meanings[0].definitions[0];

        // Start building the result HTML
        let html = `
            <h2><strong>Word: </strong>${data[0].word}</h2>
        `;

        // Check if audio exists before adding the button
        for (let i=0; i<data[0].phonetics.length; i++) {
            if(data[0].phonetics[i].audio){
                html += `
                    <button id="sound" onclick="playAudio('${data[0].phonetics[i].audio}')">
                        <img src="sound-icon.png" alt="Play Sound" />
                    </button>
                `;
                break;
            }
            
        }

        html += `
            <p class="partOfSpeech">${data[0].meanings[0].partOfSpeech}</p>
            <p><strong>Meaning: </strong>${defn.definition || "Not Found"}</p>
            <p><strong>Example: </strong>${defn.example || "Not Found"}</p>
        `;

        // Antonyms
        html += `<p><strong>Antonyms: </strong></p>`;
        if (!defn.antonyms || defn.antonyms.length === 0) {
            html += `<span>Not Found</span>`;
        } else {
            html += `<ul>`;
            for (let antonym of defn.antonyms) {
                html += `<li>${antonym}</li>`;
            }
            html += `</ul>`;
        }

        // Synonyms
        html += `<p><strong>Synonyms: </strong></p>`;
        if (!defn.synonyms || defn.synonyms.length === 0) {
            html += `<span>Not Found</span><br>`;
        } else {
            html += `<ul>`;
            for (let synonym of defn.synonyms) {
                html += `<li>${synonym}</li>`;
            }
            html += `</ul>`;
        }

        html += `<a href="${data[0].sourceUrls[0]}" target="_blank">Read More</a>`;

        resultDiv.innerHTML = html;

    } catch (error) {
        resultDiv.innerHTML = `<span>Sorry, the word is not found!</span>`;
    }
};

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}
