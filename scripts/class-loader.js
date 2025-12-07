let classData = null;
let selectedAnswer = null;

const CLASSES_PER_LEVEL = {
  1: 3,
  2: 3,
  3: 3
};

async function loadClassData() {
  try {
    const response = await fetch('/assets/data/classes.json');
    const data = await response.json();
    const levelKey = `level${CURRENT_LEVEL}`;
    const classKey = `class${CURRENT_CLASS}`;
    
    if (data[levelKey] && data[levelKey].classes[classKey]) {
      classData = data[levelKey].classes[classKey];
      renderQuestion();
    } else {
      showError('Class not found');
    }
  } catch (error) {
    console.error('Error loading class data:', error);
    showError('Failed to load class data');
  }
}

function renderQuestion() {
  const container = document.getElementById('classContainer');
  
  switch(classData.questionType) {
    case 'click_options':
      renderClickOptions(container);
      break;
    case 'fill_blank':
      renderFillBlank(container);
      break;
    case 'click_options_multiple':
      renderMultipleChoice(container);
      break;
    case 'true_false':
      renderTrueFalse(container);
      break;
    case 'drag_drop':
      renderDragDrop(container);
      break;
    case 'dropdown':
      renderDropdown(container);
      break;
    case 'sort_options':
      renderSortOptions(container);
      break;
    case 'fill_blank_multiple':
      renderFillBlankMultiple(container);
      break;
    default:
      renderClickOptions(container);
  }
}

// ============ 单选题 (click_options) ============
function renderClickOptions(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    ${classData.codeExample ? `<div class="code-display">${classData.codeExample}</div>` : ''}
    <div class="options-container">
      ${classData.options.map(opt => `
        <button class="option-btn" data-answer="${opt}" onclick="selectOption(this)">
          ${opt}
        </button>
      `).join('')}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkClickOptions()" disabled>Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
}

function selectOption(btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAnswer = btn.dataset.answer;
  document.getElementById('checkBtn').disabled = false;
}

function checkClickOptions() {
  const isCorrect = selectedAnswer === classData.correctAnswer;
  const allButtons = document.querySelectorAll('.option-btn');
  
  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.answer === classData.correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.classList.contains('selected') && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  showResult(isCorrect);
}

// ============ 填空题 (fill_blank) ============
function renderFillBlank(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="code-display">
      <input type="text" class="fill-input" id="fillInput" placeholder="?" autocomplete="off">('Hello World')
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkFillBlank()" disabled>Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
  
  document.getElementById('fillInput').addEventListener('input', function() {
    document.getElementById('checkBtn').disabled = this.value.trim() === '';
  });
}

function checkFillBlank() {
  const input = document.getElementById('fillInput');
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = classData.correctAnswer.toLowerCase();
  const isCorrect = userAnswer === correctAnswer;
  
  input.disabled = true;
  if (isCorrect) {
    input.classList.add('correct');
  } else {
    input.classList.add('incorrect');
    input.value = classData.correctAnswer;
  }
  
  showResult(isCorrect);
}

// ============ 多选题 (click_options_multiple) ============
function renderMultipleChoice(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="options-container options-grid">
      ${classData.options.map(opt => `
        <button class="option-btn" data-answer="${opt.text}" data-correct="${opt.isCorrect}" onclick="toggleOption(this)">
          ${opt.text}
        </button>
      `).join('')}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkMultipleChoice()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
}

function toggleOption(btn) {
  btn.classList.toggle('selected');
}

function checkMultipleChoice() {
  const allButtons = document.querySelectorAll('.option-btn');
  let isCorrect = true;
  
  allButtons.forEach(btn => {
    btn.disabled = true;
    const shouldBeSelected = btn.dataset.correct === 'true';
    const isSelected = btn.classList.contains('selected');
    
    if (shouldBeSelected) {
      btn.classList.add('correct');
      if (!isSelected) isCorrect = false; // miss correct option
    } else if (isSelected) {
      btn.classList.add('incorrect');
      isCorrect = false; // wrong option
    }
  });
  
  showResult(isCorrect);
}

// ============ 判断题 (true_false) ============
function renderTrueFalse(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    ${classData.codeExample ? `<div class="code-display">${classData.codeExample}</div>` : ''}
    <div class="options-container">
      ${classData.options.map(opt => `
        <button class="option-btn" data-correct="${opt.isCorrect}" onclick="selectTrueFalse(this)">
          ${opt.text}
        </button>
      `).join('')}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkTrueFalse()" disabled>Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
}

function selectTrueFalse(btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAnswer = btn.dataset.correct === 'true';
  document.getElementById('checkBtn').disabled = false;
}

function checkTrueFalse() {
  const allButtons = document.querySelectorAll('.option-btn');
  const isCorrect = selectedAnswer === true;
  
  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.correct === 'true') {
      btn.classList.add('correct');
    } else if (btn.classList.contains('selected')) {
      btn.classList.add('incorrect');
    }
  });
  
  showResult(isCorrect);
}

// ============ 多空填空题 (fill_blank_multiple) ============
function renderFillBlankMultiple(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="code-display">
      for i in range(<input type="text" class="fill-input small" id="fillInput1" placeholder="?">, <input type="text" class="fill-input small" id="fillInput2" placeholder="?">):<br>
      &nbsp;&nbsp;&nbsp;&nbsp;print(i)
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkFillBlankMultiple()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
}

function checkFillBlankMultiple() {
  let isCorrect = true;
  
  classData.blanks.forEach((blank) => {
    const input = document.getElementById(`fillInput${blank.id}`);
    const userAnswer = input.value.trim();
    const correct = userAnswer === blank.correctAnswer;
    
    input.disabled = true;
    if (correct) {
      input.classList.add('correct');
    } else {
      input.classList.add('incorrect');
      input.value = blank.correctAnswer;
      isCorrect = false;
    }
  });
  
  showResult(isCorrect);
}

// ============ 拖拽题 (drag_drop) ============
function renderDragDrop(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="drag-container">
      <div class="drag-items">
        ${classData.items.map((item, index) => `
          <div class="drag-item" draggable="true" data-index="${index}" data-category="${item.correctCategory}">
            ${item.expression}
          </div>
        `).join('')}
      </div>
      <div class="drop-zones">
        ${classData.categories.map(cat => `
          <div class="drop-zone" data-category="${cat}">
            <h4>${cat}</h4>
            <div class="drop-area"></div>
          </div>
        `).join('')}
      </div>
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkDragDrop()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
  
  initDragDrop();
}

function initDragDrop() {
  const items = document.querySelectorAll('.drag-item');
  const zones = document.querySelectorAll('.drop-area');
  
  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.dataset.index);
    });
  });
  
  zones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      const index = e.dataTransfer.getData('text/plain');
      const item = document.querySelector(`[data-index="${index}"]`);
      zone.appendChild(item);
    });
  });
}

function checkDragDrop() {
  const items = document.querySelectorAll('.drag-item');
  let isCorrect = true;
  
  items.forEach(item => {
    const parent = item.closest('.drop-zone');
    if (parent) {
      const zoneCategory = parent.dataset.category;
      const itemCategory = item.dataset.category;
      
      if (zoneCategory === itemCategory) {
        item.classList.add('correct');
      } else {
        item.classList.add('incorrect');
        isCorrect = false;
      }
    } else {
      isCorrect = false; // not placed in any zone
    }
  });
  
  showResult(isCorrect);
}

// ============ 下拉选择题 (dropdown) ============
function renderDropdown(container) {
  let codeHtml = classData.codeTemplate;
  
  classData.blanks.forEach(blank => {
    const selectHtml = `
      <select class="dropdown-select" id="dropdown${blank.id}">
        <option value="">--choose--</option>
        ${blank.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
      </select>
    `;
    codeHtml = codeHtml.replace(`_${blank.id}_`, selectHtml);
  });
  
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="code-display">${codeHtml}</div>
    <button class="check-btn" id="checkBtn" onclick="checkDropdown()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
}

function checkDropdown() {
  let isCorrect = true;
  
  classData.blanks.forEach(blank => {
    const select = document.getElementById(`dropdown${blank.id}`);
    select.disabled = true;
    
    if (select.value === blank.correctAnswer) {
      select.classList.add('correct');
    } else {
      select.classList.add('incorrect');
      select.value = blank.correctAnswer;
      isCorrect = false;
    }
  });
  
  showResult(isCorrect);
}

// ============ 排序题 (sort_options) ============
function renderSortOptions(container) {
  const shuffled = [...classData.options].sort(() => Math.random() - 0.5);
  
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="sort-container" id="sortContainer">
      ${shuffled.map((opt) => `
        <div class="sort-item" draggable="true" data-value="${opt}">
          <span class="sort-handle">☰</span> ${opt}
        </div>
      `).join('')}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkSortOptions()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()">Next →</button>
    <div class="explanation-box" id="explanation">
      ✅ ${classData.explanation}
    </div>
  `;
  
  initSortable();
}

function initSortable() {
  const container = document.getElementById('sortContainer');
  let draggedItem = null;
  
  container.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.sort-item');
    e.target.classList.add('dragging');
  });
  
  container.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
  });
  
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggedItem);
    } else {
      container.insertBefore(draggedItem, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll('.sort-item:not(.dragging)')];
  
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkSortOptions() {
  const items = document.querySelectorAll('.sort-item');
  let isCorrect = true;
  
  items.forEach((item, index) => {
    const userValue = item.dataset.value;
    const correctValue = classData.correctOrder[index];
    
    if (userValue === correctValue) {
      item.classList.add('correct');
    } else {
      item.classList.add('incorrect');
      isCorrect = false;
    }
  });
  
  showResult(isCorrect);
}


function showResult(isCorrect = true) {
  document.getElementById('checkBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'block';
  document.getElementById('explanation').style.display = 'block';
  
  // lose energy
  if (typeof useEnergy === 'function') {
    useEnergy();
  }
  
  if (isCorrect) {
    // right answer: gain money
    if (typeof gainMoney === 'function') {
      const reward = gainMoney(CURRENT_LEVEL, CURRENT_CLASS);
      console.log(`+${reward} coins!`);
    }
    markClassComplete();
  } else {
    // wrong answer: lose health
    if (typeof loseHealth === 'function') {
      loseHealth();
    }
  }
}

function markClassComplete() {
  const key = `level${CURRENT_LEVEL}_completed`;
  const completed = JSON.parse(localStorage.getItem(key) || '[]');
  if (!completed.includes(CURRENT_CLASS)) {
    completed.push(CURRENT_CLASS);
    localStorage.setItem(key, JSON.stringify(completed));
    console.log(`Class ${CURRENT_CLASS} completed!`);
  }
}

function goNext() {
  const totalClasses = CLASSES_PER_LEVEL[CURRENT_LEVEL] || 3;
  if (CURRENT_CLASS < totalClasses) {
    window.location.href = `class${CURRENT_CLASS + 1}.html`;
  } else {
    window.location.href = `/main-pages/levels/level${CURRENT_LEVEL}.html`;
  }
}

function showError(message) {
  document.getElementById('classContainer').innerHTML = `
    <div class="loading" style="color: #ef5350;">❌ ${message}</div>
  `;
}

document.addEventListener('DOMContentLoaded', loadClassData);