// ==========================
// INTRO RECAPTCHA LOGIC
// ==========================

// script.js
import { allowedWords } from './allowedWords.js';

const recaptchaBox = document.getElementById("recaptchaBox");
const fakeCheckbox = document.getElementById("fakeCheckbox");
const introScreen = document.getElementById("introScreen");
const verificationFailed = document.getElementById("verificationFailed");
const verificationContinueBtn = document.getElementById("verificationContinueBtn");

const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");

let checked = false;

recaptchaBox.addEventListener("click", () => {
  if (checked) return;
  checked = true;

  fakeCheckbox.classList.add("checked");

  setTimeout(() => {
    introScreen.classList.add("hidden");
    verificationFailed.classList.remove("hidden");
  }, 3000);
});

verificationContinueBtn.addEventListener("click", () => {
  verificationFailed.classList.add("hidden");
  q1.classList.remove("hidden");
});


// ==========================
// QUESTION 1 GRID LOGIC
// ==========================

const gridItems = document.querySelectorAll(".grid-item");
const continueBtn = document.getElementById("continueBtn");

let selectedCount = 0;
let selectedIndices = new Set();

function updateButton() {
  continueBtn.textContent = selectedCount === 0 ? "SKIP" : "NEXT";
}

gridItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    const imageIndex = index + 1;

    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
      selectedCount--;
      selectedIndices.delete(imageIndex);
    } else {
      if (selectedCount < 2) {
        item.classList.add("selected");
        selectedCount++;
        selectedIndices.add(imageIndex);
      }
    }

    updateButton();
  });
});

updateButton();

continueBtn.addEventListener("click", () => {
  if (
    selectedCount === 2 &&
    selectedIndices.has(6) &&
    selectedIndices.has(9)
  ) {
    q1.classList.add("hidden");
    q2.classList.remove("hidden");
  } else {
    showErrorScreen(
      "my baby is the most beautiful girl in the world. she was in the photo!!!"
    );
  }
});


// ==========================
// QUESTION 2 LOGIC (NO TXT FILE)
// ==========================


document.getElementById("q2SubmitBtn").addEventListener("click", () => {
  const inputs = [
    document.getElementById("word1").value.trim().toLowerCase(),
    document.getElementById("word2").value.trim().toLowerCase(),
    document.getElementById("word3").value.trim().toLowerCase()
  ];

  const allValid = inputs.every(word => allowedWords.includes(word));

  if (allValid) {
     // Hide Q2
    q2.classList.add("hidden");
    // Show Q3
    q3.classList.remove("hidden");
  } else {
    showErrorScreen(
      "your words didn't seem like they'd be used to describe the love of my life >:("
    );
  }
});


// ==========================
// QUESTION 3 SUBMIT LOGIC
// ==========================
const q3Input = document.getElementById("q3Answer"); 
const q3SubmitBtn = document.getElementById("q3SubmitBtn");

q3SubmitBtn.addEventListener("click", () => {
  const answer = q3Input.value.trim().toLowerCase();

  if (answer === "angel") {
    // Correct → hide Q3 and show Q4
    q3.classList.add("hidden");
    q4.classList.remove("hidden");  // <-- make sure this matches the pattern from Q2 → Q3
  } else {
    // Wrong → show error screen
    showErrorScreen("you must not be her.... she'd know what to fill in the blank with");
  }
});



// ==========================
// QUESTION 4 LOGIC (RIDDLE)
// ==========================
// Q4 hint button logic
const q4HintBtn = document.getElementById("q4HintBtn");
const q4HintText = document.getElementById("q4HintText");

q4HintBtn.addEventListener("click", () => {
  q4HintText.style.display = "inline"; // show the small text
});

// Q4 submit logic
const q4 = document.getElementById("q4");
const q4Input = document.getElementById("q4Answer");
const q4SubmitBtn = document.getElementById("q4SubmitBtn");

q4SubmitBtn.addEventListener("click", () => {
  const answer = q4Input.value.trim().toLowerCase();
  if (answer === "badminton") {
    q4.classList.add("hidden");
    q5.classList.remove("hidden");
  } else {
    showErrorScreen("keep looking ma'am i believe in you!! think beyond");
  }
});




const q5 = document.getElementById("q5");
const heroItems = q5.querySelectorAll(".hero-item");
const q5SubmitBtn = document.getElementById("q5SubmitBtn");

let selectedHeroes = new Set();

heroItems.forEach(item => {
  item.addEventListener("click", () => {
    const index = Array.from(heroItems).indexOf(item);

    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
      selectedHeroes.delete(index);
    } else {
      if (selectedHeroes.size < 2) {
        item.classList.add("selected");
        selectedHeroes.add(index);
      }
    }

    // Show submit button only when 2 heroes are selected
    if (selectedHeroes.size === 2) {
      q5SubmitBtn.classList.remove("hidden");
    } else {
      q5SubmitBtn.classList.add("hidden");
    }
  });
});

const errorScreen = document.getElementById("errorScreen");
const errorReason = document.getElementById("errorReason");

q5SubmitBtn.addEventListener("click", () => {
  const selectedArray = Array.from(selectedHeroes);

  // hero24 = index 23
  // hero34 = index 33
  const correctCombo =
    selectedArray.includes(23) &&
    selectedArray.includes(34) &&
    selectedArray.length === 2;

  if (correctCombo) {
    // ✅ Correct — move to next question (placeholder for now)
    document.getElementById("q5").classList.add("hidden");

    document.getElementById("q6").classList.remove("hidden");

  } else {
    // ❌ Wrong — show error screen
    document.getElementById("q5").classList.add("hidden");

    errorReason.textContent =
      "you did not choose the two that my baby would choose. i think idk i don't play um i might be wrong hopefully you'd pick those 🧑‍🦲";

    errorScreen.classList.remove("hidden");
  }
});






// Q6 Hand Drag + Shake Mechanic
const hand = document.getElementById("handImg");
const minmin = document.getElementById("minminImg");
const progressBar = document.getElementById("q6Progress");

hand.style.position = "absolute";
hand.style.cursor = "grab";


let dragging = false;
let offsetX = 0;
let offsetY = 0;

let progress = 0;
let lastMouseX = 0;
let lastMouseY = 0;

// Start dragging
hand.addEventListener("mousedown", e => {
  dragging = true;
  offsetX = e.clientX - hand.getBoundingClientRect().left;
  offsetY = e.clientY - hand.getBoundingClientRect().top;
  hand.style.cursor = "grabbing";
});

// Stop dragging
document.addEventListener("mouseup", () => {
  dragging = false;
  hand.style.cursor = "grab";
});

// Drag hand with mouse and update progress
document.addEventListener("mousemove", e => {
  if (!dragging) return;

  const gameArea = hand.parentElement.getBoundingClientRect();
  let x = e.clientX - gameArea.left - offsetX;
  let y = e.clientY - gameArea.top - offsetY;

  // Keep hand inside game area
  x = Math.max(0, Math.min(gameArea.width - hand.offsetWidth, x));
  y = Math.max(0, Math.min(gameArea.height - hand.offsetHeight, y));

  hand.style.left = x + "px";
  hand.style.top = y + "px";

  // Check overlap with minmin
  const handRect = hand.getBoundingClientRect();
  const minRect = minmin.getBoundingClientRect();

  if (
    handRect.right > minRect.left &&
    handRect.left < minRect.right &&
    handRect.bottom > minRect.top &&
    handRect.top < minRect.bottom
  ) {
    // Detect shake: big mouse movement
    const deltaX = Math.abs(e.clientX - lastMouseX);
    const deltaY = Math.abs(e.clientY - lastMouseY);
    const shakeAmount = deltaX + deltaY;

    if (shakeAmount > 5) { // tweak sensitivity
  progress = Math.min(100, progress + shakeAmount * 0.05); // slower progress
  progressBar.style.width = progress + "%";

  if (progress >= 100) {
  // Drop the hand
  dragging = false;
  hand.style.cursor = "grab";

  // Show GIF overlay
  const gifOverlay = document.getElementById("q6GifOverlay");
  gifOverlay.classList.remove("hidden");

  // Hide GIF and go to Q7 after 3 seconds
  setTimeout(() => {
    gifOverlay.classList.add("hidden");
    document.getElementById("q6").classList.add("hidden");
    document.getElementById("q7").classList.remove("hidden");
    
    // Reset hand position and progress if needed
    hand.style.left = "0px"; 
    hand.style.top = "0px";
    progress = 0;
    progressBar.style.width = "0%";
  }, 3000);
}
    }
}

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

// ===== Q7 LOGIC =====
const q7 = document.getElementById("q7");
const q7Number = q7.querySelector(".question-number");
const q7Options = q7.querySelectorAll(".q7-option");
const q7SubmitBtn = document.getElementById("q7SubmitBtn");

let selectedQ7Option = null;

// Click to select an option
q7Options.forEach(option => {
  option.addEventListener("click", () => {
    // mark selected visually
    q7Options.forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");
    selectedQ7Option = option.getAttribute("data-value");
  });
});

// Submit button triggers error for any option
q7SubmitBtn.addEventListener("click", () => {
  if (selectedQ7Option) {
    showErrorScreen("you're so silly. my baby would know what her favorite number is...");
    
    // hide current question
    q7.classList.add("hidden");
  } else {
    alert("Please select an option before submitting!");
  }
});

// Clicking the number moves to final results directly
q7Number.addEventListener("click", () => {
  q7.classList.add("hidden");       // hide Q7
  startFinalResults();               // show final results and start progress
});

// ===== FINAL RESULTS LOGIC =====
const finalResults = document.getElementById("finalResults");
const resultsProgressBar = document.getElementById("resultsProgressBar");
const resultsSubtext = document.getElementById("resultsSubtext");
const q8 = document.getElementById("q8");

const subtextOptions = [
  "petting a goose...",
  "cooking eggs....",
  "sending cute stickers.....",
  "loving carina...",
  "mwah'ing ur cheeks...",
  "extracting bald emojis...",
  "bleh"
];

function startFinalResults() {
  // reset
  resultsProgressBar.style.width = "0%";
  resultsSubtext.textContent = subtextOptions[0];
  finalResults.classList.remove("hidden");

  let progress = 0;
  let subtextIndex = 0;

  // Change subtext every 2 seconds
  const subtextInterval = setInterval(() => {
    subtextIndex = (subtextIndex + 1) % subtextOptions.length;
    resultsSubtext.textContent = subtextOptions[subtextIndex];
  }, 2000);

  // Fill progress bar over 15 seconds
  const intervalTime = 100; // update every 100ms
  const totalTime = 15000;  // 15 seconds
  const increment = (intervalTime / totalTime) * 100;

  const progressInterval = setInterval(() => {
    progress += increment;
    if (progress > 100) progress = 100;
    resultsProgressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(progressInterval);
      clearInterval(subtextInterval);

      resultsSubtext.textContent = "results confirmed!";

      // wait 3 seconds, then hide final results and show Q8
      setTimeout(() => {
        finalResults.classList.add("hidden");
        q8.classList.remove("hidden");
      }, 3000);
    }
  }, intervalTime);
}

// ===== ERROR SCREEN FUNCTION =====
function showErrorScreen(reasonText) {
  const errorScreen = document.getElementById("errorScreen");
  const errorReason = document.getElementById("errorReason");

  errorReason.textContent = reasonText;

  // Hide all other screens except errorScreen
  document.querySelectorAll(".screen").forEach(screen => {
    if (screen.id !== "errorScreen") {
      screen.classList.add("hidden");
    }
  });

  // Show error screen
  errorScreen.classList.remove("hidden");
}
