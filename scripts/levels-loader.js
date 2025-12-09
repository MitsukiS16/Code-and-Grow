const CLASSES_PER_LEVEL = {
  1: 3,  // Level 1 has 3 classes
  2: 3,
  3: 3
};

function getCompletedClasses(level) {
  const saved = localStorage.getItem(`level${level}_completed`);
  return saved ? JSON.parse(saved) : [];
}

function isLevelCompleted(level) {
  const completed = getCompletedClasses(level);
  const totalClasses = CLASSES_PER_LEVEL[level] || 3;
  return completed.length >= totalClasses;
}

function isLevelUnlocked(level) {
  if (level === 1) return true;
  return isLevelCompleted(level - 1);
}

function updateLevelStatus() {
  const levelNodes = document.querySelectorAll('.flex-child');
  
  levelNodes.forEach((node, index) => {
    const level = index + 1;
    node.classList.remove('locked', 'completed');
    
    if (isLevelCompleted(level)) {
      node.classList.add('completed');
    } else if (!isLevelUnlocked(level)) {
      node.classList.add('locked');
    }
  });

  document.querySelectorAll('.flex-link').forEach((link, index) => {
    const level = index + 1;
    const node = link.querySelector('.flex-child');
    
    if (node.classList.contains('locked')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        alert(`Complete Level ${level - 1} to unlock Level ${level}!`);
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', updateLevelStatus);