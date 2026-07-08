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

function validateStacks() {
  const s = Number(spAtkSpecsStacks.value);
  const d = Number(driveLensStacks.value);
  if (Number.isNaN(s) || s < 1 || s > 6) return 'Sp Atk Specs deve ter entre 1 e 6 stacks.';
  if (Number.isNaN(d) || d < 0 || d > 20) return 'Drive Lens deve ter entre 0 e 20 stacks.';
  return '';
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

  const stackError = validateStacks();
  if (stackError) {
    erro.textContent = stackError;
    return;
  }

  erro.textContent = '';
  const spStacks = Number(spAtkSpecsStacks.value);
  const driveStacks = Number(driveLensStacks.value);

  let spAtkFinal = baseSpAtk;
  let rescueHood = false;

  if (items.includes('wiseGlasses')) spAtkFinal += 44 + baseSpAtk * 0.07;
  if (items.includes('spAtkSpecs')) spAtkFinal += 28 + 16 * spStacks;
  if (items.includes('choiceSpecs')) spAtkFinal += 44;
  if (items.includes('driveLens')) spAtkFinal += 28 + baseSpAtk * (0.006 * driveStacks);
  if (items.includes('rescueHood')) rescueHood = true;

  const recoverCura = 2.6 * spAtkFinal + 16 * (level - 1) + 330;
  const recoverBoost = 3.9 * spAtkFinal + 24 * (level - 1) + 495;
  const sweetExplosionBase = 0.74 * spAtkFinal + 9 * (level - 1) + 246;
  const sweetOuterBase = 1.05 * spAtkFinal + 12 * (level - 1) + 345;

  const choiceBonus = items.includes('choiceSpecs') ? (60 + 0.40 * spAtkFinal) : 0;
  const sweetExplosion = sweetExplosionBase + choiceBonus;
  const sweetOuter = sweetOuterBase + choiceBonus;

  const finalCuraMultiplier = rescueHood ? 1.17 : 1;
  const recoverCuraFinal = recoverCura * finalCuraMultiplier;
  const recoverBoostFinal = recoverBoost * finalCuraMultiplier;

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
