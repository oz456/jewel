/**
 * JEWEL — Raw Beauty & Honest Craft
 * Native Vanilla ES6+ Interactive Engine
 * Zero external frameworks. Pure native web capability.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STATE MANAGEMENT (Bag & Stacker)
     ========================================================================== */
  const state = {
    bag: [],
    stackedRings: [],
    soundActive: false,
    audioCtx: null,
    ambientGain: null
  };

  const productDatabase = {
    1: { id: 1, name: 'Minimal Solitaire Gold Ring', price: 480, img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80', metal: '18k Recycled Gold', desc: 'Single unrefined rough diamond set in organic 4-prong setting.' },
    2: { id: 2, name: 'Eternity Twin Ring Set', price: 620, img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80', metal: '18k Fairmined Gold', desc: 'Twin interlocking bands with subtle hammered facet transitions.' },
    3: { id: 3, name: 'Quadruple Hammered Gold Stack', price: 890, img: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80', metal: '18k Solid Yellow Gold', desc: 'Four harmonized modular bands designed for infinite stacking combinations.' },
    101: { id: 101, name: 'Chiseled Monolith Band', price: 540, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80', metal: '18k Yellow Gold', desc: 'Individually chiseled ring body that catches candlelight from every angle.' },
    102: { id: 102, name: 'Raw Solitaire Talisman', price: 780, img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=80', metal: '18k Fairmined Gold', desc: 'Uncut salt-and-pepper diamond with natural celestial inclusions.' },
    103: { id: 103, name: 'Molten Meteor Pendant', price: 490, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80', metal: '14k Lost-Wax Gold', desc: 'Suspended talisman crafted to resemble an asteroid cooled in atmosphere.' },
    104: { id: 104, name: 'Biomorphic Fluid Huggies', price: 380, img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80', metal: '18k Vermeil', desc: 'Sculptural asymmetric ear hugs that wrap organically around the lobe.' },
    'r1': { id: 'r1', name: 'Hammered Solis Band', price: 340, img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=300&q=80' },
    'r2': { id: 'r2', name: 'Raw Diamond Chisel', price: 580, img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=300&q=80' },
    'r3': { id: 'r3', name: 'Eternity Wave Band', price: 420, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80' },
    'r4': { id: 'r4', name: 'Obsidian Signet', price: 710, img: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=300&q=80' }
  };

  /* ==========================================================================
     2. DRAGGABLE POLAROIDS WITH TACTILE SPRING INERTIA
     ========================================================================== */
  const polaroids = document.querySelectorAll('[data-drag]');
  let highestZ = 30;

  polaroids.forEach((item) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    const baseAngle = parseFloat(item.dataset.angle || 0);

    item.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking the quick add button
      if (e.target.classList.contains('quick-add-btn')) return;

      isDragging = true;
      highestZ += 1;
      item.style.zIndex = highestZ;

      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      item.setPointerCapture(e.pointerId);

      item.style.transition = 'box-shadow 0.2s ease';
      playChime(660, 0.04); // subtle tactile audio feedback
    });

    item.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      currentX = e.clientX - startX;
      currentY = e.clientY - startY;

      // Dynamic tilt based on horizontal velocity
      const velocityTilt = Math.max(-12, Math.min(12, e.movementX * 1.5));
      item.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${baseAngle + velocityTilt}deg) scale(1.05)`;
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { item.releasePointerCapture(e.pointerId); } catch (_) {}

      // Settle smoothly
      item.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      item.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${baseAngle}deg) scale(1)`;
      playChime(440, 0.03);
    };

    item.addEventListener('pointerup', stopDrag);
    item.addEventListener('pointercancel', stopDrag);
  });

  /* ==========================================================================
     3. 3D PARALLAX PERSPECTIVE TILT
     ========================================================================== */
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     4. CUSTOM LOUPE / JEWEL CURSOR
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

  // Smooth lerp for the ring cursor
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    if (cursor) {
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover states for interactive elements
  const interactiveTargets = document.querySelectorAll('a, button, [data-drag], .tray-ring, .product-card, .sound-toggle-pill');
  interactiveTargets.forEach(target => {
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
      this.size = Math.random() * 2 + 0.6;
      this.speedY = Math.random() * 0.35 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.color = Math.random() > 0.3 ? 'rgba(197, 160, 89,' : 'rgba(230, 200, 117,';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.005;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${Math.max(0.05, Math.min(0.65, this.opacity))})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(215, 180, 100, 0.4)';
      ctx.fill();
    }
  }

  const particleCount = window.innerWidth < 768 ? 20 : 45;
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
     6. INTERACTIVE RING STACKER STUDIO
     ========================================================================== */
  const ringStackContainer = document.getElementById('ringStackContainer');
  const emptyStackMsg = document.getElementById('emptyStackMsg');
  const stackTotalEl = document.getElementById('stackTotal');
  const stackCountEl = document.getElementById('stackCount');
  const clearStackBtn = document.getElementById('clearStackBtn');
  const addEntireStackBtn = document.getElementById('addEntireStackBtn');

  // Add ring to stack
  document.querySelectorAll('.tray-ring').forEach(ringEl => {
    ringEl.addEventListener('click', () => {
      const ringId = ringEl.dataset.ringId;
      const ringName = ringEl.dataset.ringName;
      const ringPrice = parseInt(ringEl.dataset.ringPrice, 10);
      const ringImg = ringEl.dataset.img;

      if (state.stackedRings.length >= 5) {
        alert('You have reached the maximum harmonious stack for a single finger (5 pieces).');
        return;
      }

      state.stackedRings.push({ id: ringId, name: ringName, price: ringPrice, img: ringImg });
      updateStackUI();
      playChime(520 + state.stackedRings.length * 80, 0.08);
    });
  });

  function updateStackUI() {
    ringStackContainer.innerHTML = '';
    
    if (state.stackedRings.length === 0) {
      if (emptyStackMsg) ringStackContainer.appendChild(emptyStackMsg);
    } else {
      state.stackedRings.forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'stacked-ring-item';
        ringDiv.title = `${ring.name} — Click to unstack`;
        ringDiv.style.backgroundImage = `url('${ring.img}')`;
        ringDiv.style.zIndex = index + 1;
        
        // Click to remove individual ring from stack
        ringDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          state.stackedRings.splice(index, 1);
          updateStackUI();
          playChime(380, 0.05);
        });

        ringStackContainer.appendChild(ringDiv);
      });
    }

    const total = state.stackedRings.reduce((sum, r) => sum + r.price, 0);
    stackTotalEl.textContent = `$${total.toLocaleString()}`;
    stackCountEl.textContent = state.stackedRings.length;
  }

  clearStackBtn.addEventListener('click', () => {
    state.stackedRings = [];
    updateStackUI();
  });

  addEntireStackBtn.addEventListener('click', () => {
    if (state.stackedRings.length === 0) {
      alert('Select at least one ring from the tray to stack.');
      return;
    }
    state.stackedRings.forEach(ring => {
      addToBag(ring.name, ring.price, ring.img);
    });
    openBagDrawer();
  });

  /* ==========================================================================
     7. SHOPPING BAG & DRAWER SYSTEM
     ========================================================================== */
  const bagBtn = document.getElementById('bagBtn');
  const bagOverlay = document.getElementById('bagOverlay');
  const bagDrawer = document.getElementById('bagDrawer');
  const bagCloseBtn = document.getElementById('bagCloseBtn');
  const bagCountEl = document.getElementById('bagCount');
  const bagDrawerCount = document.getElementById('bagDrawerCount');
  const bagItemsContainer = document.getElementById('bagItemsContainer');
  const bagSubtotalEl = document.getElementById('bagSubtotal');

  function openBagDrawer() {
    bagOverlay.classList.add('active');
    bagDrawer.classList.add('active');
  }

  function closeBagDrawer() {
    bagOverlay.classList.remove('active');
    bagDrawer.classList.remove('active');
  }

  bagBtn.addEventListener('click', openBagDrawer);
  bagCloseBtn.addEventListener('click', closeBagDrawer);
  bagOverlay.addEventListener('click', closeBagDrawer);

  function addToBag(name, price, img) {
    state.bag.push({ id: Date.now() + Math.random(), name, price, img });
    renderBag();
    playChime(880, 0.1);
  }

  function removeFromBag(itemId) {
    state.bag = state.bag.filter(item => item.id !== itemId);
    renderBag();
  }

  function renderBag() {
    bagCountEl.textContent = state.bag.length;
    bagDrawerCount.textContent = `${state.bag.length} piece${state.bag.length === 1 ? '' : 's'}`;

    if (state.bag.length === 0) {
      bagItemsContainer.innerHTML = `
        <div class="bag-empty-state">
          <span class="empty-icon">✧</span>
          <p>Your jewelry tray is empty.</p>
          <span class="empty-sub">Explore the archive or stack your rings above.</span>
        </div>
      `;
      bagSubtotalEl.textContent = '$0';
      return;
    }

    bagItemsContainer.innerHTML = '';
    let total = 0;

    state.bag.forEach(item => {
      total += item.price;
      const itemEl = document.createElement('div');
      itemEl.className = 'bag-item-card';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="bag-item-img" />
        <div class="bag-item-details">
          <span class="bag-item-name">${item.name}</span>
          <span class="bag-item-price">$${item.price.toLocaleString()}</span>
        </div>
        <button class="bag-item-remove" data-id="${item.id}">Remove</button>
      `;

      itemEl.querySelector('.bag-item-remove').addEventListener('click', () => {
        removeFromBag(item.id);
      });

      bagItemsContainer.appendChild(itemEl);
    });

    bagSubtotalEl.textContent = `$${total.toLocaleString()}`;
  }

  // Quick add from polaroids
  document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.dataset.product;
      const product = productDatabase[prodId];
      if (product) {
        addToBag(product.name, product.price, product.img);
        openBagDrawer();
      }
    });
  });

  // Add from product card buttons
  document.querySelectorAll('.btn-card-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price, 10);
      const card = btn.closest('.product-card');
      const img = card.querySelector('.prod-img').src;
      addToBag(name, price, img);
      openBagDrawer();
    });
  });

  // Checkout button simulation
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (state.bag.length === 0) {
      alert('Your tray is empty.');
      return;
    }
    alert('Connecting securely to the Jewel Private Concierge...');
  });

  /* ==========================================================================
     8. PRODUCT QUICK INSPECT MODAL
     ========================================================================== */
  const inspectModal = document.getElementById('inspectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalMetal = document.getElementById('modalMetal');
  const modalAddBtn = document.getElementById('modalAddBtn');
  let currentModalProduct = null;

  document.querySelectorAll('.quick-view-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = productDatabase[id];
      if (!item) return;

      currentModalProduct = item;
      modalTitle.textContent = item.name;
      modalPrice.textContent = `$${item.price.toLocaleString()}`;
      modalDesc.textContent = item.desc;
      modalMetal.textContent = item.metal;
      modalImg.src = item.img;

      inspectModal.classList.add('active');
      playChime(740, 0.08);
    });
  });

  function closeModal() {
    inspectModal.classList.remove('active');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  inspectModal.addEventListener('click', (e) => {
    if (e.target === inspectModal) closeModal();
  });

  modalAddBtn.addEventListener('click', () => {
    if (currentModalProduct) {
      addToBag(currentModalProduct.name, currentModalProduct.price, currentModalProduct.img);
      closeModal();
      openBagDrawer();
    }
  });

  /* ==========================================================================
     9. FILTERABLE COLLECTION PILLS
     ========================================================================== */
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     10. ATELIER AMBIENCE (Pure Web Audio API Synthesizer)
     Zero external audio assets. Generates warm wind, crackle & glass chimes.
     ========================================================================== */
  const soundToggle = document.getElementById('soundToggle');

  function initAudio() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playChime(freq, duration = 0.08) {
    if (!state.audioCtx) return;
    try {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (_) {}
  }

  soundToggle.addEventListener('click', () => {
    initAudio();
    state.soundActive = !state.soundActive;

    if (state.soundActive) {
      soundToggle.classList.add('playing');
      startAtmosphere();
      playChime(523.25, 0.3); // High harmonic C5 chime
    } else {
      soundToggle.classList.remove('playing');
      stopAtmosphere();
    }
  });

  let noiseNode = null;

  function startAtmosphere() {
    if (!state.audioCtx) return;

    // Gentle filtered white-noise stream simulating warm studio air & distant forge
    const bufferSize = state.audioCtx.sampleRate * 2;
    const noiseBuffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noiseNode = state.audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, state.audioCtx.currentTime);

    state.ambientGain = state.audioCtx.createGain();
    state.ambientGain.gain.setValueAtTime(0.015, state.audioCtx.currentTime);

    noiseNode.connect(filter);
    filter.connect(state.ambientGain);
    state.ambientGain.connect(state.audioCtx.destination);

    noiseNode.start();
  }

  function stopAtmosphere() {
    if (noiseNode) {
      try { noiseNode.stop(); } catch (_) {}
      noiseNode = null;
    }
  }

  // Interactive Brand Logo flourish
  const brandLogo = document.getElementById('brandLogo');
  brandLogo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playChime(587.33, 0.2); // D5 chime
  });

});
