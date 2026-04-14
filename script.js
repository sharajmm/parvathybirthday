// ===== FLOATING ELEMENTS =====
const emojis = ['🍓','🌸','🎀','💗','✨','🌹','🩷','🫧','💐','🧁','🎂','🦋'];
const floatContainer = document.getElementById('floatingElements');
function spawnFloat() {
  const el = document.createElement('span');
  el.className = 'floating';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = Math.random() * 100 + '%';
  el.style.animationDuration = (8 + Math.random() * 12) + 's';
  el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  el.style.animationDelay = Math.random() * 2 + 's';
  floatContainer.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
setInterval(spawnFloat, 800);
for (let i = 0; i < 8; i++) setTimeout(spawnFloat, i * 300);

// ===== AUDIO =====
const bgMusic = document.getElementById('bgMusic');
const audio1 = document.getElementById('audio1');
let bgMusicStarted = false;
let audio1Playing = false;
let globalMuted = false;

function toggleGlobalMute() {
  globalMuted = !globalMuted;
  const muteBtn = document.getElementById('muteBtn');
  
  if (globalMuted) {
    bgMusic.muted = true;
    audio1.muted = true;
    muteBtn.textContent = '🔇';
  } else {
    bgMusic.muted = false;
    audio1.muted = false;
    muteBtn.textContent = '🔊';
  }
}

// ===== START WEBSITE =====
function startWebsite() {
  // Start bg music
  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {});
  bgMusicStarted = true;

  showScreen('screen-welcome', 'screen-q1');
  burstConfetti();
}

// ===== SCREEN NAVIGATION =====
function showScreen(fromId, toId) {
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  from.classList.remove('active');
  from.style.display = 'none';
  to.classList.add('active');
  to.style.display = 'flex';
  window.scrollTo(0, 0);
}

function answerYes(fromId, toId) {
  burstConfetti();
  showScreen(fromId, toId);

  // If transitioning to main, ensure bg music playing
  if (toId === 'screen-main' && bgMusicStarted) {
    bgMusic.play().catch(() => {});
  }
}

// ===== DODGING NO BUTTONS =====
function makeNoDodge(btn) {
  const dodge = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const parent = btn.closest('.screen');
    const rect = parent.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const maxX = rect.width - btnRect.width - 20;
    const maxY = rect.height - btnRect.height - 20;
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;
    btn.style.position = 'fixed';
    btn.style.left = (rect.left + newX) + 'px';
    btn.style.top = (rect.top + newY) + 'px';
    btn.style.zIndex = '100';
    btn.style.transition = 'all 0.15s ease';

    // Change text randomly
    const noTexts = ["Nope! 🏃‍♀️","Can't click me!","Try again 😜","Nice try 🤭","Nuh uh! 💅","NEVER 😈","Hehe 🎀","Not today!"];
    btn.textContent = noTexts[Math.floor(Math.random() * noTexts.length)];
  };

  btn.addEventListener('click', dodge);
  btn.addEventListener('touchstart', dodge, { passive: false });
  btn.addEventListener('mouseenter', dodge);
}

document.querySelectorAll('.btn-no').forEach(makeNoDodge);

// ===== CONFETTI BURST =====
function burstConfetti() {
  const confettiEmojis = ['🎀','🍓','💗','✨','🌸','⭐','🩷','💖','🎂','🧁'];
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      c.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      document.body.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }, i * 60);
  }
}

// ===== MUSIC SECTION (audio1) =====
function toggleSong() {
  const gifContainer = document.getElementById('musicGifContainer');
  const icon = document.getElementById('musicIcon');
  const btn = document.getElementById('playSongBtn');

  if (audio1Playing) {
    audio1.pause();
    audio1.currentTime = 0;
    audio1Playing = false;
    gifContainer.classList.add('hidden');
    icon.textContent = '▶️';
    btn.innerHTML = '<span id="musicIcon">▶️</span> Play Song';
    // Resume bg music
    if (bgMusicStarted) bgMusic.play().catch(() => {});
  } else {
    // Pause bg music while audio1 plays
    bgMusic.pause();
    audio1.volume = 0.8;
    audio1.play().catch(() => {});
    audio1Playing = true;
    gifContainer.classList.remove('hidden');
    icon.textContent = '⏸️';
    btn.innerHTML = '<span id="musicIcon">⏸️</span> Pause Song';

    audio1.onended = () => {
      audio1Playing = false;
      gifContainer.classList.add('hidden');
      btn.innerHTML = '<span id="musicIcon">▶️</span> Play Our Song';
      if (bgMusicStarted) bgMusic.play().catch(() => {});
    };
  }
}

// ===== VIDEO PLAYBACK =====
function toggleVideo(video) {
  const overlay = video.parentElement.querySelector('.video-overlay');
  if (video.paused) {
    // Pause all other videos
    document.querySelectorAll('.video-box video').forEach(v => {
      if (v !== video) {
        v.pause();
        v.parentElement.querySelector('.video-overlay').classList.remove('hidden');
      }
    });
    video.play().catch(() => {});
    overlay.classList.add('hidden');
  } else {
    video.pause();
    overlay.classList.remove('hidden');
  }
}

// ===== IMAGE CAROUSEL =====
let currentSlide = 0;
const totalSlides = 8;
const carouselTrack = document.getElementById('imageCarousel');

function initCarousel() {
  const dotsContainer = document.getElementById('carouselDots');
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.className = 'dot' + (index === currentSlide ? ' active' : '');
  });
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

function moveCarousel(direction) {
  let newIndex = currentSlide + direction;
  // Loop around
  if (newIndex >= totalSlides) newIndex = 0;
  if (newIndex < 0) newIndex = totalSlides - 1;
  goToSlide(newIndex);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initCarousel);

// ===== INTERSECTION OBSERVER FOR CARDS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
