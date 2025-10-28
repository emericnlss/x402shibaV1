const STORAGE_KEY = 'x402shiba_tasks_v1';
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function refreshNextState() {
  const allKeys = ['follow', 'interact', 'wallet'];
  const allDone = allKeys.every(k => !!state[k]);
  const enterBtn = document.querySelector('#enterBtn');
  enterBtn.disabled = !allDone;
}

function markDone(key, button) {
  // Empêche de mettre "true" pour le wallet
  if (key !== 'wallet') {
    state[key] = true;
    button.classList.add('done');
    saveState();
    refreshNextState();
  }
}

function openAndMark(btn) {
  const link = btn.dataset.link || '#';
  const key = btn.dataset.key;
  window.open(link, '_blank', 'noopener,noreferrer');
  markDone(key, btn);
}

function restoreButtons() {
  // Follow / Interact
  document.querySelectorAll('.task-btn').forEach(btn => {
    const key = btn.dataset.key;
    if (key !== 'wallet') {
      if (state[key]) btn.classList.add('done');
      btn.addEventListener('click', () => openAndMark(btn));
    }
  });

  // Wallet input + Done
  const walletInput = document.getElementById('walletInput');
  const walletBtn = document.getElementById('walletBtn');

  if (state.wallet && typeof state.wallet === 'string') {
    walletInput.value = state.wallet;
    walletBtn.classList.add('done');
    walletInput.disabled = true;
    walletBtn.disabled = true;
  }

  walletBtn.addEventListener('click', () => {
    const value = walletInput.value.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      alert('Please enter a valid Ethereum address (starts with 0x...)');
      return;
    }
    state.wallet = value;
    saveState();
    walletBtn.classList.add('done');
    walletInput.disabled = true;
    walletBtn.disabled = true;
    refreshNextState();
  });
}

function wireEnter() {
  const enterBtn = document.getElementById('enterBtn');
  enterBtn.addEventListener('click', () => {
    if (enterBtn.disabled) return;
    window.location.href = 'welcome.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  restoreButtons();
  wireEnter();
  refreshNextState();
});
