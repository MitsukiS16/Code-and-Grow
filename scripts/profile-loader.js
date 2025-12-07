const CLASSES_PER_LEVEL = {
  1: 3,
  2: 3,
  3: 3
};

const LEVEL_NAMES = {
  0: "Newbie",
  1: "Beginner Coder",
  2: "Bug Hunter", 
  3: "Python Master"
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

function getCurrentLevel() {
  if (isLevelCompleted(3)) return 3;
  if (isLevelCompleted(2)) return 3;
  if (isLevelCompleted(1)) return 2;
  
  const level1Progress = getCompletedClasses(1);
  if (level1Progress.length > 0) return 1;
  
  return 0; // not started
}

// calculate total progress percentage
function calculateTotalProgress() {
  const totalLevels = Object.keys(CLASSES_PER_LEVEL).length;
  let totalClasses = 0;
  let completedClasses = 0;
  
  for (let level = 1; level <= totalLevels; level++) {
    totalClasses += CLASSES_PER_LEVEL[level];
    completedClasses += getCompletedClasses(level).length;
  }
  
  if (totalClasses === 0) return 0;
  return Math.round((completedClasses / totalClasses) * 100);
}

// get detailed progress per level
function getProgressDetails() {
  const totalLevels = Object.keys(CLASSES_PER_LEVEL).length;
  let details = [];
  
  for (let level = 1; level <= totalLevels; level++) {
    const completed = getCompletedClasses(level).length;
    const total = CLASSES_PER_LEVEL[level];
    details.push({
      level: level,
      completed: completed,
      total: total,
      percentage: Math.round((completed / total) * 100)
    });
  }
  
  return details;
}

function updateProfileDisplay() {
  const currentLevel = getCurrentLevel();
  const totalProgress = calculateTotalProgress();
  const levelName = LEVEL_NAMES[currentLevel];
  
  const levelDisplay = document.getElementById('currentLevelDisplay');
  if (levelDisplay) {
    if (currentLevel === 0) {
      levelDisplay.textContent = "Not started yet";
    } else if (currentLevel === 3 && isLevelCompleted(3)) {
      levelDisplay.textContent = `Level ${currentLevel}: ${levelName} ⭐`;
    } else {
      levelDisplay.textContent = `Level ${currentLevel}: ${levelName}`;
    }
  }
  
  const progressDisplay = document.getElementById('totalProgressDisplay');
  if (progressDisplay) {
    progressDisplay.textContent = `${totalProgress}% Complete`;
  }
  
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = `${totalProgress}%`;
  }
}

document.addEventListener('DOMContentLoaded', updateProfileDisplay);