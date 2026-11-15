const games = document.querySelector('#games');
const message = document.querySelector('#message');
const player = document.querySelector('#player');
const frame = document.querySelector('#game');
const title = document.querySelector('#game-title');
const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'";
let selection = 0;

function observeGameSize(id) {
  let lastHeight = 0;
  let scheduled = false;
  function measure() {
    scheduled = false;
    const body = document.body;
    const bounds = body.getBoundingClientRect();
    const marginBottom = parseFloat(getComputedStyle(body).marginBottom) || 0;
    const height = Math.ceil(Math.max(bounds.bottom, bounds.top + body.scrollHeight) + scrollY + Math.max(0, marginBottom));
    if (height !== lastHeight) {
      lastHeight = height;
      parent.postMessage({ type: 'game-height', id, height }, '*');
    }
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(measure);
    }
  }
  new ResizeObserver(schedule).observe(document.body);
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
  addEventListener('resize', schedule);
  schedule();
}

addEventListener('message', event => {
  if (event.source !== frame.contentWindow || event.data?.type !== 'game-height' ||
      event.data.id !== selection || !Number.isFinite(event.data.height) || event.data.height < 0) return;
  frame.style.height = Math.ceil(event.data.height + frame.offsetHeight - frame.clientHeight) + 'px';
});

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not read ' + url);
  return response.json();
}

async function play(game) {
  const current = ++selection;
  player.hidden = true;
  frame.removeAttribute('srcdoc');
  frame.style.height = '';
  message.textContent = 'Laddar spel…';
  try {
    const { html, css, js } = await loadJson('games/' + game.slug + '.json');
    if (current !== selection) return;
    title.textContent = game.title;
    frame.title = game.title;
    const safeCss = css.replace(/<\/style/gi, '\\3c /style') +
      '\nhtml, body { overflow: hidden !important; }' +
      '\nbody { min-height: 0 !important; }';
    const scriptSource = JSON.stringify(js).replaceAll('<', '\\u003c');
    frame.srcdoc = '<!doctype html><html lang="sv"><meta charset="utf-8">' +
      '<meta http-equiv="Content-Security-Policy" content="' + policy + '">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<style>' + safeCss + '</style><body>' + html +
      '<script>const factoryScript = document.createElement("script");' +
      'factoryScript.textContent = ' + scriptSource + ';document.body.append(factoryScript);' +
      '(' + observeGameSize.toString() + ')(' + current + ');</script>';
    message.textContent = '';
    player.hidden = false;
    title.tabIndex = -1;
    title.focus();
  } catch {
    if (current === selection) message.textContent = 'Spelet kunde inte laddas.';
  }
}

loadJson('games.json').then(catalog => {
  message.textContent = catalog.length ? '' : 'Inga spel ännu.';
  for (const game of catalog) {
    const card = document.createElement('li');
    const button = document.createElement('button');
    const description = document.createElement('p');
    button.textContent = game.title;
    button.dataset.game = game.slug;
    button.addEventListener('click', () => play(game));
    description.textContent = game.description;
    card.append(button, description);
    games.append(card);
  }
}).catch(() => { message.textContent = 'Spelgalleriet kunde inte laddas.'; });
