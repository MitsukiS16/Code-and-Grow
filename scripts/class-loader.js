let classData = null;
let lessonData = null;
let selectedAnswer = null;
let lessonCompleted = false;

const CLASSES_PER_LEVEL = {
  1: 3,
  2: 3,
  3: 3,
};
const TOTAL_LEVELS = 3;

async function loadClassData() {
  if (!checkCanPlay()) {
    return;
  }

  try {
    const classResponse = await fetch("/assets/data/classes.json");
    const classJson = await classResponse.json();
    const lessonResponse = await fetch("/assets/data/lessons.json");
    const lessonJson = await lessonResponse.json();
    const levelKey = `level${CURRENT_LEVEL}`;
    const classKey = `class${CURRENT_CLASS}`;

    if (classJson[levelKey] && classJson[levelKey].classes[classKey]) {
      classData = classJson[levelKey].classes[classKey];
      lessonData = lessonJson[levelKey]?.classes[classKey] || null;
      if (lessonData) {
        renderLesson();
      } else {
        renderQuestion();
      }
    } else {
      showError("Class not found");
    }
  } catch (error) {
    console.error("Error loading class data:", error);
    showError("Failed to load class data");
  }
}

function checkCanPlay() {
  const energy = typeof getEnergy === "function" ? getEnergy() : 10;
  const health = typeof getHealth === "function" ? getHealth() : 5;

  if (health <= 0) {
    showGameOver("health");
    return false;
  }
  if (energy <= 0) {
    showGameOver("energy");
    return false;
  }

  return true;
}

function showGameOver(reason) {
  const container = document.getElementById("classContainer");

  if (reason === "health") {
    container.innerHTML = `
      <div class="game-over">
        <h2>💔 Game Over</h2>
        <p>You ran out of health.</p>
        <p>Go home and sleep to restore your happiness!</p>
        <button class="check-btn" onclick="window.location.href='/main-pages/start-menu.html'">
          Back to Home
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="game-over">
        <h2>⚡ No Energy</h2>
        <p>You ran out of energy.</p>
        <p>Go home and sleep to restore your energy!</p>
        <button class="check-btn" onclick="window.location.href='/main-pages/levels/level${CURRENT_LEVEL}.html'">
          Back to Level
        </button>
      </div>
    `;
  }
}

function getNextButtonText() {
  const totalClasses = CLASSES_PER_LEVEL[CURRENT_LEVEL] || 3;

  if (CURRENT_CLASS < totalClasses) {
    return "Next";
  } else if (CURRENT_LEVEL >= TOTAL_LEVELS) {
    return "🎉 Finished";
  } else {
    return "Next Level";
  }
}

function renderLesson() {
  const container = document.getElementById("classContainer");

  let rulesHtml = "";
  if (lessonData.rules) {
    rulesHtml = `
      <ul class="lesson-rules">
        ${lessonData.rules.map((rule) => `<li>${rule}</li>`).join("")}
      </ul>
    `;
  }

  let examplesHtml = "";
  if (lessonData.examples) {
    if (lessonData.examples.valid && lessonData.examples.invalid) {
      examplesHtml = `
        <div class="lesson-examples">
          <div class="example-group valid">
            <h4>✅ Valid</h4>
            <code>${lessonData.examples.valid.join(", ")}</code>
          </div>
          <div class="example-group invalid">
            <h4>❌ Invalid</h4>
            <code>${lessonData.examples.invalid.join(", ")}</code>
          </div>
        </div>
      `;
    } else if (lessonData.examples.code) {
      examplesHtml = `
        <div class="code-block">
          <pre>${lessonData.examples.code.join("\n")}</pre>
        </div>
      `;
    } else if (lessonData.examples.wrong && lessonData.examples.correct) {
      examplesHtml = `
        <div class="lesson-examples">
          <div class="example-group invalid">
            <h4>❌ Wrong</h4>
            <div class="code-block"><pre>${lessonData.examples.wrong.join(
              "\n"
            )}</pre></div>
          </div>
          <div class="example-group valid">
            <h4>✅ Correct</h4>
            <div class="code-block"><pre>${lessonData.examples.correct.join(
              "\n"
            )}</pre></div>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="lesson-container">
      <h2>📚 ${lessonData.lessonTitle}</h2>
      <div class="lesson-content">
        ${lessonData.content.map((p) => `<p>${p}</p>`).join("")}
      </div>
      ${rulesHtml}
      ${examplesHtml}
      <button class="check-btn start-btn" onclick="startExercise()">
        Start Exercise
      </button>
    </div>
  `;
}

function startExercise() {
  lessonCompleted = true;
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById("classContainer");
  selectedAnswer = null;

  switch (classData.questionType) {
    case "click_options":
      renderClickOptions(container);
      break;
    case "fill_blank":
      renderFillBlank(container);
      break;
    case "click_options_multiple":
      renderMultipleChoice(container);
      break;
    case "true_false":
      renderTrueFalse(container);
      break;
    case "drag_drop":
      renderDragDrop(container);
      break;
    case "dropdown":
      renderDropdown(container);
      break;
    case "sort_options":
      renderSortOptions(container);
      break;
    case "fill_blank_multiple":
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
    ${
      classData.codeExample
        ? `<div class="code-block"><pre>${classData.codeExample}</pre></div>`
        : ""
    }
    <div class="options-container">
      ${classData.options
        .map(
          (opt) => `
        <button class="option-btn" data-answer="${opt}" onclick="selectOption(this)">
          ${opt}
        </button>
      `
        )
        .join("")}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkClickOptions()" disabled>Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;
}

function selectOption(btn) {
  document
    .querySelectorAll(".option-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedAnswer = btn.dataset.answer;
  document.getElementById("checkBtn").disabled = false;
}

function checkClickOptions() {
  const isCorrect = selectedAnswer === classData.correctAnswer;
  const allButtons = document.querySelectorAll(".option-btn");

  allButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.classList.contains("selected")) {
      if (isCorrect) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("incorrect");
      }
    }
  });

  showResult(isCorrect);
}

// ============ 填空题 (fill_blank) ============
function renderFillBlank(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="code-block">
      <pre><input type="text" class="fill-input" id="fillInput" placeholder="?" autocomplete="off">('Hello World')</pre>
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkFillBlank()" disabled>Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;

  document.getElementById("fillInput").addEventListener("input", function () {
    document.getElementById("checkBtn").disabled = this.value.trim() === "";
  });
}

function checkFillBlank() {
  const input = document.getElementById("fillInput");
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = classData.correctAnswer.toLowerCase();
  const isCorrect = userAnswer === correctAnswer;

  input.disabled = true;
  if (isCorrect) {
    input.classList.add("correct");
  } else {
    input.classList.add("incorrect");
  }

  showResult(isCorrect);
}

// ============ 多选题 (click_options_multiple) ============
function renderMultipleChoice(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="options-container options-grid">
      ${classData.options
        .map(
          (opt) => `
        <button class="option-btn" data-answer="${opt.text}" data-correct="${opt.isCorrect}" onclick="toggleOption(this)">
          ${opt.text}
        </button>
      `
        )
        .join("")}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkMultipleChoice()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;
}

function toggleOption(btn) {
  btn.classList.toggle("selected");
}

function checkMultipleChoice() {
  const allButtons = document.querySelectorAll(".option-btn");
  let isCorrect = true;

  allButtons.forEach((btn) => {
    const shouldBeSelected = btn.dataset.correct === "true";
    const isSelected = btn.classList.contains("selected");

    if (shouldBeSelected !== isSelected) {
      isCorrect = false;
    }
  });

  allButtons.forEach((btn) => {
    btn.disabled = true;
    const isSelected = btn.classList.contains("selected");

    if (isCorrect) {
      if (isSelected) {
        btn.classList.add("correct");
      }
    } else {
      if (isSelected) {
        btn.classList.add("incorrect");
      }
    }
  });

  showResult(isCorrect);
}

// ============ 判断题 (true_false) ============
function renderTrueFalse(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    ${
      classData.codeExample
        ? `<div class="code-block"><pre>${classData.codeExample}</pre></div>`
        : ""
    }
    <div class="options-container">
      ${classData.options
        .map(
          (opt) => `
        <button class="option-btn" data-correct="${opt.isCorrect}" onclick="selectTrueFalse(this)">
          ${opt.text}
        </button>
      `
        )
        .join("")}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkTrueFalse()" disabled>Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;
}

function selectTrueFalse(btn) {
  document
    .querySelectorAll(".option-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedAnswer = btn.dataset.correct === "true";
  document.getElementById("checkBtn").disabled = false;
}

function checkTrueFalse() {
  const allButtons = document.querySelectorAll(".option-btn");
  const isCorrect = selectedAnswer === true;

  allButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.classList.contains("selected")) {
      if (isCorrect) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("incorrect");
      }
    }
  });

  showResult(isCorrect);
}

// ============ 多空填空题 (fill_blank_multiple) ============
function renderFillBlankMultiple(container) {
  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="code-block">
      <pre>for i in range(<input type="text" class="fill-input small" id="fillInput1" placeholder="?">, <input type="text" class="fill-input small" id="fillInput2" placeholder="?">):
    print(i)</pre>
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkFillBlankMultiple()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
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
      input.classList.add("correct");
    } else {
      input.classList.add("incorrect");
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
        ${classData.items
          .map(
            (item, index) => `
          <div class="drag-item" draggable="true" data-index="${index}" data-category="${item.correctCategory}">
            ${item.expression}
          </div>
        `
          )
          .join("")}
      </div>
      <div class="drop-zones">
        ${classData.categories
          .map(
            (cat) => `
          <div class="drop-zone" data-category="${cat}">
            <h4>${cat}</h4>
            <div class="drop-area"></div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkDragDrop()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;

  initDragDrop();
}

function initDragDrop() {
  const items = document.querySelectorAll(".drag-item");
  const zones = document.querySelectorAll(".drop-area");

  items.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.dataset.index);
    });
  });

  zones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const index = e.dataTransfer.getData("text/plain");
      const item = document.querySelector(`[data-index="${index}"]`);
      zone.appendChild(item);
    });
  });
}

function checkDragDrop() {
  const items = document.querySelectorAll(".drag-item");
  let isCorrect = true;

  items.forEach((item) => {
    const parent = item.closest(".drop-zone");
    if (parent) {
      const zoneCategory = parent.dataset.category;
      const itemCategory = item.dataset.category;

      if (zoneCategory === itemCategory) {
        item.classList.add("correct");
      } else {
        item.classList.add("incorrect");
        isCorrect = false;
      }
    } else {
      isCorrect = false;
    }
  });

  showResult(isCorrect);
}

// ============ 下拉选择题 (dropdown) ============
function renderDropdown(container) {
  let codeHtml = classData.codeTemplate;

  classData.blanks.forEach((blank) => {
    const selectHtml = `<select class="dropdown-select" id="dropdown${
      blank.id
    }">
        <option value="">--choose--</option>
        ${blank.options
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join("")}
      </select>`;
    codeHtml = codeHtml.replace(`_${blank.id}_`, selectHtml);
  });

  container.innerHTML = `
    <h2>Class ${CURRENT_CLASS} - ${classData.className}</h2>
    <p class="question-text">${classData.question}</p>
    <div class="code-block"><pre>${codeHtml}</pre></div>
    <button class="check-btn" id="checkBtn" onclick="checkDropdown()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;
}

function checkDropdown() {
  let isCorrect = true;

  classData.blanks.forEach((blank) => {
    const select = document.getElementById(`dropdown${blank.id}`);
    select.disabled = true;

    if (select.value === blank.correctAnswer) {
      select.classList.add("correct");
    } else {
      select.classList.add("incorrect");
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
      ${shuffled
        .map(
          (opt) => `
        <div class="sort-item" draggable="true" data-value="${opt}">
          <span class="sort-handle">☰</span> <code>${opt}</code>
        </div>
      `
        )
        .join("")}
    </div>
    <button class="check-btn" id="checkBtn" onclick="checkSortOptions()">Check</button>
    <button class="check-btn next-btn" id="nextBtn" onclick="goNext()" style="display:none;">${getNextButtonText()}</button>
    <button class="check-btn retry-btn" id="retryBtn" onclick="retry()" style="display:none;">Retry</button>
    <div class="explanation-box" id="explanation" style="display:none;">
      ${classData.explanation}
    </div>
  `;

  initSortable();
}

function initSortable() {
  const container = document.getElementById("sortContainer");
  let draggedItem = null;

  container.addEventListener("dragstart", (e) => {
    draggedItem = e.target.closest(".sort-item");
    e.target.classList.add("dragging");
  });

  container.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });

  container.addEventListener("dragover", (e) => {
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
  const elements = [...container.querySelectorAll(".sort-item:not(.dragging)")];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function checkSortOptions() {
  const items = document.querySelectorAll(".sort-item");
  let isCorrect = true;

  items.forEach((item, index) => {
    const userValue = item.dataset.value;
    const correctValue = classData.correctOrder[index];

    if (userValue === correctValue) {
      item.classList.add("correct");
    } else {
      item.classList.add("incorrect");
      isCorrect = false;
    }
  });

  showResult(isCorrect);
}

// ============ play sound ============
function playResultSound(isCorrect) {
  const soundId = isCorrect ? "rightSound" : "wrongSound";
  const audio = document.getElementById(soundId);
  if (audio) {
    if (typeof isSfxEnabled === "function" && !isSfxEnabled()) {
      return;
    }
    if (typeof getVolume === "function") {
      audio.volume = getVolume();
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

function showResult(isCorrect) {
  document.getElementById("checkBtn").style.display = "none";
  const explanationBox = document.getElementById("explanation");
  explanationBox.style.display = "block";
  playResultSound(isCorrect);

  if (typeof useEnergy === "function") {
    useEnergy();
  }

  if (isCorrect) {
    explanationBox.innerHTML = `✅ Correct! ${classData.explanation}`;
    explanationBox.classList.remove("wrong");
    explanationBox.classList.add("correct");
    document.getElementById("nextBtn").style.display = "block";

    if (typeof gainMoney === "function") {
      const reward = gainMoney(CURRENT_LEVEL, CURRENT_CLASS);
      console.log(`+${reward} coins!`);
    }
    markClassComplete();
  } else {
    explanationBox.innerHTML = `❌ Wrong! Try again.`;
    explanationBox.classList.remove("correct");
    explanationBox.classList.add("wrong");
    document.getElementById("retryBtn").style.display = "block";

    if (typeof loseHealth === "function") {
      loseHealth();
    }
  }
}

function retry() {
  renderQuestion();
}

function markClassComplete() {
  const key = `level${CURRENT_LEVEL}_completed`;
  const completed = JSON.parse(localStorage.getItem(key) || "[]");
  if (!completed.includes(CURRENT_CLASS)) {
    completed.push(CURRENT_CLASS);
    localStorage.setItem(key, JSON.stringify(completed));
    console.log(`Level ${CURRENT_LEVEL} Class ${CURRENT_CLASS} completed!`);
    console.log(`Current progress: ${JSON.stringify(completed)}`);
  }
}

function goNext() {
  const totalClasses = CLASSES_PER_LEVEL[CURRENT_LEVEL] || 3;
  if (CURRENT_CLASS < totalClasses) {
    window.location.href = `class${CURRENT_CLASS + 1}.html`;
  } else if (CURRENT_LEVEL >= TOTAL_LEVELS) {
    window.location.href = `/main-pages/levels/level${CURRENT_LEVEL}.html`;
  } else {
    window.location.href = `/main-pages/levels/level${CURRENT_LEVEL + 1}.html`;
  }
}

function showError(message) {
  document.getElementById("classContainer").innerHTML = `
    <div class="loading" style="color: #ef5350;">❌ ${message}</div>
  `;
}

document.addEventListener("DOMContentLoaded", loadClassData);
