document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prpsa-static-form');
    if (!form) return;

    // Index för frågor som ska räknas omvänt (0-baserat)
    const reversedIndices = [3, 5, 6, 7, 10, 11, 14, 15, 16, 17, 23, 25];
    const totalQuestions = 34;

    // Uppdatera siffra vid slidern när man drar i den
    document.querySelectorAll('.form-range').forEach(range => {
        range.addEventListener('input', (e) => {
            const badge = e.target.parentElement.querySelector('.q-val');
            if (badge) badge.textContent = e.target.value;
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let step1 = 0; // Normala frågor
        let step2 = 0; // Omvända frågor

        for (let i = 0; i < totalQuestions; i++) {
            const val = parseInt(document.getElementById(`q${i}`)?.value || 3);
            if (reversedIndices.includes(i)) {
                step2 += val;
            } else {
                step1 += val;
            }
        }

        // PRPSA Formel: 72 - (omvända) + (normala)
        const score = 72 - step2 + step1;
        showResult(score);
    });

    function showResult(score) {
        const resultContainer = document.getElementById('result-container');
        const scoreDisplay = document.getElementById('score-display');
        const labelDisplay = document.getElementById('label-display');
        const descDisplay = document.getElementById('desc-display');
        const progressBar = document.getElementById('score-progress');
        const resultHeader = document.getElementById('result-header');

        // Beräkna procent för progress bar (min 34, max 170)
        const percent = ((score - 34) / (170 - 34)) * 100;
        
        scoreDisplay.textContent = score;
        resultContainer.classList.remove('d-none');
        
        let label = "";
        let desc = "";
        let colorClass = "";
        let bgHeader = "";

        if (score > 131) {
            label = "Hög talängslan";
            desc = "Du upplever en hög nivå av oro inför att tala. Detta är vanligt och det finns effektiva metoder för att hantera det.";
            colorClass = "bg-danger";
            bgHeader = "#dc3545";
        } else if (score >= 98) {
            label = "Måttlig talängslan";
            desc = "Du känner viss oro inför framträdanden, vilket delas av de flesta. Med lite träning kan du känna dig betydligt tryggare.";
            colorClass = "bg-warning";
            bgHeader = "#ffc107";
        } else {
            label = "Låg talängslan";
            desc = "Du känner dig generellt trygg med att tala inför andra. Fortsätt utmana dig själv!";
            colorClass = "bg-success";
            bgHeader = "#198754";
        }

        // Uppdatera UI
        labelDisplay.textContent = label;
        descDisplay.textContent = desc;
        resultHeader.style.backgroundColor = bgHeader;
        
        // Progress bar animering
        progressBar.className = `progress-bar progress-bar-striped progress-bar-animated ${colorClass}`;
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', score);

        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});