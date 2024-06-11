document.querySelector("button").addEventListener("click",result)

async function result() {
    const word = document.getElementById("wordInput").value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const res= await fetch(url);
        if (!res.ok) {
            throw new Error('Word not found');
        }

        const data = await res.json();
        Definition(data);
    } catch (error) {
        catchError(error.message);
    }
}

function Definition(data) {
    var definitionContainer = document.getElementById("definitionContainer");
    definitionContainer.innerHTML = "";

    data.forEach(entry => {
        entry.meanings.forEach(meaning => {
            var definitionDiv = document.createElement("div");
            definitionDiv.className=("definition");

            var partOfSpeech = document.createElement("h5");
            partOfSpeech.textContent =`Part of speech: ${meaning.partOfSpeech}`;

            var definitionsList = document.createElement("ul");
            meaning.definitions.forEach(worddef => {
                const listworddef= document.createElement("li");
                listworddef.textContent = worddef.definition;
                definitionsList.append(listworddef);
            });

            definitionDiv.append(partOfSpeech);
            definitionDiv.append(definitionsList);
            definitionContainer.append(definitionDiv);
        });

        // Add audio pronunciation if available
        if (entry.phonetics && entry.phonetics.length > 0) {
            entry.phonetics.forEach(phonetic => {

                if (phonetic.audio) {
                    const audio = document.createElement("div");
                    audio.className=("audio-control");

                    var audiocontrols = document.createElement("audio");
                    audiocontrols.controls = true;
                    audiocontrols.src = phonetic.audio;

                    var audioLabel = document.createElement("p");
                    audioLabel.textContent = `Pronunciation: ${phonetic.text || 'Click to play'}`;

                    audio.append(audioLabel);
                    audio.appendChild(audiocontrols);
                    definitionContainer.append(audio);
                }
            });
        }
    });
}

function catchError(message) {
    const definitionContainer = document.getElementById("definitionContainer");
    definitionContainer.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
}
