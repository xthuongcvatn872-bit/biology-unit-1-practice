let scrambleAnswered = false;

function loadNextScrambleQuestion() {
  scrambleAnswered = false;
  const current = testList[testIndex];
  document.getElementById("scrambleProgress").textContent = `${testIndex + 1} / ${testList.length}`;
  
  const inputEl = document.getElementById("testScrambleInput");
  const fb = document.getElementById("testScrambleFeedback");
  const actionBtn = document.getElementById("testScrambleActionBtn");

  if (inputEl) {
    inputEl.value = "";
    inputEl.disabled = false;
    inputEl.focus();
  }
  if (fb) fb.textContent = "";

  if (actionBtn) {
    actionBtn.textContent = "Trả lời";
    actionBtn.className = "btn btn-check";
  }

  const container = document.getElementById("testScrambleLetters");
  if (container) {
    container.innerHTML = "";
    scrambleWord(current.word).forEach(c => {
      const s = document.createElement("span");
      s.className = "letter-badge";
      s.textContent = c.toUpperCase();
      container.appendChild(s);
    });
  }
}

// Xử lý 1 nút bấm: Chưa nộp thì là "Trả lời", đã nộp thì thành "Câu tiếp theo"
window.handleScrambleAction = function() {
  if (!scrambleAnswered) {
    // Trạng thái 1: Nộp câu trả lời
    const inputEl = document.getElementById("testScrambleInput");
    const fb = document.getElementById("testScrambleFeedback");
    const actionBtn = document.getElementById("testScrambleActionBtn");
    if (!inputEl || !fb) return;

    const user = inputEl.value.trim().toLowerCase().replace(/\s+/g, '');
    const target = testList[testIndex].word.toLowerCase().replace(/\s+/g, '');

    inputEl.disabled = true;
    scrambleAnswered = true;

    if (user === target) {
      testScore++;
      playCorrectSound();
      fb.textContent = "✅ Chính xác!";
      fb.className = "feedback-msg correct";
    } else {
      playWrongSound();
      fb.textContent = `❌ Chưa đúng! Đáp án: ${testList[testIndex].word}`;
      fb.className = "feedback-msg wrong";
    }

    if (actionBtn) {
      actionBtn.textContent = "Câu tiếp theo ▶";
      actionBtn.className = "btn btn-test-entry"; // Đổi sang màu cam nổi bật
    }
  } else {
    // Trạng thái 2: Chuyển sang câu tiếp theo
    testIndex++;
    if (testIndex < testList.length) {
      loadNextScrambleQuestion();
    } else {
      finishTest();
    }
  }
};

// Nhấn Enter: Lần 1 nộp bài, lần 2 chuyển câu
document.getElementById("testScrambleInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleScrambleAction();
  }
});
