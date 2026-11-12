const $ = s => document.querySelector(s);
const show = id => document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
let tt;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 1800) }
document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g && g.dataset.go !== 'settings') show(g.dataset.go);
    const a = e.target.closest('[data-act]'); if (a) toast('Em breve: ' + a.dataset.act); // TODO: carregar a cena
});
const OPTIONS = { bright: ['Baixo', 'Médio', 'Alto'], audio: ['Desligado', 'Ligado'], res: ['1280x720', '1920x1080'], subs: ['Desligado', 'Ligado'] };
const DEFAULTS = { bright: 1, audio: 0, res: 1, subs: 0 };
let saved = { ...DEFAULTS }, draft;
try { Object.assign(saved, JSON.parse(localStorage.getItem('ashen-cfg') || '{}')) } catch (e) { }
draft = { ...saved };
function render() {
    for (const k in OPTIONS) $('#o-' + k).textContent = OPTIONS[k][draft[k]];
    $('#stage').style.filter = 'brightness(' + [.7, 1, 1.25][draft.bright] + ')';
}
for (const k in OPTIONS) $('#o-' + k).addEventListener('click', () => { draft[k] = (draft[k] + 1) % OPTIONS[k].length; render() });
function openSettings() { draft = { ...saved }; render(); show('settings') }
function closeSettings() { draft = { ...saved }; render(); show('home') }
document.querySelector('[data-go="settings"]').addEventListener('click', openSettings);
$('#cfgBack').addEventListener('click', closeSettings);
$('#cancel').addEventListener('click', closeSettings);
$('#save').addEventListener('click', () => { saved = { ...draft }; try { localStorage.setItem('ashen-cfg', JSON.stringify(saved)) } catch (e) { }; show('home'); toast('Configurações salvas') });
render();