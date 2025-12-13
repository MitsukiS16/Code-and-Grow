document.addEventListener('DOMContentLoaded', function() {
  const money = localStorage.getItem('money') || 0;
  const totalCoinsEl = document.getElementById('totalCoins');
  if (totalCoinsEl) {
    totalCoinsEl.textContent = money;
  }

  createConfetti();
});

function createConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    container.appendChild(confetti);
  }
}