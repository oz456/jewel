/**
 * JEWEL — Raw Beauty & Honest Craft
 * Native Vanilla ES6+ Interactive Engine
 * 
 * Features:
 * 1. The Vector Master Artisan character perched initially on the left torn card.
 * 2. On scroll, he journeys from top to bottom through the atelier chapters.
 * 3. FINAL ACT PARTICLES BURST: When scrolling into the final sanctuary section,
 *    the particle system triggers a golden dust & starburst swirl that gathers around
 *    the artisan.
 * 4. PURE SYNTHESIZED ATELIER AUDIO: Rich, audible, gentle ambient music loop
 *    combining warm singing bowls, soft crackle, and periodic acoustic glass chimes
 *    (Zero external files, reliable cross-browser Web Audio API).
 * 5. Unique interactive footer with hallmark chimes & live kiln clock.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ARTISAN VECTOR CHARACTER ON-SCROLL CHOREOGRAPHY
     ========================================================================== */
  const artisan = document.getElementById('artisanCharacter');
  const bubble = document.getElementById('artisanBubble');
  const bubbleText = bubble ? bubble.querySelector('.bubble-text') : null;
  const clayCard = document.getElementById('clayCard');

  let targetX = 120;
  let targetY = 160;
  let targetRot = 0;
  let targetScale = 1;

  let currentX = 120;
  let currentY = 160;
  let currentRot = 0;
  let currentScale = 1;

  let mouseParallaxX = 0;
  let mouseParallaxY = 0;

  window.scrollProgress = 0;

  function getClayPerchPosition() {
    if (!clayCard) return { x: window.innerWidth * 0.15, y: 160 };
    const rect = clayCard.getBoundingClientRect();
    const perchX = rect.left + rect.width * 0.58;
    const perchY = Math.max(130, rect.top - 80);
    return { x: perchX, y: perchY };
  }

  function calculateArtisanJourney() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    window.scrollProgress = progress;

    const perch = getClayPerchPosition();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Phase 0 (Hero / Top): Resting perched on the clay card, examining the raw pieces
    if (progress < 0.12) {
      const p = progress / 0.12;
      targetX = perch.x + (p * 40);
      targetY = perch.y + (p * 40);
      targetRot = -4 + (p * 6);
      targetScale = 0.95 + (p * 0.1);

      if (bubbleText) bubbleText.textContent = "“Inspecting raw 18k gold...”";
      if (bubble) bubble.style.opacity = "1";
    }
    // Phase 1 (0.12 to 0.50): Glides across to Chapter 1 ("01 / The Ingot Pour")
    else if (progress < 0.50) {
      const p = (progress - 0.12) / 0.38;
      targetX = (perch.x + 40) * (1 - p) + (vw * 0.72) * p;
      targetY = (vh * 0.28) + Math.sin(p * Math.PI) * 110;
      targetRot = 8 - Math.sin(p * Math.PI) * 12;
      targetScale = 1.08;

      if (bubbleText) bubbleText.textContent = "“Slow fire, liquid gold.”";
      if (bubble) bubble.style.opacity = p > 0.85 ? "0" : "1";
    }
    // Phase 2 (0.50 to 0.78): Floats over to Chapter 2 ("02 / Raw Solitaire Facet")
    else if (progress < 0.78) {
      const p = (progress - 0.50) / 0.28;
      targetX = (vw * 0.72) * (1 - p) + (vw * 0.22) * p;
      targetY = (vh * 0.32) + Math.sin(p * Math.PI) * 80;
      targetRot = -7 + (p * 12);
      targetScale = 1.12;

      if (bubbleText) bubbleText.textContent = "“The loupe reveals all inclusions.”";
      if (bubble) bubble.style.opacity = "1";
    }
    // Phase 3 (0.78 to 1.0): Floats directly into the Celestial Sanctuary with golden dust
    else {
      const p = (progress - 0.78) / 0.22;
      targetX = (vw * 0.22) * (1 - p) + (vw * 0.5 - 70) * p;
      targetY = (vh * 0.22) + Math.sin(p * Math.PI) * 40;
      targetRot = Math.sin(Date.now() * 0.003) * 3;
      targetScale = 1.15;

      if (bubbleText) bubbleText.textContent = "“✦ Cast in starlight & time ✦”";
      if (bubble) bubble.style.opacity = "1";
    }
  }

  function renderArtisanMotion() {
    calculateArtisanJourney();

    currentX += ((targetX + mouseParallaxX) - currentX) * 0.09;
    currentY += ((targetY + mouseParallaxY) - currentY) * 0.09;
    currentRot += (targetRot - currentRot) * 0.09;
    currentScale += (targetScale - currentScale) * 0.09;

    if (artisan) {
      artisan.style.transform = `
        translate3d(${currentX}px, ${currentY}px, 0px)
        rotate(${currentRot}deg)
        scale(${currentScale})
      `;
    }

    requestAnimationFrame(renderArtisanMotion);
  }
  requestAnimationFrame(renderArtisanMotion);

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    mouseParallaxX = nx * 20;
    mouseParallaxY = ny * 15;
  });

  const revealCards = document.querySelectorAll('[data-scroll-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });
  revealCards.forEach(c => revealObserver.observe(c));

  /* ==========================================================================
     2. DYNAMIC AMBIENT GOLD DUST & FINAL SECTION STARBURST PARTICLES
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
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseSize = Math.random() * 2 + 0.6;
      this.speedY = Math.random() * 0.28 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.color = Math.random() > 0.3 ? 'rgba(197, 160, 89,' : 'rgba(235, 205, 120,';
      this.isSpark = Math.random() > 0.6;
    }
    update(isSanctuary) {
      if (isSanctuary) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.5;
        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const angle = Math.atan2(dy, dx) + 0.015;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        this.x = centerX + Math.cos(angle) * (dist * 0.998);
        this.y = centerY + Math.sin(angle) * (dist * 0.998) - 0.2;
        this.opacity = Math.min(0.9, this.opacity + 0.01);
      } else {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.004;
      }

      if (this.y < -15 || this.x < -15 || this.x > canvas.width + 15 || this.y > canvas.height + 15) {
        this.reset();
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw(isSanctuary) {
      ctx.beginPath();
      const currentSize = isSanctuary ? this.baseSize * 1.5 : this.baseSize;
      
      if (this.isSpark && isSanctuary) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = `rgba(255, 240, 190, ${Math.min(1, this.opacity * 1.4)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(226, 186, 100, 0.8)';
        ctx.beginPath();
        ctx.moveTo(0, -currentSize * 2.2);
        ctx.quadraticCurveTo(0, 0, currentSize * 2.2, 0);
        ctx.quadraticCurveTo(0, 0, 0, currentSize * 2.2);
        ctx.quadraticCurveTo(0, 0, -currentSize * 2.2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -currentSize * 2.2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${Math.max(0.05, Math.min(0.85, this.opacity))})`;
        ctx.shadowBlur = isSanctuary ? 8 : 4;
        ctx.shadowColor = 'rgba(215, 180, 100, 0.6)';
        ctx.fill();
      }
    }
  }

  const particleCount = window.innerWidth < 768 ? 24 : 52;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isSanctuary = (window.scrollProgress || 0) > 0.82;
    particles.forEach(p => {
      p.update(isSanctuary);
      p.draw(isSanctuary);
    });
    requestAnimationFrame(renderParticles);
  }
  requestAnimationFrame(renderParticles);

  /* ==========================================================================
     3. DRAGGABLE POLAROIDS WITH NATURAL TACTILE INERTIA
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
      playChime(640, 0.06, 0.12);
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
      playChime(480, 0.05, 0.1);
    };

    item.addEventListener('pointerup', stopDrag);
    item.addEventListener('pointercancel', stopDrag);
  });

  /* ==========================================================================
     4. 3D PERSPECTIVE PARALLAX TILT ON CARDS
     ========================================================================== */
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -7;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 7;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     5. CUSTOM LOUPE CURSOR
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

  const hoverTargets = document.querySelectorAll('a, button, [data-drag], .spec-card-polaroid, .sparkle-pedestal, .sound-toggle-pill, .hallmark-stamp');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ==========================================================================
     6. RICH PROCEDURAL ATELIER AUDIO (Meditative Music & Chimes)
     Reliable cross-browser Web Audio synthesis (No broken files, audible warmth)
     ========================================================================== */
  const soundToggle = document.getElementById('soundToggle');
  let audioCtx = null;
  let soundActive = false;
  let musicInterval = null;
  let droneNodes = [];

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Pure bell / singing glass chime
  function playChime(freq, duration = 0.8, volume = 0.15) {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      // Warm harmonically rich bell sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  // Warm meditative singing chord drone (D - F# - A - C#)
  function startAtelierMelody() {
    if (!audioCtx) return;
    stopAtelierMelody();

    const rootFreqs = [146.83, 220.0, 277.18]; // Warm D chord

    rootFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Subtle detune for natural analog warmth
      osc.detune.setValueAtTime((idx - 1) * 4, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 1.5);

      if (panner) {
        panner.pan.value = (idx - 1) * 0.4;
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(audioCtx.destination);
      } else {
        osc.connect(gain);
        gain.connect(audioCtx.destination);
      }

      osc.start();
      droneNodes.push({ osc, gain });
    });

    // Slow ambient wind/flame crackle
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.2, audioCtx.currentTime);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.015, audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noiseSource.start();
    droneNodes.push({ osc: noiseSource, gain: noiseGain });

    // Periodic gentle acoustic chime sequence (every 4.5 seconds)
    const melodyScale = [440, 554.37, 659.25, 880, 1108.73];
    let noteIdx = 0;

    musicInterval = setInterval(() => {
      if (!soundActive || !audioCtx) return;
      const note = melodyScale[noteIdx % melodyScale.length];
      playChime(note, 1.4, 0.08);
      noteIdx++;
    }, 4200);
  }

  function stopAtelierMelody() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
    droneNodes.forEach(node => {
      try {
        node.gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
        setTimeout(() => {
          try { node.osc.stop(); } catch (_) {}
        }, 700);
      } catch (_) {}
    });
    droneNodes = [];
  }

  soundToggle.addEventListener('click', () => {
    initAudio();
    soundActive = !soundActive;

    if (soundActive) {
      soundToggle.classList.add('playing');
      startAtelierMelody();
      // Welcome chime
      playChime(880, 1.2, 0.15);
    } else {
      soundToggle.classList.remove('playing');
      stopAtelierMelody();
    }
  });

  /* ==========================================================================
     7. UNIQUE ARTISANAL FOOTER INTERACTIONS
     ========================================================================== */
  // Hallmarks interactive stamps
  document.querySelectorAll('.hallmark-stamp').forEach(stamp => {
    stamp.addEventListener('click', () => {
      initAudio();
      const freq = parseFloat(stamp.dataset.sound || 587);
      playChime(freq, 1.0, 0.18);
    });
  });

  // Return to origin button
  const btnReturnTop = document.getElementById('btnReturnTop');
  if (btnReturnTop) {
    btnReturnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initAudio();
      playChime(587.33, 1.2, 0.12);
    });
  }

  // Live Atelier Time Indicator
  function updateKilnTime() {
    const timeEl = document.getElementById('studioLocalTime');
    if (!timeEl) return;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      timeEl.textContent = `${timeStr} IST • Kiln Active`;
    } catch (_) {}
  }
  setInterval(updateKilnTime, 1000);
  updateKilnTime();

  // Brand logo top click
  const brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initAudio();
      playChime(587.33, 0.9, 0.15);
    });
  }

});
