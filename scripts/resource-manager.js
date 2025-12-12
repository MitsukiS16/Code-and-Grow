const DEFAULT_ENERGY = 5;
const DEFAULT_HEALTH = 5;
const DEFAULT_MONEY = 0;

const MONEY_REWARDS = {
  1: { base: 10, perClass: 2 }, // Level 1: 10 + class * 2
  2: { base: 20, perClass: 3 }, // Level 2: 20 + class * 3
  3: { base: 30, perClass: 5 }, // Level 3: 30 + class * 5
};

function getEnergy() {
  return parseInt(localStorage.getItem("energy") ?? DEFAULT_ENERGY);
}
function getHealth() {
  return parseInt(localStorage.getItem("health") ?? DEFAULT_HEALTH);
}
function getMoney() {
  return parseInt(localStorage.getItem("money") ?? DEFAULT_MONEY);
}

function setEnergy(value) {
  const newValue = Math.max(0, Math.min(5, value));
  localStorage.setItem("energy", newValue);
  updateResourceDisplay();
  return newValue;
}
function setHealth(value) {
  const newValue = Math.max(0, Math.min(5, value));
  localStorage.setItem("health", newValue);
  updateResourceDisplay();
  return newValue;
}
function setMoney(value) {
  const newValue = Math.max(0, value);
  localStorage.setItem("money", newValue);
  updateResourceDisplay();
  return newValue;
}

function useEnergy() {
  const current = getEnergy();
  if (current > 0) {
    setEnergy(current - 1);
    return true;
  }
  return false;
}

function loseHealth() {
  const current = getHealth();
  if (current > 0) {
    setHealth(current - 1);
    return current - 1;
  }
  return 0;
}

function gainMoney(level, classNum) {
  const reward = MONEY_REWARDS[level] || { base: 10, perClass: 2 };
  const amount = reward.base + classNum * reward.perClass;
  const current = getMoney();
  setMoney(current + amount);
  return amount;
}

// not used currently
// function restoreEnergy(amount = 10) {
//   setEnergy(getEnergy() + amount);
// }
// function restoreHealth(amount = 10) {
//   setHealth(getHealth() + amount);
// }
// function resetAllResources() {
//   localStorage.setItem('energy', DEFAULT_ENERGY);
//   localStorage.setItem('health', DEFAULT_HEALTH);
//   localStorage.setItem('money', DEFAULT_MONEY);
//   updateResourceDisplay();
// }

function updateResourceDisplay() {
  const energyDisplay = document.getElementById("energyDisplay");
  const healthDisplay = document.getElementById("healthDisplay");
  const moneyDisplay = document.getElementById("moneyDisplay");

  if (energyDisplay) {
    energyDisplay.textContent = `${getEnergy()}/5`;
  }
  if (healthDisplay) {
    healthDisplay.textContent = `${getHealth()}/5`;
  }
  if (moneyDisplay) {
    moneyDisplay.textContent = getMoney();
  }
}

// Wait for top bar to be loaded
document.addEventListener("topbar-loaded", () => {
  if (localStorage.getItem("energy") === null) {
    localStorage.setItem("energy", DEFAULT_ENERGY);
  }
  if (localStorage.getItem("health") === null) {
    localStorage.setItem("health", DEFAULT_HEALTH);
  }
  if (localStorage.getItem("money") === null) {
    localStorage.setItem("money", DEFAULT_MONEY);
  }

  updateResourceDisplay();
});

// after sleep
function fullRestore() {
  setEnergy(5);
  setHealth(5);
}
