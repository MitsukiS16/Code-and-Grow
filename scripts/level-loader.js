// ============ Level页面加载器 ============
// 在HTML中需要定义: const CURRENT_LEVEL = 1;

const CLASSES_PER_LEVEL = {
  1: 3,
  2: 3,
  3: 3
};

const TOTAL_LEVELS = 3;

function getCompletedClasses() {
  const saved = localStorage.getItem(`level${CURRENT_LEVEL}_completed`);
  return saved ? JSON.parse(saved) : [];
}

function isUnlocked(classNum) {
  if (classNum === 1) return true;
  const completed = getCompletedClasses();
  return completed.includes(classNum - 1);
}

function isLevelCompleted() {
  const completed = getCompletedClasses();
  const totalClasses = CLASSES_PER_LEVEL[CURRENT_LEVEL] || 3;
  return completed.length >= totalClasses;
}

function updateNodeStatus() {
  const nodes = document.querySelectorAll('.map-node');
  const completed = getCompletedClasses();
  
  nodes.forEach(node => {
    const classNum = parseInt(node.dataset.class);
    
    node.classList.remove('locked', 'completed');
    
    if (completed.includes(classNum)) {
      node.classList.add('completed');
    } else if (!isUnlocked(classNum)) {
      node.classList.add('locked');
    }
  });
  
  document.querySelectorAll('.map-node.locked').forEach(node => {
    node.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Complete the previous class to unlock!');
    });
  });
  
  // 更新 Next Level 按钮
  updateNextLevelButton();
}

function updateNextLevelButton() {
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  if (!nextLevelBtn) return;
  
  if (isLevelCompleted() && CURRENT_LEVEL < TOTAL_LEVELS) {
    nextLevelBtn.classList.remove('locked');
    nextLevelBtn.onclick = function() {
      window.location.href = `/main-pages/levels/level${CURRENT_LEVEL + 1}.html`;
    };
  } else if (CURRENT_LEVEL >= TOTAL_LEVELS && isLevelCompleted()) {
    nextLevelBtn.textContent = '🎉 All Complete!';
    nextLevelBtn.classList.remove('locked');
    nextLevelBtn.classList.add('completed');
    nextLevelBtn.onclick = function() {
      alert('Congratulations! You have completed all levels!');
    };
  } else {
    nextLevelBtn.classList.add('locked');
    nextLevelBtn.onclick = function(e) {
      e.preventDefault();
      alert('Complete all classes to unlock the next level!');
    };
  }
}

document.addEventListener('DOMContentLoaded', updateNodeStatus);