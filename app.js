/*
  GANTI NOMOR WHATSAPP DI BAWAH INI.
  Format Indonesia: 62 + nomor tanpa angka 0 di depan.
  Contoh 081234567890 menjadi 6281234567890.
*/
const WHATSAPP_NUMBER = "6282273568688";

const slides = [...document.querySelectorAll(".slide")];
const dotsContainer = document.getElementById("dots");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
let currentSlide = 0;

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Buka slide ${index + 1}`);
  dot.addEventListener("click", () => showSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = [...document.querySelectorAll(".dot")];

function showSlide(index) {
  if (index < 0 || index >= slides.length || index === currentSlide) return;

  const oldSlide = slides[currentSlide];
  const directionForward = index > currentSlide;

  oldSlide.classList.remove("active");
  oldSlide.classList.toggle("leaving-left", directionForward);

  window.setTimeout(() => oldSlide.classList.remove("leaving-left"), 850);

  currentSlide = index;
  slides[currentSlide].classList.add("active");
  updateNavigation();
}

function updateNavigation() {
  dots.forEach((dot, index) => dot.classList.toggle("active", index === currentSlide));
  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  nextButton.style.visibility = currentSlide === 4 ? "hidden" : "visible";
}

prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
document.querySelectorAll(".next-slide").forEach(button => {
  button.addEventListener("click", () => showSlide(currentSlide + 1));
});

document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") showSlide(currentSlide + 1);
  if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
});

let touchStartX = 0;
document.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) < 70) return;
  if (distance < 0) showSlide(currentSlide + 1);
  if (distance > 0) showSlide(currentSlide - 1);
}, { passive: true });

updateNavigation();

/* Musik */
const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
let musicStarted = false;

function startMusic() {
  if (musicStarted) return;
  music.volume = 0.45;
  music.play().then(() => {
    musicStarted = true;
    musicButton.classList.add("playing");
    musicLabel.textContent = "Menyala";
  }).catch(() => {});
}

function toggleMusic() {
  if (music.paused) {
    music.play().then(() => {
      musicStarted = true;
      musicButton.classList.add("playing");
      musicLabel.textContent = "Menyala";
    }).catch(() => {});
  } else {
    music.pause();
    musicButton.classList.remove("playing");
    musicLabel.textContent = "Musik";
  }
}

document.addEventListener("pointerdown", startMusic, { once: true });
musicButton.addEventListener("click", event => {
  event.stopPropagation();
  toggleMusic();
});

/* Amplop */
const envelope = document.getElementById("envelope");
const finishLetter = document.getElementById("finishLetter");
let envelopeOpen = false;

function openEnvelope() {
  if (envelopeOpen) return;
  envelopeOpen = true;
  envelope.classList.add("open");
  document.getElementById("envelopeHint").textContent = "Suratnya sudah terbuka 🤍";
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope();
  }
});

finishLetter.addEventListener("click", event => {
  event.stopPropagation();
  showSlide(5);
});

/* Jawaban ke WhatsApp */
function sendAnswer(answer) {
  const isPlaceholder = WHATSAPP_NUMBER === "6281234567890";
  const message = answer === "yes"
    ? "Hai, aku sudah membaca semuanya. Jawabanku: Iya, aku bersedia menjalani cerita ini bersamamu 🤍"
    : "Hai, aku sudah membaca semuanya. Aku menghargai perasaanmu, tapi saat ini aku masih butuh waktu untuk memikirkan jawabanku.";

  if (answer === "yes") createCelebration();

  if (isPlaceholder) {
    alert("Nomor WhatsApp tujuan belum diganti. Buka app.js lalu ganti WHATSAPP_NUMBER dengan nomor kamu.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("yesButton").addEventListener("click", () => sendAnswer("yes"));
document.getElementById("timeButton").addEventListener("click", () => sendAnswer("time"));

/* Album/lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

document.querySelectorAll(".album-photo").forEach(photo => {
  photo.addEventListener("click", () => {
    lightboxImage.src = photo.dataset.image;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

/* Background cinematic */
const heartRain = document.getElementById("heartRain");
const sparkleField = document.getElementById("sparkleField");

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "rain-heart";
  heart.textContent = ["♥","♡","❤"][Math.floor(Math.random() * 3)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 23}px`;
  heart.style.animationDuration = `${7 + Math.random() * 7}s`;
  heart.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
  heart.style.setProperty("--op", `${.32 + Math.random() * .5}`);
  heartRain.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}

const sparkleCount = window.innerWidth < 600 ? 26 : 50;
for (let i = 0; i < sparkleCount; i += 1) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.animationDuration = `${2.2 + Math.random() * 4}s`;
  sparkle.style.animationDelay = `${Math.random() * 5}s`;
  sparkleField.appendChild(sparkle);
}

setInterval(createHeart, window.innerWidth < 600 ? 360 : 230);
for (let i = 0; i < 12; i += 1) setTimeout(createHeart, i * 130);

/* Celebration */
function createCelebration() {
  const celebration = document.getElementById("celebration");
  celebration.innerHTML = "";

  for (let i = 0; i < 42; i += 1) {
    const particle = document.createElement("span");
    particle.className = "heart-particle";
    particle.textContent = ["♥","♡","✦"][Math.floor(Math.random() * 3)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.fontSize = `${16 + Math.random() * 24}px`;
    particle.style.animationDuration = `${3 + Math.random() * 3.5}s`;
    particle.style.animationDelay = `${Math.random()}s`;
    particle.style.color = Math.random() > .5 ? "#f4a6ba" : "#ffffff";
    celebration.appendChild(particle);
  }

  setTimeout(() => celebration.innerHTML = "", 8000);
}
