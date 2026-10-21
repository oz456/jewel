/**
 * JEWEL — Raw Beauty & Honest Craft
 * Native Vanilla ES6+ Interactive Engine
 * Pure Native Standards: 3D Ring Falling Scroll Journey, Draggable Polaroids & Audio
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ON-SCROLL 3D RING FALLING & TRANSFORMATION JOURNEY
     ========================================================================== */
  const fallingRing = document.getElementById('fallingRing');
  const ringShadow = document.getElementById('ringShadow');
  const revealCards = document.querySelectorAll('[data-scroll-reveal]');

  let targetX = 0;
  let targetY = 0;
  let targetRotX = 25;
  let targetRotY = 0;
  let targetRotZ = -15;
  let targetScale = 0.9;
  let targetOpacity = 0.95;

  let currentX = 0;
  let currentY = 0;
  let currentRotX = 25;
  let currentRotY = 0;
  let currentRotZ = -15;
  let currentScale = 0.9;
  let currentOpacity = 0.95;

  function calculateRingScrollPhysics() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Phase 1 (0 to 0.25): Resting in Hero, floating slightly above polaroids
    if (progress < 0.25) {
      const p = progress / 0.25;
      targetX = Math.sin(p * Math.PI) * 40;
      targetY = -80 + (p * 80);
      targetRotX = 25 + Math.sin(p * Math.PI * 2) * 15;
      targetRotY = p * 180;
      targetRotZ = -15 + (p * 20);
      targetScale = 0.85 + (p * 0.25);
      targetOpacity = 0.95;
    } 
    // Phase 2 (0.25 to 0.60): Falling into Act 1 (The Weight of Gold) - swoops to the right
    else if (progress < 0.60) {
      const p = (progress - 0.25) / 0.35;
      targetX = 140 - Math.cos(p * Math.PI) * 60;
      targetY = (p * 60);
      targetRotX = 35 + (p * 45);
      targetRotY = 180 + (p * 360);
      targetRotZ = 15 - (p * 40);
      targetScale = 1.15 + Math.sin(p * Math.PI) * 0.15;
      targetOpacity = 1;
    } 
    // Phase 3 (0.60 to 0.85): Floating across into Act 2 (Uncut Diamond Geology) - shifts to the left
    else if (progress < 0.85) {
      const p = (progress - 0.60) / 0.25;
      targetX = -120 + Math.sin(p * Math.PI) * 40;
      targetY = 20 - (p * 40);
      targetRotX = 55 - (p * 30);
      targetRotY = 540 + (p * 280);
      targetRotZ = -25 + (p * 35);
      targetScale = 1.1 - (p * 0.15);
      targetOpacity = 1;
    } 
    // Phase 4 (0.85 to 1.0): Gentle repose / landing in Act 3 (Private Acquisition)
    else {
      const p = (progress - 0.85) / 0.15;
      targetX = (1 - p) * -80;
      targetY = -20 + (p * 80);
      targetRotX = 25 - (p * 15);
      targetRotY = 820 + (p * 140);
      targetRotZ = 10 - (p * 10);
      targetScale = 0.95 - (p * 0.25);
      targetOpacity = 1 - (p * 0.45);
    }
  }

  // Smooth lerp physics loop for high-end cinematic feel
  function renderRingPhysics() {
    calculateRingScrollPhysics();

    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;
    currentRotX += (targetRotX - currentRotX) * 0.09;
    currentRotY += (targetRotY - currentRotY) * 0.09;
    currentRotZ += (targetRotZ - currentRotZ) * 0.09;
    currentScale += (targetScale - currentScale) * 0.09;
    currentOpacity += (targetOpacity - currentOpacity) * 0.09;

    if (fallingRing) {
      fallingRing.style.transform = `
        translate3d(${currentX}px, ${currentY}px, 0px)
        rotateX(${currentRotX}deg)
        rotateY(${currentRotY}deg)
        rotateZ(${currentRotZ}deg)
        scale(${currentScale})
      `;
      fallingRing.style.opacity = currentOpacity;
    }

    if (ringShadow) {
      const shadowScale = currentScale * 0.9;
      ringShadow.style.transform = `translateX(-50%) scale(${shadowScale})`;
      ringShadow.style.opacity = currentOpacity * 0.6;
    }

    requestAnimationFrame(renderRingPhysics);
  }
  requestAnimationFrame(renderRingPhysics);

  // Intersection Observer for On-Scroll Story Card Reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  revealCards.forEach(card => revealObserver.observe(card));

  /* ==========================================================================
     2. DRAGGABLE POLAROIDS WITH TACTILE SPRING INERTIA
     ========================================================================== */
  const polaroids = document.querySelectorAll('[data-drag]');
  let highestZ = 30;

  polaroids.forEach((item) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currX = 0;
    let currY = 0;
    const baseAngle = parseFloat(item.dataset.angle || 0);

    item.addEventListener('pointerdown', (e) => {
      isDragging = true;
      highestZ += 1;
      item.style.zIndex = highestZ;

      startX = e.clientX - currX;
      startY = e.clientY - currY;
      item.setPointerCapture(e.pointerId);

      item.style.transition = 'box-shadow 0.2s ease';
      playChime(640, 0.04);
    });

    item.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      currX = e.clientX - startX;
      currY = e.clientY - startY;

      const velocityTilt = Math.max(-12, Math.min(12, e.movementX * 1.5));
      item.style.transform = `translate(${currX}px, ${currY}px) rotate(${baseAngle + velocityTilt}deg) scale(1.05)`;
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { item.releasePointerCapture(e.pointerId); } catch (_) {}

      item.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      item.style.transform = `translate(${currX}px, ${currY}px) rotate(${baseAngle}deg) scale(1)`;
      playChime(480, 0.03);
    };

    item.addEventListener('pointerup', stopDrag);
    item.addEventListener('pointercancel', stopDrag);
  });

  /* ==========================================================================
     3. 3D PERSPECTIVE PARALLAX TILT
     ========================================================================== */
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     4. CUSTOM LOUPE CURSOR
     ========================================================================== */
  const cursor = document.getElementById('customCursor');
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    if (cursor) {
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  const hoverTargets = document.querySelectorAll('a, button, [data-drag], .spec-card-polaroid, .edition-box, .sound-toggle-pill');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ==========================================================================
     5. FLOATING GOLDEN DUST AMBIENT PARTICLES CANVAS
     ========================================================================== */
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.5;
      this.speedY = Math.random() * 0.25 + 0.08;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.color = Math.random() > 0.3 ? 'rgba(197, 160, 89,' : 'rgba(230, 200, 117,';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.004;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${Math.max(0.05, Math.min(0.6, this.opacity))})`;
      ctx.fill();
    }
  }

  const particleCount = window.innerWidth < 768 ? 18 : 36;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderParticles);
  }
  requestAnimationFrame(renderParticles);

  /* ==========================================================================
     6. ATELIER AMBIENCE (Web Audio API Synthesizer)
     ========================================================================== */
  const soundToggle = document.getElementById('soundToggle');
  let audioCtx = null;
  let soundActive = false;
  let noiseNode = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq, duration = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  soundToggle.addEventListener('click', () => {
    initAudio();
    soundActive = !soundActive;

    if (soundActive) {
      soundToggle.classList.add('playing');
      startAtmosphere();
      playChime(523.25, 0.25);
    } else {
      soundToggle.classList.remove('playing');
      stopAtmosphere();
    }
  });

  function startAtmosphere() {
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioCtx.currentTime);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.012, audioCtx.currentTime);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noiseNode.start();
  }

  function stopAtmosphere() {
    if (noiseNode) {
      try { noiseNode.stop(); } catch (_) {}
      noiseNode = null;
    }
  }

  const brandLogo = document.getElementById('brandLogo');
  brandLogo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playChime(587.33, 0.2);
  });

});
