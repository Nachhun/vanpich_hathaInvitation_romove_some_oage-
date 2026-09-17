/**
 * Kristian & Hatha - Wedding Celebration
 * Interactive Motion & Experience Suite
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initCountdown();
  initPetalsEffect();
  initAccordions();
  initRsvpForm();
  initCalendarEvent();
  initAudioPlayer();
  initNavDrawer();
  initGalleryLightbox();
});

/* ==========================================================================
   1. SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '100px 0px 100px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // Safety fallback: reveal everything after 2 seconds in case of any observer glitch
  setTimeout(() => {
    reveals.forEach(el => el.classList.add('revealed'));
  }, 2000);
}

/* ==========================================================================
   2. REAL-TIME COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Target: Sunday, 22 November 2026, 10:30 AM (NZDT, UTC+13)
  const targetDate = new Date('2026-11-22T10:30:00+13:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function update() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. FLOATING ROSE PETALS GENERATOR
   ========================================================================== */
function initPetalsEffect() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const petalCount = 14;
  for (let i = 0; i < petalCount; i++) {
    createPetal(container, i * 800);
  }
}

function createPetal(container, initialDelay) {
  const petal = document.createElement('div');
  petal.className = 'floating-petal';

  const width = Math.floor(Math.random() * 12) + 12; // 12px - 24px
  const height = Math.floor(width * 1.35);
  const leftPos = Math.random() * 96; // 0% - 96%
  const duration = Math.random() * 8 + 12; // 12s - 20s
  const driftX = (Math.random() - 0.5) * 140; // drift direction
  const delay = initialDelay !== undefined ? initialDelay / 1000 : Math.random() * 6;

  petal.style.width = `${width}px`;
  petal.style.height = `${height}px`;
  petal.style.left = `${leftPos}%`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.setProperty('--drift-x', `${driftX}px`);

  container.appendChild(petal);
}

/* ==========================================================================
   4. INTERACTIVE FAQ ACCORDIONS
   ========================================================================== */
function initAccordions() {
  const cards = document.querySelectorAll('.faq-card');

  cards.forEach(card => {
    const trigger = card.querySelector('.faq-trigger');
    const drawer = card.querySelector('.faq-drawer');

    if (card.classList.contains('active') && drawer) {
      drawer.style.maxHeight = drawer.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      // Close all others
      cards.forEach(other => {
        other.classList.remove('active');
        const otherDrawer = other.querySelector('.faq-drawer');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherDrawer) otherDrawer.style.maxHeight = '0px';
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive && drawer) {
        card.classList.add('active');
        drawer.style.maxHeight = drawer.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE ONLINE RSVP FORM
   ========================================================================== */
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const successModal = document.getElementById('rsvp-success');
  const resetBtn = document.getElementById('btn-reset-rsvp');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestGroup = document.getElementById('guest-count-group');

  if (!form) return;

  // Toggle guest count dropdown if declined
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'declined') {
        if (guestGroup) guestGroup.style.opacity = '0.4';
      } else {
        if (guestGroup) guestGroup.style.opacity = '1';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const rsvpEntry = {
      name: formData.get('name'),
      attendance: formData.get('attendance'),
      guests: formData.get('guests') || '0',
      dietary: formData.get('dietary') || '',
      message: formData.get('message') || '',
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('kh_wedding_rsvps') || '[]');
      existing.push(rsvpEntry);
      localStorage.setItem('kh_wedding_rsvps', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Animate transition to success card
    form.style.display = 'none';
    if (successModal) {
      successModal.style.display = 'block';
      successModal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  if (resetBtn && form && successModal) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successModal.style.display = 'none';
    });
  }
}

/* ==========================================================================
   6. CALENDAR INTEGRATION (.ICS & GOOGLE CALENDAR)
   ========================================================================== */
function initCalendarEvent() {
  const btn = document.getElementById('btn-calendar');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const title = 'Kristian Joshua Emnas & Pich Hatha Van Wedding';
    const description = 
      'Wedding reception celebration of Kristian & Hatha.\n\n' +
      'Ceremony: 11:00 AM (Please arrive by 10:30 AM) at 3 Kowhai Drive, Darfield, Canterbury.\n' +
      'Reception: 5:30 PM at Jolly Seafood Restaurant, 187 Wigram Road, Wigram, Christchurch.\n\n' +
      'Dress code: Formal / Semi-Formal (Kindly avoid white and ivory).';
    const location = 'Christchurch & Darfield, Canterbury, New Zealand';

    // Dates in UTC: NZDT is UTC+13. 22 Nov 2026 5:30 PM = 22 Nov 2026 04:30 UTC
    const startUtc = '20261121T213000Z';
    const endUtc = '20261122T103000Z';

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startUtc}/${endUtc}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    // .ics file contents
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kristian and Hatha Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@kristianandhatha.wedding',
      'DTSTAMP:20260915T000000Z',
      'DTSTART:' + startUtc,
      'DTEND:' + endUtc,
      'SUMMARY:' + title,
      'DESCRIPTION:' + description.replace(/\n/g, '\\n'),
      'LOCATION:' + location,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Trigger download of .ics
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'Kristian_and_Hatha_Wedding_2026.ics';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    // Also open Google Calendar in new tab
    setTimeout(() => {
      window.open(gcalUrl, '_blank');
    }, 450);
  });
}

/* ==========================================================================
   7. ROMANTIC WEDDING AUDIO SYNTHESIZER & MUSIC PLAYER
   ========================================================================== */
function initAudioPlayer() {
  const musicBtn = document.getElementById('btn-music');
  if (!musicBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  // Chord progression: Canon in D romantic sequence (D - A - Bm - F#m - G - D - G - A)
  // Expressed in piano/strings frequencies (Hz)
  const melodyChords = [
    // D Major
    { bass: 146.83, chord: [293.66, 369.99, 440.00, 587.33] },
    // A Major
    { bass: 110.00, chord: [220.00, 277.18, 329.63, 440.00] },
    // B Minor
    { bass: 123.47, chord: [246.94, 293.66, 369.99, 493.88] },
    // F# Minor
    { bass: 92.50,  chord: [185.00, 220.00, 277.18, 369.99] },
    // G Major
    { bass: 98.00,  chord: [196.00, 246.94, 293.66, 392.00] },
    // D Major
    { bass: 146.83, chord: [293.66, 369.99, 440.00, 587.33] },
    // G Major
    { bass: 98.00,  chord: [196.00, 246.94, 293.66, 392.00] },
    // A Major 7
    { bass: 110.00, chord: [220.00, 277.18, 329.63, 440.00, 554.37] }
  ];

  let currentStep = 0;

  function playNote(freq, startTime, duration, gainValue = 0.08) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle'; // Warm, soft acoustic timbre
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);

    // Natural piano-like decay envelope
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function scheduleNextMeasure() {
    if (!isPlaying || !audioCtx) return;

    const chordObj = melodyChords[currentStep % melodyChords.length];
    const now = audioCtx.currentTime;

    // Deep warm bass
    playNote(chordObj.bass, now, 3.2, 0.12);

    // Romantic arpeggio sequence
    chordObj.chord.forEach((freq, i) => {
      playNote(freq, now + i * 0.45, 2.2, 0.06);
    });

    currentStep++;
    timerId = setTimeout(scheduleNextMeasure, 2400);
  }

  musicBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      isPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-label', 'Pause Romantic Music');
      scheduleNextMeasure();
    } else {
      isPlaying = false;
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-label', 'Play Romantic Music');
      if (timerId) clearTimeout(timerId);
    }
  });
}

/* ==========================================================================
   8. NAVIGATION DRAWER
   ========================================================================== */
function initNavDrawer() {
  const drawer = document.getElementById('nav-drawer');
  const openBtns = [
    document.getElementById('btn-toggle-menu'),
    document.getElementById('hero-menu-btn')
  ];
  const closeBtn = document.getElementById('nav-close');
  const backdrop = document.getElementById('nav-backdrop');
  const links = document.querySelectorAll('.nav-link');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openDrawer);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ==========================================================================
   9. PRE-WEDDING PHOTO GALLERY, TABS & STORY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  // Story Chapter Tabs Filtering
  const tabs = document.querySelectorAll('.story-tab');
  const chapters = document.querySelectorAll('.story-chapter-block');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      chapters.forEach(chapter => {
        if (filter === 'all' || chapter.getAttribute('data-chapter') === filter) {
          chapter.classList.remove('hidden-chapter');
        } else {
          chapter.classList.add('hidden-chapter');
        }
      });
    });
  });

  // Story Lightbox Modal
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalChapter = document.getElementById('lightbox-chapter');
  const modalTitle = document.getElementById('lightbox-title');
  const modalLocation = document.getElementById('lightbox-location');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const backdrop = document.getElementById('lightbox-backdrop');

  if (!modal || !items.length) return;

  let currentIndex = 0;

  function updateLightboxContent(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;

    const currentItem = items[currentIndex];
    const fullSrc = currentItem.getAttribute('data-full');
    const chapter = currentItem.getAttribute('data-chapter') || '';
    const title = currentItem.getAttribute('data-title') || '';
    const location = currentItem.getAttribute('data-location') || '';
    const desc = currentItem.getAttribute('data-desc') || '';

    if (modalImg) modalImg.src = fullSrc;
    if (modalChapter) modalChapter.textContent = chapter;
    if (modalTitle) modalTitle.textContent = title;
    if (modalLocation) modalLocation.textContent = location;
    if (modalDesc) modalDesc.textContent = desc;
  }

  function openModal(index) {
    updateLightboxContent(index);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => openModal(idx));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex + 1);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') updateLightboxContent(currentIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentIndex + 1);
  });
}

