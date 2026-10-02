const notesInput = document.getElementById("notes");
const lengthSelect = document.getElementById("length");
const languageSelect = document.getElementById("language");
const summarizeBtn = document.getElementById("summarizeBtn");
const resultBox = document.getElementById("result");
const loading = document.getElementById("loading");
const copyBtn = document.getElementById("copyBtn");

summarizeBtn.addEventListener("click", summarizeNotes);

async function summarizeNotes() {

    const notes = notesInput.value.trim();
    const length = lengthSelect.value;
    const language = languageSelect.value;

    if (notes === "") {

        resultBox.innerText =
            "Please paste your notes first.";

        return;
    }

    loading.classList.remove("hidden");

    resultBox.innerText = "";

    summarizeBtn.disabled = true;

    summarizeBtn.innerText =
        "Summarizing...";

    const promptData = {
        notes: notes,
        length: length,
        language: language
    };

    try {

        const response = await fetch(
            "PASTE_YOUR_RENDER_BACKEND_URL_HERE/summarize",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(promptData)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Backend request failed."
            );
        }

        if (!data.summary) {

            throw new Error(
                "AI did not return a summary."
            );
        }

        resultBox.innerText =
            data.summary;

    } catch (error) {

        console.error(error);

        resultBox.innerText =
            "Error: " + error.message;

    } finally {

        loading.classList.add("hidden");

        summarizeBtn.disabled = false;

        summarizeBtn.innerText =
            "✨ Summarize Notes";
    }
}


copyBtn.addEventListener(
    "click",
    async function () {

        const text =
            resultBox.innerText.trim();

        if (
            text === "" ||
            text ===
            "Your summarized notes will appear here."
        ) {

            resultBox.innerText =
                "Generate a summary first.";

            return;
        }

        try {

            await navigator.clipboard
                .writeText(text);

            copyBtn.innerText =
                "Copied!";

            setTimeout(
                function () {

                    copyBtn.innerText =
                        "Copy";

                },
                1500
            );

        } catch (error) {

            console.error(error);

            resultBox.innerText =
                "Unable to copy the summary.";
        }
    }
);