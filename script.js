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

// Các phần tử chế độ học
const currentNumberEl = document.getElementById("currentNumber");
const slideImageEl = document.getElementById("slideImage");
const audioSourceEl = document.getElementById("audioSource");
const audioPlayerEl = document.getElementById("audioPlayer");
const videoSourceEl = document.getElementById("videoSource");
const videoPlayerEl = document.getElementById("videoPlayer");
const prevBtn = document.getElementById("previousButton");
const nextBtn = document.getElementById("nextButton");

const miniLettersBox = document.getElementById("miniScrambleLetters");
const miniInput = document.getElementById("miniInput");
const miniFeedback = document.getElementById("miniFeedback");

// Cập nhật chế độ học
function updateContent(index) {
  const current = vocabList[index];

  currentNumberEl.textContent = index + 1;
  slideImageEl.src = current.image;

  audioSourceEl.src = current.audio;
  audioPlayerEl.load();

  videoSourceEl.src = current.video;
  videoPlayerEl.load();

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === vocabList.length - 1;

  loadMiniScramble(current.word);
}

// 1. MINI GAME XẾP CHỮ TẠI CHỖ
function scrambleWord(word) {
  const clean = word.replace(/\s+/g, '');
  let arr = clean.split('').sort(() => 0.5 - Math.random());
  if (arr.join('').toLowerCase() === clean.toLowerCase() && clean.length > 2) {
    arr = clean.split('').reverse();
  }
  return arr;
}

function loadMiniScramble(word) {
  miniInput.value = "";
  miniFeedback.textContent = "";
  miniFeedback.className = "feedback-msg";
  miniLettersBox.innerHTML = "";

  scrambleWord(word).forEach(char => {
    const span = document.createElement("span");
    span.className = "letter-badge";
    span.textContent = char.toUpperCase();
    miniLettersBox.appendChild(span);
  });
}

window.checkMiniScramble = function() {
  const user = miniInput.value.trim().toLowerCase().replace(/\s+/g, '');
  const target = vocabList[currentIndex].word.toLowerCase().replace(/\s+/g, '');

  if (user === target) {
    miniFeedback.textContent = "🎉 Rất giỏi! Bạn đã viết đúng!";
    miniFeedback.className = "feedback-msg correct";
  } else {
    miniFeedback.textContent = "❌ Chưa chính xác, hãy thử lại!";
    miniFeedback.className = "feedback-msg wrong";
  }
};

miniInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkMiniScramble();
});

// Điều hướng từ
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) { currentIndex--; updateContent(currentIndex); }
});
nextBtn.addEventListener("click", () => {
  if (currentIndex < vocabList.length - 1) { currentIndex++; updateContent(currentIndex); }
});

// ==========================================
// 2. KHU VỰC BÀI KIỂM TRA TỔNG HỢP (RANDOM ORDER)
// ==========================================
let testType = 'scramble'; // 'scramble' hoặc 'quiz'
let testList = [];
let testIndex = 0;
let testScore = 0;

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
  document.getElementById("tabTestScramble").classList.toggle("active", type === 'scramble');
  document.getElementById("tabTestQuiz").classList.toggle("active", type === 'quiz');
  startTest(type);
};

window.restartCurrentTest = function() {
  startTest(testType);
};

function startTest(type) {
  // XÁO TRỘN HOÀN TOÀN THỨ TỰ 9 TỪ
  testList = [...vocabList].sort(() => 0.5 - Math.random());
  testIndex = 0;
  testScore = 0;

  document.getElementById("scoreResultView").style.display = "none";

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

// BÀI TEST 1: GIẢI MÃ TỪ
function loadNextScrambleQuestion() {
  const current = testList[testIndex];
  document.getElementById("scrambleProgress").textContent = `${testIndex + 1} / ${testList.length}`;
  const inputEl = document.getElementById("testScrambleInput");
  inputEl.value = "";
  inputEl.disabled = false;
  document.getElementById("testScrambleFeedback").textContent = "";

  const container = document.getElementById("testScrambleLetters");
  container.innerHTML = "";
  scrambleWord(current.word).forEach(c => {
    const s = document.createElement("span");
    s.className = "letter-badge";
    s.textContent = c.toUpperCase();
    container.appendChild(s);
  });
}

window.submitTestScramble = function() {
  const inputEl = document.getElementById("testScrambleInput");
  const user = inputEl.value.trim().toLowerCase().replace(/\s+/g, '');
  const target = testList[testIndex].word.toLowerCase().replace(/\s+/g, '');
  const fb = document.getElementById("testScrambleFeedback");

  inputEl.disabled = true;
  if (user === target) {
    testScore++;
    fb.textContent = "✅ Chính xác!";
    fb.className = "feedback-msg correct";
  } else {
    fb.textContent = `❌ Chưa đúng! Đáp án đúng là: ${testList[testIndex].word}`;
    fb.className = "feedback-msg wrong";
  }

  setTimeout(() => {
    testIndex++;
    if (testIndex < testList.length) {
      loadNextScrambleQuestion();
    } else {
      finishTest();
    }
  }, 1200);
};

document.getElementById("testScrambleInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitTestScramble();
});

// BÀI TEST 2: TRẮC NGHIỆM ĐỊNH NGHĨA
function loadNextQuizQuestion() {
  const current = testList[testIndex];
  document.getElementById("quizProgress").textContent = `${testIndex + 1} / ${testList.length}`;
  document.getElementById("testQuizQuestion").textContent = `"${current.definition}"`;
  document.getElementById("testQuizFeedback").textContent = "";

  const optionsContainer = document.getElementById("testQuizOptions");
  optionsContainer.innerHTML = "";

  // Tạo 4 lựa chọn (1 đúng, 3 sai)
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
      if (opt === current.word) {
        testScore++;
        btn.classList.add("correct");
        document.getElementById("testQuizFeedback").textContent = "🌟 Chính xác!";
        document.getElementById("testQuizFeedback").className = "feedback-msg correct";
      } else {
        btn.classList.add("wrong");
        document.getElementById("testQuizFeedback").textContent = `❌ Sai rồi! Đáp án: ${current.word}`;
        document.getElementById("testQuizFeedback").className = "feedback-msg wrong";
        document.querySelectorAll(".opt-btn").forEach(b => {
          if (b.textContent === current.word) b.classList.add("correct");
        });
      }

      setTimeout(() => {
        testIndex++;
        if (testIndex < testList.length) {
          loadNextQuizQuestion();
        } else {
          finishTest();
        }
      }, 1300);
    };
    optionsContainer.appendChild(btn);
  });
}

function finishTest() {
  document.getElementById("testScrambleView").style.display = "none";
  document.getElementById("testQuizView").style.display = "none";
  const resultCard = document.getElementById("scoreResultView");
  resultCard.style.display = "block";

  document.getElementById("finalScoreText").textContent = `${testScore} / ${testList.length}`;
  const evalEl = document.getElementById("evaluationText");
  if (testScore === testList.length) {
    evalEl.textContent = "🏆 Hoàn hảo! Bạn đã nắm vững 100% thuật ngữ Unit 1!";
  } else if (testScore >= 7) {
    evalEl.textContent = "👏 Rất tốt! Bạn chỉ nhầm lẫn một chút thôi.";
  } else {
    evalEl.textContent = "💪 Hãy ôn tập lại các slide và thử lại nhé!";
  }
}

// Khởi chạy
updateContent(0);
