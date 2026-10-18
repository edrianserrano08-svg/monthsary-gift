// ==========================================
//   STARFIELD
// ==========================================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = [];
  const count = Math.floor((w * h) / 6000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    });
  }
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

function drawStars() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => {
    s.a += s.speed;
    const alpha = 0.3 + Math.abs(Math.sin(s.a)) * 0.7;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(214, 51, 108, ${alpha * 0.5})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ==========================================
//   FLOATING HEARTS
// ==========================================
const heartsContainer = document.getElementById('hearts');
const heartEmojis = ['❤️', '💕', '💖', '💗', '💘'];

setInterval(() => {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (7 + Math.random() * 7) + 's';
  heart.style.fontSize = (12 + Math.random() * 16) + 'px';
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}, 700);

// ==========================================
//   SCROLL REVEAL
// ==========================================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ==========================================
//   LIVE COUNTER (tuloy-tuloy)
// ==========================================
// ⚠️ ITO ANG EXACT START DATE NIYO
// Format: new Date(YYYY, MM-1, DD, HH, MM, SS)
// Month is 0-indexed: 0=Jan, 1=Feb, ..., 5=June
const startDate = new Date(2023, 5, 19, 3, 20, 13); // June 19, 2023, 3:59 AM

function getElapsed(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds };
}

function updateCounter() {
  const now = new Date();

  if (now < startDate) {
    document.getElementById('liveCounter').innerHTML = 'Starting soon…';
    return;
  }

  const t = getElapsed(startDate, now);

  document.getElementById('liveCounter').innerHTML = `
    <div class="counter-grid">
      <div class="counter-item"><strong>${t.years}</strong><span>Years</span></div>
      <div class="counter-item"><strong>${t.months}</strong><span>Months</span></div>
      <div class="counter-item"><strong>${t.days}</strong><span>Days</span></div>
      <div class="counter-item"><strong>${t.hours}</strong><span>Hours</span></div>
      <div class="counter-item"><strong>${t.minutes}</strong><span>Minutes</span></div>
      <div class="counter-item"><strong>${t.seconds}</strong><span>Seconds</span></div>
    </div>
  `;
}
updateCounter();
setInterval(updateCounter, 1000);

// ==========================================
//   BACKGROUND MUSIC
// ==========================================
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

bgMusic.volume = 0.45;

function updateMusicUI() {
  if (bgMusic.paused) {
    musicBtn.classList.remove('playing');
    musicIcon.textContent = '🎵';
  } else {
    musicBtn.classList.add('playing');
    musicIcon.textContent = '🎶';
  }
}

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(updateMusicUI).catch(err => {
      console.log('Play failed:', err);
    });
  } else {
    bgMusic.pause();
    updateMusicUI();
  }
});

function tryAutoplay() {
  bgMusic.play().then(() => {
    updateMusicUI();
    document.removeEventListener('click', tryAutoplay);
    document.removeEventListener('touchstart', tryAutoplay);
  }).catch(() => {});
}

document.addEventListener('click', tryAutoplay, { once: true });
document.addEventListener('touchstart', tryAutoplay, { once: true });

bgMusic.addEventListener('play', updateMusicUI);
bgMusic.addEventListener('pause', updateMusicUI);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && !bgMusic.paused) {
    bgMusic.pause();
    updateMusicUI();
  }
});

// ==========================================
//   LETTER MODAL
// ==========================================
const letterBtn = document.getElementById('letterBtn');
const letterModal = document.getElementById('letterModal');
const closeModal = document.getElementById('closeModal');

letterBtn.addEventListener('click', () => {
  letterModal.classList.add('active');
});
closeModal.addEventListener('click', () => {
  letterModal.classList.remove('active');
});
letterModal.addEventListener('click', e => {
  if (e.target === letterModal) letterModal.classList.remove('active');
});

// ==========================================
//   SURPRISE BOX
// ==========================================
const surpriseBox = document.getElementById('surpriseBox');
const surpriseModal = document.getElementById('surpriseModal');
const closeSurprise = document.getElementById('closeSurprise');

surpriseBox.addEventListener('click', () => {
  if (surpriseBox.classList.contains('opened')) return;
  surpriseBox.classList.add('opened');

  setTimeout(() => {
    surpriseModal.classList.add('active');
    createConfetti();
  }, 700);
});

closeSurprise.addEventListener('click', () => {
  surpriseModal.classList.remove('active');
});
surpriseModal.addEventListener('click', e => {
  if (e.target === surpriseModal) surpriseModal.classList.remove('active');
});

// ==========================================
//   HEART CONFETTI
// ==========================================
const confettiContainer = document.getElementById('confetti');

function createConfetti() {
  const emojis = ['💖', '💕', '❤️', '💗', '💘', '✨', '🌹'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-20vh';
    piece.style.fontSize = (14 + Math.random() * 18) + 'px';
    piece.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    piece.style.animationDelay = (Math.random() * 1.2) + 's';
    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

// ==========================================
//   PREVENT DOUBLE-TAP ZOOM (iOS)
// ==========================================
let lastTouch = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouch <= 300) {
    e.preventDefault();
  }
  lastTouch = now;
}, { passive: false });

// ==========================================
//   VIEWPORT HEIGHT FIX (mobile address bar)
// ==========================================
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);