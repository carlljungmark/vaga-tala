
    // --- Fallbackfrågor (används om extern questions.json inte kan laddas) ---
    // placera detta högst upp i scriptet, innan loadQuestions()
var fallbackQuestionsObj = {
  "test": "PRPSA",
  "scaleMin": 1,
  "scaleMax": 5,
  "reversedItems": [4,6,7,8,11,12,15,16,17,18,24,26],
  "questions": [
    { "id": 1, "text": "NNär jag förbereder mig för ett tal känner jag mig spänd och nervös." },
    { "id": 2, "text": "Jag blir spänd när jag ser ordet 'tal' eller 'presentation' i en uppgift." },
    { "id": 3, "text": "Mina tankar blir förvirrade och ihoptrasslade när jag håller ett tal." },
    { "id": 4, "text": "Direkt efter att ha hållit ett tal känner jag att jag haft en behaglig upplevelse." },
    { "id": 5, "text": "Jag blir ängslig när jag tänker på att ett tal närmar sig." },
    { "id": 6, "text": "Jag är inte rädd för att hålla tal." },
    { "id": 7, "text": "Fastän jag är nervös strax innan ett tal, lugnar jag mig snart när jag börjar prata." },
    { "id": 8, "text": "Jag ser fram emot att hålla ett tal." },
    { "id": 9, "text": "När läraren meddelar en taluppgift känner jag hur jag blir nervös." },
    { "id":10, "text": "Mina händer skakar när jag håller ett tal." },
    { "id":11, "text": "Jag känner mig avslappnad när jag håller ett tal." },
    { "id":12, "text": "Jag tycker om att förbereda ett tal." },
    { "id":13, "text": "Jag är ständigt rädd för att glömma det jag förberett att säga." },
    { "id":14, "text": "Jag blir ängslig om någon ställer en fråga om mitt ämne som jag inte kan svara på." },
    { "id":15, "text": "Jag tar mig an uppgiften att hålla ett tal med självförtroende." },
    { "id":16, "text": "Jag känner att jag har full kontroll över mig själv när jag håller ett tal." },
    { "id":17, "text": "Mitt sinne är klart när jag håller ett tal." },
    { "id":18, "text": "Jag bävar inte för att hålla tal." },
    { "id":19, "text": "Jag svettas strax innan jag börjar ett tal." },
    { "id":20, "text": "Mitt hjärta slår mycket fort när jag precis har börjat tala." },
    { "id":21, "text": "Jag upplever mycket ångest medan jag sitter i rummet strax innan mitt tal börjar." },
    { "id":22, "text": "Vissa delar av min kropp blir mycket spända och stela när jag håller ett tal." },
    { "id":23, "text": "Att inse att det bara är lite tid kvar i mitt tal gör mig mycket ängslig." },
    { "id":24, "text": "När jag håller ett tal vet jag att jag kan kontrollera mina känslor av spänning och stress." },
    { "id":25, "text": "Jag andas snabbare strax innan jag börjar ett tal." },
    { "id":26, "text": "Jag känner mig bekväm och avslappnad strax innan jag ska hålla ett tal." },
    { "id":27, "text": "Jag presterar sämre på tal på grund av att jag är ängslig." },
    { "id":28, "text": "Jag blir ängslig när läraren meddelar datum för en taluppgift." },
    { "id":29, "text": "När jag gör ett misstag under ett tal har jag svårt att koncentrera mig på det som följer." },
    { "id":30, "text": "Under ett viktigt tal får jag en känsla av hjälplöshet som växer inom mig." },
    { "id":31, "text": "Jag har svårt att somna natten innan ett tal." },
    { "id":32, "text": "Mitt hjärta slår mycket fort när jag presenterar ett tal." },
    { "id":33, "text": "Jag känner mig ängslig medan jag väntar på att få hålla mitt tal." },
    { "id":34, "text": "När jag håller ett tal blir jag så nervös att jag glömmer information jag egentligen vet." }
  ]
};

    // Reversed indices (0-baserade)
    const reversedIndices = [3,5,6,7,10,11,14,15,16,17,23,25];

    // Funktion för att initiera formuläret med en lista av frågor
function initForm(obj) {
  const questionsContainer = document.getElementById('questions');
  questionsContainer.innerHTML = '';

  const scaleMin = Number(obj.scaleMin) || 1;
  const scaleMax = Number(obj.scaleMax) || 5;
  const mid = Math.floor((scaleMin + scaleMax) / 2);

  // Convert reversedItems (1-based) to 0-based indices for intern användning
  const reversedIndices = (Array.isArray(obj.reversedItems) ? obj.reversedItems.map(n => Number(n) - 1) : []);

  // Spara för senare beräkning
  window._prpsa_reversedIndices = reversedIndices;
  window._prpsa_scaleMin = scaleMin;
  window._prpsa_scaleMax = scaleMax;

  obj.questions.forEach((qObj, i) => {
    const row = document.createElement('div');
    row.className = 'mb-3 question';
    row.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-8">
          <label class="form-label mb-1"><strong>Fråga ${qObj.id}.</strong> ${qObj.text}</label>

        </div>
        <div class="col-md-4">
          <div class="d-flex align-items-center gap-2">
            <input type="range"
                   min="${scaleMin}"
                   max="${scaleMax}"
                   value="${mid}"
                   class="form-range"
                   style="max-width:180px"
                   data-index="${i}"
                   id="q${i}">
            <div class="slider-value">${mid}</div>
          </div>
        </div>
      </div>
    `;
    const range = row.querySelector('input[type=range]');
    const valBox = row.querySelector('.slider-value');
    range.addEventListener('input', (e)=> { valBox.textContent = e.target.value; });
    questionsContainer.appendChild(row);
  });

  document.getElementById('scale-note').textContent = `Skala ${scaleMin}–${scaleMax}. Alla ${obj.questions.length} frågor måste besvaras.`;
  document.getElementById('prpsa-form').style.display = 'block';
 
}

    // Hämta frågor antingen från questions.json (samma domän) eller fallback
   function loadQuestions() {
  fetch('/assets/js/questions.json')
    .then(resp => {
      if (!resp.ok) throw new Error('Kunde inte hämta questions.json (status ' + resp.status + ')');
      return resp.json();
    })
    .then(data => {
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        initForm(data);
      } else {
        throw new Error('questions.json-returnerade data var inte i förväntat format.');
      }
    })
    .catch(err => {
      console.warn('Laddning av extern questions.json misslyckades:', err);
      // använd fallbackQuestionsObj som du definierar någonstans i din kod
      setTimeout(()=> {
        initForm(fallbackQuestionsObj);
        const info = document.createElement('div');
        info.className = 'alert alert-info mt-2';
        info.innerHTML = '<strong>Observera:</strong> frågorna laddades inte från en extern fil — använder inbyggd fallback. Kör sidan via en lokal server om du vill ladda extern JSON.';
        document.querySelector('.container').insertBefore(info, document.getElementById('prpsa-form'));
      }, 300);
    });
}

    // Hjälpfunktion för att hämta alla svar
function getAnswers(questionsCount) {
  const values = [];
  for (let i = 0; i < questionsCount; i++) {
    const el = document.getElementById('q' + i);
    values.push(el ? Number(el.value) : NaN);
  }
  return values;
}

    // Beräkna PRPSA enligt manualen
function computePRPSA(values) {
  const reversedIndices = window._prpsa_reversedIndices || [];
  let step1 = 0;
  let step2 = 0;
  for (let i = 0; i < values.length; i++) {
    if (reversedIndices.includes(i)) step2 += values[i];
    else step1 += values[i];
  }
  const score = 72 - step2 + step1;
  return { score, step1, step2 };
}

    function interpretation(score){
      if(score > 131) return {label:'Hög ångest', desc:'Hög nivå av rädsla för att tala inför publik. Överväg uppföljning eller strukturerad träning.'};
      if(score >= 98) return {label:'Måttlig ångest', desc:'Måttlig nivå som kan påverka prestation. Träning, exponering och tekniker kan hjälpa.'};
      return {label:'Låg ångest', desc:'Relativt låg nivå av rädsla för att tala inför publik.'};
    }

    // Event listener för submit
    document.addEventListener('DOMContentLoaded',()=>{
      loadQuestions();

      document.getElementById('prpsa-form').addEventListener('submit',(e)=>{
        e.preventDefault();
        const questionsCount = document.querySelectorAll('#questions .question').length;
        const values = getAnswers(questionsCount);
        if(values.some(v=>isNaN(v))){ alert('Alla frågor måste besvaras.'); return; }
        const {score, step1, step2} = computePRPSA(values);
        const interp = interpretation(score);

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
          <div class="card shadow-sm my-3 bg-light">
            <div class="card-body">
              <h4 class="card-title">Ditt resultat: ${score} poäng</h4>
              <h6 class="text-muted">${interp.label}</h6>
              <p>${interp.desc}</p>
              <hr>

              <p class="mb-0"><small class="text-muted">Tolkning: Låg &lt;98, Måttlig 98–131, Hög &gt;131 (källa: PRPSA-manual).</small></p>
            </div>
          </div>
        `;
        resultDiv.scrollIntoView({behavior:'smooth'});
      });
    });

