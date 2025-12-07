function getCompletedClasses() {
  const saved = localStorage.getItem(`level${CURRENT_LEVEL}_completed`);
  return saved ? JSON.parse(saved) : [];
}

function isUnlocked(classNum) {
  if (classNum === 1) return true;
  const completed = getCompletedClasses();
  return completed.includes(classNum - 1);
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
}

document.addEventListener('DOMContentLoaded', updateNodeStatus);