/* =============================================
   script.js — Rajhansh Portfolio
   All interactive logic lives here.
   Sections:
     1. Wave Cursor
     2. Particle Stars
     3. Typing Effect
     4. Scroll Reveal
     5. 3D Cube — Drag to Rotate (FIXED)
============================================= */
// =============================================
// LOADER — write letters then hide
// =============================================
// =============================================
// LOADER — write letters then hide
// =============================================
/* =============================================
   LOADER — builds letters then hides
============================================= */
const loader    = document.getElementById('loader');
const introText = document.getElementById('introText');

// Line 1: WELCOME TO MY
// Line 2: PORTFOLIO
const lines = [
  ['WELCOME', 'TO', 'MY'],
  ['PORTFOLIO']
];

let globalIndex = 0; // controls --i delay across all letters

lines.forEach((lineWords, lineIndex) => {

  // Create a div for each line — keeps words together
  const lineDiv = document.createElement('div');
  lineDiv.classList.add('intro-line');

  lineWords.forEach((word, wordIndex) => {

    // Each letter gets its own span
    word.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.setProperty('--i', globalIndex);

      // PORTFOLIO letters get big-letter class
      if (lineIndex === 1) span.classList.add('big-letter');

      lineDiv.appendChild(span);
      globalIndex++;
    });

    // Add space between words (not after last word in line)
    if (wordIndex < lineWords.length - 1) {
      const space = document.createElement('span');
      space.classList.add('space');
      lineDiv.appendChild(space);
    }
  });

  introText.appendChild(lineDiv);
});

// Hide loader after all letters have landed
setTimeout(() => {
  loader.classList.add('hide');
}, 3000);


/* =============================================
   1. WAVE / SEA RIPPLE CURSOR
   ─────────────────────────────────────────────
   - Mouse move → small expanding rings trail behind cursor
   - Click       → burst of 3 large rings for impact
   - Touch move  → trail ripples on mobile
   - Touch tap   → single big ripple on mobile tap
   No dot, no circle — pure wave effect.
============================================= */
const waveCanvas = document.getElementById('wave-canvas');
const wctx       = waveCanvas.getContext('2d');

/* Always fill the window */
function resizeWave() {
  waveCanvas.width  = window.innerWidth;
  waveCanvas.height = window.innerHeight;
}
resizeWave();
window.addEventListener('resize', resizeWave);

let ripples = []; // pool of all currently active ripple objects

/*
  Create one ripple at (x, y).
  big = true makes it larger and slower-fading (used for clicks).
*/
function spawnRipple(x, y, big = false) {
  ripples.push({
    x, y,
    r:     big ? 6   : 2,    // starting radius in px
    maxR:  big ? 100 : 50,   // max radius before dying
    alpha: big ? 0.75: 0.5,  // starting opacity
    speed: big ? 3.2 : 2.0,  // px expansion per frame
    lw:    big ? 2   : 1.2   // stroke line width
  });
}

/* Draw and update all ripples every animation frame */
function animateWaves() {
  wctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

  /* Kill fully faded ripples */
  ripples = ripples.filter(r => r.alpha > 0.005);

  ripples.forEach(rip => {
    /* Outer main ring */
    wctx.beginPath();
    wctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
    wctx.strokeStyle = `rgba(124, 92, 252, ${rip.alpha})`;
    wctx.lineWidth   = rip.lw;
    wctx.stroke();

    /* Inner softer ring — gives the layered sea-wave look */
    if (rip.r > 8) {
      wctx.beginPath();
      wctx.arc(rip.x, rip.y, rip.r * 0.6, 0, Math.PI * 2);
      wctx.strokeStyle = `rgba(167, 139, 250, ${rip.alpha * 0.28})`;
      wctx.lineWidth   = rip.lw * 0.5;
      wctx.stroke();
    }

    /* Expand radius and fade opacity each frame */
    rip.r     += rip.speed;
    rip.alpha -= rip.lw > 1.5 ? 0.013 : 0.017;
    if (rip.r >= rip.maxR) rip.alpha = 0; /* force-kill at max size */
  });

  requestAnimationFrame(animateWaves);
}
animateWaves();

/* Throttle mouse-move ripples: max 1 per 25ms */
let lastRippleTime = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastRippleTime > 25) {
    spawnRipple(e.clientX, e.clientY, false);
    lastRippleTime = now;
  }
});

/* Click: 3 big ripples staggered 80ms apart */
document.addEventListener('click', e => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => spawnRipple(e.clientX, e.clientY, true), i * 80);
  }
});

/* Mobile touch move — trail */
document.addEventListener('touchmove', e => {
  spawnRipple(e.touches[0].clientX, e.touches[0].clientY, false);
}, { passive: true });

/* Mobile touch tap — big burst */
document.addEventListener('touchstart', e => {
  spawnRipple(e.touches[0].clientX, e.touches[0].clientY, true);
}, { passive: true });


/* =============================================
   2. PARTICLE STAR BACKGROUND
   ─────────────────────────────────────────────
   150 small glowing dots float slowly in the
   hero section like distant stars.
============================================= */
const pCanvas = document.getElementById('particles-canvas');
const pctx    = pCanvas.getContext('2d');

function resizeParticles() {
  pCanvas.width  = pCanvas.offsetWidth;
  pCanvas.height = pCanvas.offsetHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

/* Generate 150 random particle objects */
const particles = Array.from({ length: 150 }, () => ({
  x:     Math.random() * pCanvas.width,
  y:     Math.random() * pCanvas.height,
  r:     Math.random() * 1.6 + 0.2,           // radius
  dx:    (Math.random() - 0.5) * 0.22,         // x velocity
  dy:    (Math.random() - 0.5) * 0.22,         // y velocity
  alpha: Math.random() * 0.5 + 0.1             // opacity
}));

function animateParticles() {
  pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach(p => {
    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
    pctx.fill();
    /* Move particle and wrap around edges */
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0)             p.x = pCanvas.width;
    if (p.x > pCanvas.width)  p.x = 0;
    if (p.y < 0)             p.y = pCanvas.height;
    if (p.y > pCanvas.height) p.y = 0;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* =============================================
   3. TYPING EFFECT
   ─────────────────────────────────────────────
   Types each role string character by character,
   pauses, then deletes it, then moves to the next.
   Starts after intro screen disappears (~5.5s).
============================================= */
const roles   = ['A Creative Learner', 'A Frontend Developer', 'A Problem Solver', 'A UI Enthusiast'];
let roleIndex = 0;   // which role string we're on
let charIndex = 0;   // how many chars typed so far
let deleting  = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = roles[roleIndex];

  if (!deleting) {
    /* Add one character */
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      /* Fully typed — pause 1.8s then start deleting */
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    /* Remove one character */
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      /* Fully deleted — move to next role */
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  /* Speed: 55ms deleting, 95ms typing */
  setTimeout(type, deleting ? 55 : 95);
}

/* Start after intro animation completes */
setTimeout(type, 5500);


/* =============================================
   4. SCROLL REVEAL
   ─────────────────────────────────────────────
   IntersectionObserver watches all .reveal elements.
   When one enters the viewport, .visible is added,
   triggering the CSS fade+slide transition.
   Skill cards also get their progress bar animated.
============================================= */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      /* If it's a skill card, animate its progress bar */
      if (entry.target.classList.contains('skill-card')) {
        const bar     = entry.target.querySelector('.progress-fill');
        const percent = entry.target.dataset.percent;
        /* Small delay so the bar animates after card fades in */
        setTimeout(() => { bar.style.width = percent + '%'; }, 250);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* =============================================
   5. 3D CUBE — DRAG TO ROTATE (BUG-FREE)
   ─────────────────────────────────────────────
   HOW IT WORKS:
   - rotX / rotY store the current rotation angles
   - On drag start: save mouse/touch start position,
     remove CSS animation so levitation stops
   - On drag move: update rotX/rotY from delta,
     apply via inline style transform
   - On drag end: store final angles, add inertia
     momentum, then restart levitation animation

   BUGS FIXED:
   ✅ Cube no longer snaps back to default on release
   ✅ rotX is NOT clamped so top/bottom faces are reachable
   ✅ Momentum/inertia: cube keeps spinning after release
   ✅ Levitation restarts from the CURRENT angle (not default)
   ✅ Works for both mouse and touch
============================================= */
const cubeEl  = document.getElementById('cube');
const sceneEl = document.getElementById('cubeScene');

let rotX = -18; /* current tilt  (up/down) */
let rotY =  28; /* current spin  (left/right) */

let isDragging = false;
let lastMouseX, lastMouseY;

/* Inertia — velocity kept after drag ends */
let velX = 0;
let velY = 0;
let inertiaFrame = null; /* requestAnimationFrame id for inertia */

/* Apply current rotX / rotY to the cube element */
function applyTransform() {
  cubeEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

/*
  Stop the levitation CSS animation and store the
  current angles so they are not lost.
*/
function pauseFloat() {
  cubeEl.classList.remove('floating');
  cubeEl.style.animation = 'none';
  applyTransform();
}

/*
  Restart levitation from whatever rotX/rotY we're at now.
  We set CSS custom properties --rx and --ry which the
  @keyframes levitate uses, so it floats from the
  correct current position instead of snapping to default.
*/
function resumeFloat() {
  cubeEl.style.setProperty('--rx', rotX + 'deg');
  cubeEl.style.setProperty('--ry', rotY + 'deg');
  cubeEl.style.animation = ''; /* re-enable */
  cubeEl.classList.add('floating');
}

/* Cancel any running inertia animation */
function stopInertia() {
  if (inertiaFrame) {
    cancelAnimationFrame(inertiaFrame);
    inertiaFrame = null;
  }
}

/*
  Inertia loop — after drag ends, keep applying
  velocity and slow it down each frame (friction).
*/
function runInertia() {
  /* Friction: reduce velocity by 5% each frame */
  velX *= 0.95;
  velY *= 0.95;

  /* Stop when velocity is negligible */
  if (Math.abs(velX) < 0.05 && Math.abs(velY) < 0.05) {
    resumeFloat(); /* restart levitation once settled */
    return;
  }

  rotY += velY;
  rotX += velX; /* NO clamp — allows top/bottom faces */
  applyTransform();

  inertiaFrame = requestAnimationFrame(runInertia);
}

/* ---- MOUSE DRAG ---- */
sceneEl.addEventListener('mousedown', e => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  velX = 0; velY = 0;
  stopInertia();
  pauseFloat();
  e.preventDefault(); /* stop text selection */
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;

  const dx = e.clientX - lastMouseX; /* horizontal delta */
  const dy = e.clientY - lastMouseY; /* vertical delta   */

  /* Convert pixel delta to rotation degrees.
     0.45 feels natural — adjust for faster/slower feel */
  rotY += dx * 0.45;
  rotX -= dy * 0.45; /* minus because dragging down = tilt backward */

  /* Track velocity for inertia */
  velY = dx * 0.45;
  velX = -dy * 0.45;

  applyTransform();

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  /* Start inertia spin then resume levitation */
  runInertia();
});

/* ---- TOUCH DRAG ---- */
sceneEl.addEventListener('touchstart', e => {
  lastMouseX = e.touches[0].clientX;
  lastMouseY = e.touches[0].clientY;
  velX = 0; velY = 0;
  stopInertia();
  pauseFloat();
}, { passive: true });

sceneEl.addEventListener('touchmove', e => {
  e.preventDefault(); /* stop page scroll while rotating cube */

  const dx = e.touches[0].clientX - lastMouseX;
  const dy = e.touches[0].clientY - lastMouseY;

  rotY += dx * 0.45;
  rotX -= dy * 0.45;

  velY = dx * 0.45;
  velX = -dy * 0.45;

  applyTransform();

  lastMouseX = e.touches[0].clientX;
  lastMouseY = e.touches[0].clientY;
}, { passive: false });

sceneEl.addEventListener('touchend', () => {
  runInertia(); /* spin + settle + resume levitation */
});

/* Start levitation on page load */
resumeFloat();


/* =============================================
   6. HAMBURGER MENU
   Toggle drawer open/close on mobile.
   Closes when a nav link is clicked.
============================================= */
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('nav-open');
});

/* Close drawer when any nav link is tapped */
document.querySelectorAll('.nav-link-item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
  });
});


/* =============================================
   7. RESPONSIVE CUBE SIZE
   Cube translateZ must match half of rendered
   CSS size so faces align correctly on all screens.
============================================= */
function getCubeHalf() {
  const scene = document.getElementById('cubeScene');
  return scene.offsetWidth / 2;
}

function updateCubeFaces() {
  const half = getCubeHalf();
  const faceMap = {
    '.face-front' : `translateZ(${half}px)`,
    '.face-back'  : `rotateY(180deg) translateZ(${half}px)`,
    '.face-right' : `rotateY(90deg) translateZ(${half}px)`,
    '.face-left'  : `rotateY(-90deg) translateZ(${half}px)`,
    '.face-top'   : `rotateX(90deg) translateZ(${half}px)`,
    '.face-bottom': `rotateX(-90deg) translateZ(${half}px)`,
  };
  Object.entries(faceMap).forEach(([sel, val]) => {
    const el = document.querySelector(sel);
    if (el) el.style.transform = val;
  });
}

/* Run on load and on resize */
updateCubeFaces();
window.addEventListener('resize', updateCubeFaces);
