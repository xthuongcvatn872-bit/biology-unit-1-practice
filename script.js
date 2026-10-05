const vocabList = [
  {
    word: "DNA",
    definition: "A molecule that carries the genetic instructions in all living organisms.",
    image: "001_DNA.png",
    audio: "001_DNA.mp3",
    video: "001_DNA.mp4"
  },
  {
    word: "Nucleotide",
    definition: "The basic building block of nucleic acids (DNA and RNA).",
    image: "002_Nucleotide.png",
    audio: "002_Nucleotide.mp3",
    video: "002_Nucleotide.mp4"
  },
  {
    word: "Protein",
    definition: "Large, complex molecules made up of amino acid chains.",
    image: "003_Protein.png",
    audio: "003_Protein.mp3",
    video: "003_protein.mp4"
  },
  {
    word: "Ori",
    definition: "Origin of replication; a particular sequence where replication is initiated.",
    image: "004_Ori.png",
    audio: "004_Ori.mp3",
    video: "004_Ori.mp4"
  },
  {
    word: "Enzyme",
    definition: "A type of biological catalyst that speeds up chemical reactions in cells.",
    image: "005_Enzyme.png",
    audio: "005_Enzyme.mp3",
    video: "005_Enzyme.mp4"
  },
  {
    word: "RNA polymerase",
    definition: "An enzyme that synthesizes RNA from a DNA template during transcription.",
    image: "006_RNApolymerese.png",
    audio: "006_RNApolymerase.mp3",
    video: "006_RNApolymerase.mp4"
  },
  {
    word: "RNA",
    definition: "A product of the transcription process, plays a key role in protein synthesis.",
    image: "007_RNA.png",
    audio: "007_RNA.mp3",
    video: "007_RNA.mp4"
  },
  {
    word: "Okazaki",
    definition: "Short, newly synthesized DNA fragments formed on the lagging template strand.",
    image: "008_Okazaki.png",
    audio: "008_Okazaki.mp3",
    video: "008_Okazaki.mp4"
  },
  {
    word: "Ligase",
    definition: "An enzyme that joins Okazaki fragments together during DNA replication.",
    image: "009_Ligase.png",
    audio: "009_Ligase.mp3",
    video: "009_Ligase.mp4"
  }
];

let currentIndex = 0;
let testType = 'scramble';
let testList = [];
let testIndex = 0;
let testScore = 0;

// ==========================================
// BỘ TẠO ÂM THANH BẰNG WEB AUDIO API
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, delay = 0) {
  setTimeout(() => {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
  }, delay);
}

// Âm đúng: Hợp âm vui tươi (Đô - Mi - Sol cao)
function playCorrectSound() {
  playTone(523.25, 'sine', 0.15, 0);   // C5
  playTone(659.25, 'sine', 0.15, 80);  // E5
  playTone(783.99, 'sine', 0.25, 160); // G5
}

// Âm sai: Hai nốt trầm đục cảnh báo
function playWrongSound() {
  playTone(220, 'triangle', 0.2, 0);   // A3
  playTone(180, 'sawtooth', 0.25, 120); // F3
}

// ==========================================
// XỬ LÝ CHỮ CÁI XÁO TRỘN
// ==========================================
function scrambleWord(word) {
  const clean = word.replace(/\s+/g, '');
  let arr = clean.split('');
  if (arr.length <= 1) return arr;
  let shuffled = [...arr].sort(() => 0.5 - Math.random());
  if (shuffled.join('').toLowerCase() === clean.toLowerCase()) {
    shuffled = arr.reverse();
  }
  return shuffled;
}

// ==========================================
// KHU VỰC HỌC TẬP TỪNG TỪ
// ==========================================
function updateContent(index) {
  currentIndex = index;
  const current = vocabList[index];

  const currentNumberEl = document.getElementById("currentNumber");
  const slideImageEl = document.getElementById("slideImage");
  const audioSourceEl = document.getElementById("audioSource");
  const audioPlayerEl = document.getElementById("audioPlayer");
  const videoSourceEl = document.getElementById("videoSource");
  const videoPlayerEl = document.getElementById("videoPlayer");
  const prevBtn = document.getElementById("previousButton");
  const nextBtn = document.getElementById("nextButton");

  if (currentNumberEl) currentNumberEl.textContent = index + 1;
  if (slideImageEl) slideImageEl.src = current.image;

  if (audioSourceEl && audioPlayerEl) {
    audioSourceEl.src = current.audio;
    audioPlayerEl.load();
  }

  if (videoSourceEl && videoPlayerEl) {
    videoSourceEl.src = current.video;
    videoPlayerEl.load();
  }

  if (prevBtn) prevBtn.disabled = (index === 0);
  if (nextBtn) nextBtn.disabled = (index === vocabList.length - 1);

  // Cập nhật mini game tại chỗ
  const miniInput = document.getElementById("miniInput");
  const miniFeedback = document.getElementById("miniFeedback");
  const miniLettersBox = document.getElementById("miniScrambleLetters");

  if (miniInput) miniInput.value = "";
  if (miniFeedback) {
    miniFeedback.textContent = "";
    miniFeedback.className = "feedback-msg";
  }

  if (miniLettersBox) {
    miniLettersBox.innerHTML = "";
    scrambleWord(current.word).forEach(char => {
      const span = document.createElement("span");
      span.className = "letter-badge";
      span.textContent = char.toUpperCase();
      miniLettersBox.appendChild(span);
    });
  }
}

// Kiểm tra mini game tại chỗ
window.checkMiniScramble = function() {
  const miniInput = document.getElementById("miniInput");
  const miniFeedback = document.getElementById("miniFeedback");
  if (!miniInput || !miniFeedback) return;

  const user = miniInput.value.trim().toLowerCase().replace(/\s+/g, '');
  const target = vocabList[currentIndex].word.toLowerCase().replace(/\s+/g, '');

  if (user === target) {
    playCorrectSound();
    miniFeedback.textContent = "🎉 Rất giỏi! Bạn đã viết đúng!";
    miniFeedback.className = "feedback-msg correct";
  } else {
    playWrongSound();
    miniFeedback.textContent = "❌ Chưa chính xác, hãy thử lại!";
    miniFeedback.className = "feedback-msg wrong";
  }
};

function initEvents() {
  const prevBtn = document.getElementById("previousButton");
  const nextBtn = document.getElementById("nextButton");
  const miniInput = document.getElementById("miniInput");

  if (prevBtn) {
    prevBtn.onclick = () => { if (currentIndex > 0) updateContent(currentIndex - 1); };
  }
  if (nextBtn) {
    nextBtn.onclick = () => { if (currentIndex < vocabList.length - 1) updateContent(currentIndex + 1); };
  }
  if (miniInput) {
    miniInput.onkeydown = (e) => { if (e.key === "Enter") window.checkMiniScramble(); };
  }

  updateContent(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEvents);
} else {
  initEvents();
}

// ==========================================
// KHU VỰC BÀI THI TỔNG HỢP
// ==========================================
window.openTestSection = function() {
  document.getElementById("learningSection").style.display = "none";
  document.getElementById("testSection").style.display = "block";
  startTest(testType);
};

window.backToLearning = function() {
  document.getElementById("testSection").style.display = "none";
  document.getElementById("learningSection").style.display = "block";
};

window.switchTestType = function(type) {
  testType = type;
  const tabScramble = document.getElementById("tabTestScramble");
  const tabQuiz = document.getElementById("tabTestQuiz");
  if (tabScramble) tabScramble.classList.toggle("active", type === 'scramble');
  if (tabQuiz) tabQuiz.classList.toggle("active", type === 'quiz');
  startTest(type);
};

window.restartCurrentTest = function() {
  startTest(testType);
};

function startTest(type) {
  testList = [...vocabList].sort(() => 0.5 - Math.random());
  testIndex = 0;
  testScore = 0;

  const scoreView = document.getElementById("scoreResultView");
  if (scoreView) scoreView.style.display = "none";

  if (type === 'scramble') {
    document.getElementById("testScrambleView").style.display = "block";
    document.getElementById("testQuizView").style.display = "none";
    loadNextScrambleQuestion();
  } else {
    document.getElementById("testScrambleView").style.display = "none";
    document.getElementById("testQuizView").style.display = "block";
    loadNextQuizQuestion();
  }
}

// --- GAME 1: XÁO TRỘN TỪ ---
function loadNextScrambleQuestion() {
  const current = testList[testIndex];
  document.getElementById("scrambleProgress").textContent = `${testIndex + 1} / ${testList.length}`;
  const inputEl = document.getElementById("testScrambleInput");
  const fb = document.getElementById("testScrambleFeedback");
  const checkBtn = document.getElementById("testScrambleCheckBtn");
  const nextBtn = document.getElementById("scrambleNextBtn");

  if (inputEl) {
    inputEl.value = "";
    inputEl.disabled = false;
  }
  if (checkBtn) checkBtn.disabled = false;
  if (nextBtn) nextBtn.style.display = "none";
  if (fb) fb.textContent = "";

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

window.submitTestScramble = function() {
  const inputEl = document.getElementById("testScrambleInput");
  const fb = document.getElementById("testScrambleFeedback");
  const checkBtn = document.getElementById("testScrambleCheckBtn");
  const nextBtn = document.getElementById("scrambleNextBtn");
  if (!inputEl || !fb) return;

  const user = inputEl.value.trim().toLowerCase().replace(/\s+/g, '');
  const target = testList[testIndex].word.toLowerCase().replace(/\s+/g, '');

  inputEl.disabled = true;
  if (checkBtn) checkBtn.disabled = true;

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

  // Hiện nút chuyển câu
  if (nextBtn) nextBtn.style.display = "inline-block";
};

window.goToNextScrambleQuestion = function() {
  testIndex++;
  if (testIndex < testList.length) {
    loadNextScrambleQuestion();
  } else {
    finishTest();
  }
};

// Cho phép bấm Enter để nộp hoặc chuyển câu
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.getElementById("testSection").style.display === "block") {
    const nextBtn1 = document.getElementById("scrambleNextBtn");
    const nextBtn2 = document.getElementById("quizNextBtn");
    if (nextBtn1 && nextBtn1.style.display !== "none") {
      goToNextScrambleQuestion();
    } else if (nextBtn2 && nextBtn2.style.display !== "none") {
      goToNextQuizQuestion();
    }
  }
});

// --- GAME 2: TRẮC NGHIỆM ĐỊNH NGHĨA ---
function loadNextQuizQuestion() {
  const current = testList[testIndex];
  document.getElementById("quizProgress").textContent = `${testIndex + 1} / ${testList.length}`;
  document.getElementById("testQuizQuestion").textContent = `"${current.definition}"`;
  document.getElementById("testQuizFeedback").textContent = "";

  const nextBtn = document.getElementById("quizNextBtn");
  if (nextBtn) nextBtn.style.display = "none";

  const optionsContainer = document.getElementById("testQuizOptions");
  if (!optionsContainer) return;
  optionsContainer.innerHTML = "";

  let choices = [current.word];
  let others = vocabList.filter(item => item.word !== current.word).map(i => i.word);
  others.sort(() => 0.5 - Math.random());
  choices.push(...others.slice(0, 3));
  choices.sort(() => 0.5 - Math.random());

  choices.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.textContent = opt;
    btn.onclick = () => {
      document.querySelectorAll(".opt-btn").forEach(b => b.disabled = true);
      const quizFb = document.getElementById("testQuizFeedback");
      
      if (opt === current.word) {
        testScore++;
        playCorrectSound();
        btn.classList.add("correct");
        if (quizFb) {
          quizFb.textContent = "🌟 Chính xác!";
          quizFb.className = "feedback-msg correct";
        }
      } else {
        playWrongSound();
        btn.classList.add("wrong");
        if (quizFb) {
          quizFb.textContent = `❌ Sai rồi! Đáp án đúng: ${current.word}`;
          quizFb.className = "feedback-msg wrong";
        }
        document.querySelectorAll(".opt-btn").forEach(b => {
          if (b.textContent === current.word) b.classList.add("correct");
        });
      }

      // Hiện nút chuyển câu
      if (nextBtn) nextBtn.style.display = "inline-block";
    };
    optionsContainer.appendChild(btn);
  });
}

window.goToNextQuizQuestion = function() {
  testIndex++;
  if (testIndex < testList.length) {
    loadNextQuizQuestion();
  } else {
    finishTest();
  }
};

function finishTest() {
  document.getElementById("testScrambleView").style.display = "none";
  document.getElementById("testQuizView").style.display = "none";
  const resultCard = document.getElementById("scoreResultView");
  if (resultCard) resultCard.style.display = "block";

  const scoreText = document.getElementById("finalScoreText");
  if (scoreText) scoreText.textContent = `${testScore} / ${testList.length}`;

  const evalEl = document.getElementById("evaluationText");
  if (evalEl) {
    if (testScore === testList.length) {
      evalEl.textContent = "🏆 Hoàn hảo! Bạn đã nắm vững 100% thuật ngữ Unit 1!";
    } else if (testScore >= 7) {
      evalEl.textContent = "👏 Rất tốt! Bạn chỉ nhầm lẫn một chút thôi.";
    } else {
      evalEl.textContent = "💪 Hãy ôn tập lại các slide và thử lại nhé!";
    }
  }
}
