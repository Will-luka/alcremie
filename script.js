const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const spAtkInput = document.getElementById('spAtk');
const levelInput = document.getElementById('level');
const erro = document.getElementById('erro');
const buildError = document.getElementById('buildError');
const botao = document.getElementById('calcular');
const spAtkSpecsStacks = document.getElementById('spAtkSpecsStacks');
const driveLensStacks = document.getElementById('driveLensStacks');
const spAtkFinalText = document.getElementById('spAtkFinalText');
const itemChecks = [...document.querySelectorAll('.item')];

function formatNumber(value) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function selectedItems() {
  return itemChecks.filter(i => i.checked).map(i => i.value);
}

function enforceItemLimit() {
  const count = selectedItems().length;
  buildError.textContent = count > 3 ? 'Você pode selecionar no máximo 3 itens.' : '';
  botao.disabled = count > 3;
}

function compute() {
  const baseSpAtk = Number(spAtkInput.value);
  const level = Number(levelInput.value);

  if (spAtkInput.value === '' || levelInput.value === '' || Number.isNaN(baseSpAtk) || Number.isNaN(level)) {
    erro.textContent = 'Preencha SpAtk base e Level com números válidos.';
    return;
  }

  const items = selectedItems();
  if (items.length > 3) {
    erro.textContent = 'Selecione no máximo 3 itens.';
    return;
  }

  let spStacks = Number(spAtkSpecsStacks.value);
  let driveStacks = Number(driveLensStacks.value);

  if (Number.isNaN(spStacks) || spStacks < 1) spStacks = 1;
  if (spStacks > 6) spStacks = 6;

  if (Number.isNaN(driveStacks) || driveStacks < 0) driveStacks = 0;
  if (driveStacks > 20) driveStacks = 20;

  spAtkSpecsStacks.value = spStacks;
  driveLensStacks.value = driveStacks;

  erro.textContent = '';

  let spAtkFinal = baseSpAtk;

  if (items.includes('wiseGlasses')) spAtkFinal += 44 + baseSpAtk * 0.07;
  if (items.includes('spAtkSpecs')) spAtkFinal += 28 + 16 * spStacks;
  if (items.includes('choiceSpecs')) spAtkFinal += 44;
  if (items.includes('driveLens')) spAtkFinal += 28 + baseSpAtk * (0.006 * driveStacks);

  const recoverCuraBase = 2.6 * spAtkFinal + 16 * (level - 1) + 330;
  const recoverBoostBase = 3.9 * spAtkFinal + 24 * (level - 1) + 495;

  const choiceBonus = items.includes('choiceSpecs') ? (60 + 0.40 * spAtkFinal) : 0;

  let recoverCuraFinal = recoverCuraBase;
  let recoverBoostFinal = recoverBoostBase;

  if (items.includes('rescueHood')) {
    recoverCuraFinal *= 1.17;
    recoverBoostFinal *= 1.17;
  }

  const sweetExplosion = 0.74 * spAtkFinal + 9 * (level - 1) + 246 + choiceBonus;
  const sweetOuter = 1.05 * spAtkFinal + 12 * (level - 1) + 345 + choiceBonus;

  document.querySelector('[data-output="recoverCura"]').textContent = formatNumber(recoverCuraFinal);
  document.querySelector('[data-output="recoverBoost"]').textContent = formatNumber(recoverBoostFinal);
  document.querySelector('[data-output="sweetExplosion"]').textContent = formatNumber(sweetExplosion);
  document.querySelector('[data-output="sweetOuter"]').textContent = formatNumber(sweetOuter);
  spAtkFinalText.textContent = `SpAtk final calculado: ${formatNumber(spAtkFinal)}`;
}

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

itemChecks.forEach(chk => chk.addEventListener('change', () => {
  enforceItemLimit();
  compute();
}));

[spAtkInput, levelInput, spAtkSpecsStacks, driveLensStacks].forEach(el => el.addEventListener('input', compute));
botao.addEventListener('click', compute);

enforceItemLimit();
compute();
