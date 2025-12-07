const DEFAULT_ENERGY = 10;
const DEFAULT_HEALTH = 10;
const DEFAULT_MONEY = 50;

const MONEY_REWARDS = {
  1: { base: 10, perClass: 2 },   // Level 1: 10 + class * 2
  2: { base: 20, perClass: 3 },   // Level 2: 20 + class * 3
  3: { base: 30, perClass: 5 }    // Level 3: 30 + class * 5
};

function getEnergy() {
  return parseInt(localStorage.getItem('energy') ?? DEFAULT_ENERGY);
}

function getHealth() {
  return parseInt(localStorage.getItem('health') ?? DEFAULT_HEALTH);
}

function getMoney() {
  return parseInt(localStorage.getItem('money') ?? DEFAULT_MONEY);
}

function setEnergy(value) {
  const newValue = Math.max(0, Math.min(10, value)); // 0-10
  localStorage.setItem('energy', newValue);
  updateResourceDisplay();
  return newValue;
}

function setHealth(value) {
  const newValue = Math.max(0, Math.min(10, value)); // 0-10
  localStorage.setItem('health', newValue);
  updateResourceDisplay();
  return newValue;
}

function setMoney(value) {
  const newValue = Math.max(0, value);
  localStorage.setItem('money', newValue);
  updateResourceDisplay();
  return newValue;
}

// use energy (start class)
function useEnergy() {
  const current = getEnergy();
  if (current > 0) {
    setEnergy(current - 1);
    return true;
  }
  return false; // no energy left
}

// lose health (fail class)
function loseHealth() {
  const current = getHealth();
  if (current > 0) {
    setHealth(current - 1);
    return current - 1;
  }
  return 0;
}

// gain money (complete class)
function gainMoney(level, classNum) {
  const reward = MONEY_REWARDS[level] || { base: 10, perClass: 2 };
  const amount = reward.base + (classNum * reward.perClass);
  const current = getMoney();
  setMoney(current + amount);
  return amount;
}

// restore energy
function restoreEnergy(amount = 10) {
  setEnergy(getEnergy() + amount);
}

// restore health
function restoreHealth(amount = 10) {
  setHealth(getHealth() + amount);
}

// reset all resources to default
function resetAllResources() {
  localStorage.setItem('energy', DEFAULT_ENERGY);
  localStorage.setItem('health', DEFAULT_HEALTH);
  localStorage.setItem('money', DEFAULT_MONEY);
  updateResourceDisplay();
}

// update resource display on the page
function updateResourceDisplay() {
  const energyDisplay = document.getElementById('energyDisplay');
  const healthDisplay = document.getElementById('healthDisplay');
  const moneyDisplay = document.getElementById('moneyDisplay');
  
  if (energyDisplay) {
    energyDisplay.textContent = `${getEnergy()}/10`;
  }
  if (healthDisplay) {
    healthDisplay.textContent = `${getHealth()}/10`;
  }
  if (moneyDisplay) {
    moneyDisplay.textContent = getMoney();
  }
}

// check if player can play (has energy and health)
function canPlay() {
  return getEnergy() > 0 && getHealth() > 0;
}

function checkGameOver() {
  if (getHealth() <= 0) {
    alert('Game Over! You ran out of health.');
    window.location.href = '/main-pages/start-menu.html';
    return true;
  }
  if (getEnergy() <= 0) {
    alert('No energy left! Please rest to restore energy.');
    return true;
  }
  return false;
}

// Initialize resources on page load
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('energy') === null) {
    localStorage.setItem('energy', DEFAULT_ENERGY);
  }
  if (localStorage.getItem('health') === null) {
    localStorage.setItem('health', DEFAULT_HEALTH);
  }
  if (localStorage.getItem('money') === null) {
    localStorage.setItem('money', DEFAULT_MONEY);
  }
  
  updateResourceDisplay();
});