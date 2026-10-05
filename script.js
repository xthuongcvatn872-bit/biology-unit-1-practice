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

// Các phần tử DOM
const currentNumberEl = document.getElementById("currentNumber");
const slideImageEl = document.getElementById("slideImage");
const audioSourceEl = document.getElementById("audioSource");
const audioPlayerEl = document.getElementById("audioPlayer");
const videoSourceEl = document.getElementById("videoSource");
const videoPlayerEl = document.getElementById("videoPlayer");
const prevBtn = document.getElementById("previousButton");
const nextBtn = document.getElementById("nextButton");

// Phần tử Trò chơi
const lettersBox = document.getElementById("scrambledLetters");
const scrambleInput = document.getElementById("scrambleInput");
const scrambleFeedback = document.getElementById("scrambleFeedback");
const quizDef = document.getElementById("quizDefinition");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");

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

  // Cập nhật lại câu hỏi của 2 bài tập theo từ hiện tại
  loadScrambleGame(current.word);
  loadQuizGame(current);
}

// Chuyển Tab giữa 2 trò chơi
window.switchTab = function(tabName) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
  
  if (tabName === 'scramble') {
    document.querySelectorAll(".tab-btn")[0].classList.add("active");
    document.getElementById("scrambleGame").classList.add("active");
  } else {
    document.querySelectorAll(".tab-btn")[1].classList.add("active");
    document.getElementById("quizGame").classList.add("active");
  }
};

// 1. Logic Game Xáo trộn từ
function loadScrambleGame(word) {
  scrambleInput.value = "";
  scrambleFeedback.textContent = "";
  scrambleFeedback.className = "feedback-msg";

  // Tạo chuỗi xáo trộn
  const cleanWord = word.replace(/\s+/g, '');
  let shuffled = cleanWord.split('').sort(() => 0.5 - Math.random()).join('');
  if (shuffled.toLowerCase() === cleanWord.toLowerCase() && cleanWord.length > 2) {
    shuffled = cleanWord.split('').reverse().join('');
  }

  lettersBox.innerHTML = "";
  shuffled.split('').forEach(char => {
    const span = document.createElement("span");
    span.className = "letter-badge";
    span.textContent = char.toUpperCase();
    lettersBox.appendChild(span);
  });
}

window.checkScramble = function() {
  const userAns = scrambleInput.value.trim().toLowerCase().replace(/\s+/g, '');
  const target = vocabList[currentIndex].word.toLowerCase().replace(/\s+/g, '');

  if (userAns === target) {
    scrambleFeedback.textContent = "🎉 Chính xác! Bạn đã nhớ chuẩn từ này!";
    scrambleFeedback.className = "feedback-msg correct";
  } else {
    scrambleFeedback.textContent = "❌ Chưa đúng rồi, thử lại nhé!";
    scrambleFeedback.className = "feedback-msg wrong";
  }
};

// Nhấn Enter để kiểm tra nhanh
scrambleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkScramble();
});

// 2. Logic Trắc nghiệm định nghĩa
function loadQuizGame(current) {
  quizDef.textContent = `"${current.definition}"`;
  quizFeedback.textContent = "";
  quizFeedback.className = "feedback-msg";
  quizOptions.innerHTML = "";

  // Tạo danh sách 4 lựa chọn (1 đúng, 3 sai)
  let choices = [current.word];
  let others = vocabList.filter(item => item.word !== current.word).map(item => item.word);
  others.sort(() => 0.5 - Math.random());
  choices.push(...others.slice(0, 3));
  choices.sort(() => 0.5 - Math.random()); // Xáo trộn vị trí các đáp án

  choices.forEach(optionText => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.textContent = optionText;
    btn.onclick = () => {
      // Vô hiệu hóa nút sau khi bấm
      document.querySelectorAll(".opt-btn").forEach(b => b.disabled = true);
      if (optionText === current.word) {
        btn.classList.add("correct");
        quizFeedback.textContent = "🌟 Tuyệt vời! Bạn hiểu đúng định nghĩa!";
        quizFeedback.className = "feedback-msg correct";
      } else {
        btn.classList.add("wrong");
        quizFeedback.textContent = `❌ Sai rồi! Thuật ngữ đúng phải là: ${current.word}`;
        quizFeedback.className = "feedback-msg wrong";
        // Đánh dấu nút đúng cho học sinh dễ thấy
        document.querySelectorAll(".opt-btn").forEach(b => {
          if (b.textContent === current.word) b.classList.add("correct");
        });
      }
    };
    quizOptions.appendChild(btn);
  });
}

// Bắt sự kiện chuyển từ
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateContent(currentIndex);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < vocabList.length - 1) {
    currentIndex++;
    updateContent(currentIndex);
  }
});

// Điều khiển phím mũi tên bàn phím
document.addEventListener("keydown", (e) => {
  if (e.target.tagName !== "INPUT") {
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
  }
});

// Khởi chạy ngay từ vựng số 1
updateContent(0);
