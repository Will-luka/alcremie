const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const spAtk = document.getElementById('spAtk');
const level = document.getElementById('level');
const erro = document.getElementById('erro');
const botao = document.getElementById('calcular');

function formatNumber(value) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function calc() {
  const s = Number(spAtk.value);
  const l = Number(level.value);

  if (spAtk.value === '' || level.value === '' || Number.isNaN(s) || Number.isNaN(l)) {
    erro.textContent = 'Preencha SpAtk e Level com números válidos.';
    return;
  }

  erro.textContent = '';
  const recoverCura = 2.6 * s + 16 * (l - 1) + 330;
  const recoverBoost = 3.9 * s + 24 * (l - 1) + 495;
  const sweetExplosion = 0.74 * s + 9 * (l - 1) + 246;
  const sweetOuter = 1.05 * s + 12 * (l - 1) + 345;

  document.querySelector('[data-formula="recoverCura"]').textContent = formatNumber(recoverCura);
  document.querySelector('[data-formula="recoverBoost"]').textContent = formatNumber(recoverBoost);
  document.querySelector('[data-formula="sweetExplosion"]').textContent = formatNumber(sweetExplosion);
  document.querySelector('[data-formula="sweetOuter"]').textContent = formatNumber(sweetOuter);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

botao.addEventListener('click', calc);
[spAtk, level].forEach(input => input.addEventListener('input', calc));
