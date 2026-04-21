/* ═══════════════════════════════════════════════════════════
   Simply Green and Garden Spray — Main Script
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── DATA ──────────────────────────────────────────────────
   customerReviews and ownerPosts are the source of truth.
   Add real reviews here and they'll render automatically.
   ─────────────────────────────────────────────────────────── */
const customerReviews = [
  {
    stars: 5,
    name:  'Jason M.',
    text:  'Absolutely thrilled with the results! My lawn has never looked better going into summer. The team is professional, punctual, and clearly knows their stuff.',
    photos: true
  },
  {
    stars: 5,
    name:  'Linda T.',
    text:  'Switched from another company and couldn\'t be happier. The Program 2 package covers everything I need. My neighbours keep asking what I\'m doing differently!',
    photos: false
  },
  {
    stars: 5,
    name:  'Marcus B.',
    text:  'The aeration service made a huge difference. Fertilizer is really getting in now. Highly recommend combining it with any program.',
    photos: true
  },
  {
    stars: 4,
    name:  'Valued Customer',
    text:  'Really happy with the treatment. Noticed a big improvement in the colour and density of the grass. Would love a bit more communication between visits but overall great service.',
    photos: false
  },
  {
    stars: 5,
    name:  'Priya S.',
    text:  'Program 3 was absolutely worth it. The crabgrass is completely under control and the priority visits give real peace of mind.',
    photos: false
  }
];

const ownerPosts = [
  {
    text:   'We\'re heading into peak season — all spring fertilizer applications are being scheduled now. Reach out early to lock in your spot before we fill up!',
    photos: true
  },
  {
    text:   'Eco Clear is now available as a standalone service for driveway edges and sidewalks. Give us a call to add it to your next visit.',
    photos: false
  }
];

/* Gallery placeholder images — swap src values for real photos */
const galleryImages = [
  { src: null, emoji: '🌿' },
  { src: null, emoji: '🌱' },
  { src: null, emoji: '🍃' }
];


/* ═══════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════ */

/** Build gold-star HTML for a numeric rating */
function starsHTML(rating, size) {
  size = size || 16;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    html += `<span style="color:${filled ? '#f5c518' : '#ddd'};font-size:${size}px;line-height:1">&#9733;</span>`;
  }
  return html;
}

/** Average star rating across all customer reviews */
function calcAvgRating() {
  if (!customerReviews.length) return 0;
  const sum = customerReviews.reduce(function (acc, r) { return acc + r.stars; }, 0);
  return sum / customerReviews.length;
}

/** Update hero star display */
function updateHeroStars() {
  const avg     = calcAvgRating();
  const rounded = Math.round(avg * 10) / 10;
  document.getElementById('hero-stars').innerHTML        = starsHTML(avg, 22);
  document.getElementById('hero-rating-num').textContent = rounded.toFixed(1);
  document.getElementById('hero-review-count').textContent =
    '(' + customerReviews.length + ' review' + (customerReviews.length !== 1 ? 's' : '') + ')';
}


/* ═══════════════════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
   ═══════════════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', function () {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.menu-link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = link.getAttribute('href');
    // Close menu first, then scroll
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    setTimeout(function () {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  });
});


/* ═══════════════════════════════════════════════════════════
   PROGRAMS CAROUSEL DOTS
   ═══════════════════════════════════════════════════════════ */
const progTrack = document.getElementById('programs-track');
const progDots  = document.querySelectorAll('#programs-dots .dot');

progTrack.addEventListener('scroll', function () {
  const cards     = progTrack.querySelectorAll('.program-card');
  const cardWidth = cards[0].offsetWidth + 12; /* gap = 12px */
  const idx       = Math.round(progTrack.scrollLeft / cardWidth);
  progDots.forEach(function (d, i) {
    d.classList.toggle('active', i === idx);
  });
});

progDots.forEach(function (dot) {
  dot.addEventListener('click', function () {
    const i         = parseInt(dot.getAttribute('data-i'), 10);
    const cards     = progTrack.querySelectorAll('.program-card');
    const cardWidth = cards[0].offsetWidth + 12;
    progTrack.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
  });
});


/* ═══════════════════════════════════════════════════════════
   REVIEW CAROUSEL — build cards + counter
   ═══════════════════════════════════════════════════════════ */

function buildCustomerCards() {
  const track = document.getElementById('customer-track');
  track.innerHTML = '';

  customerReviews.forEach(function (rv) {
    const initials = rv.name.split(' ')
      .map(function (w) { return w[0] || ''; })
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML =
      '<div class="rv-stars">' + starsHTML(rv.stars, 17) + '</div>' +
      '<div class="rv-header">' +
        '<div class="rv-avatar">' + initials + '</div>' +
        '<div class="rv-name">'   + escapeHTML(rv.name) + '</div>' +
      '</div>' +
      '<div class="rv-text">' + escapeHTML(rv.text) + '</div>' +
      (rv.photos
        ? '<a class="rv-photos-link open-gallery" role="button" tabindex="0">View photos &rarr;</a>'
        : '<div class="rv-no-photos">No photos attached</div>');

    track.appendChild(card);
  });

  track.querySelectorAll('.open-gallery').forEach(function (link) {
    link.addEventListener('click', openGallery);
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') openGallery();
    });
  });

  attachScrollCounter(track, 'customer-counter', 14);
}

function buildOwnerCards() {
  const track = document.getElementById('owner-track');
  track.innerHTML = '';

  ownerPosts.forEach(function (post) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML =
      '<div class="rv-header">' +
        '<div class="rv-avatar owner-av">SG</div>' +
        '<div>' +
          '<div class="rv-name">Simply Green</div>' +
          '<div class="rv-label">Owner</div>' +
        '</div>' +
      '</div>' +
      '<div class="rv-text">' + escapeHTML(post.text) + '</div>' +
      (post.photos
        ? '<a class="rv-photos-link open-gallery" role="button" tabindex="0">View photos &rarr;</a>'
        : '<div class="rv-no-photos">No photos attached</div>');

    track.appendChild(card);
  });

  track.querySelectorAll('.open-gallery').forEach(function (link) {
    link.addEventListener('click', openGallery);
  });

  attachScrollCounter(track, 'owner-counter', 14);
}

/** Attach a scroll-based n/total counter to a review track */
function attachScrollCounter(track, counterId, gap) {
  const counter = document.getElementById(counterId);
  const cards   = track.querySelectorAll('.review-card');
  const total   = cards.length;

  if (total <= 1) { counter.textContent = ''; return; }

  let current = 0;
  counter.textContent = '1 / ' + total;

  track.addEventListener('scroll', function () {
    if (!cards[0]) return;
    const cardWidth = cards[0].offsetWidth + gap;
    const idx = Math.round(track.scrollLeft / cardWidth);
    if (idx !== current) {
      current = idx;
      counter.textContent = (idx + 1) + ' / ' + total;
    }
  });
}

/** Basic HTML entity escaping to prevent XSS in user-submitted content */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ═══════════════════════════════════════════════════════════
   TABS (Customers / Owner)
   ═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const tab = btn.getAttribute('data-tab');

    const custPanel  = document.getElementById('tab-customers');
    const ownerPanel = document.getElementById('tab-owner');

    if (tab === 'customers') {
      custPanel.removeAttribute('hidden');
      ownerPanel.setAttribute('hidden', '');
      document.getElementById('customer-track').scrollTo({ left: 0, behavior: 'instant' });
    } else {
      ownerPanel.removeAttribute('hidden');
      custPanel.setAttribute('hidden', '');
      document.getElementById('owner-track').scrollTo({ left: 0, behavior: 'instant' });
    }
  });
});


/* ═══════════════════════════════════════════════════════════
   REVIEW MODAL
   ═══════════════════════════════════════════════════════════ */
const reviewModal = document.getElementById('review-modal');
let selectedStars = 0;

function openReviewModal() {
  reviewModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
  reviewModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('open-review-modal').addEventListener('click',   openReviewModal);
document.getElementById('close-review-modal').addEventListener('click',  closeReviewModal);

/* Click outside modal box to close */
reviewModal.addEventListener('click', function (e) {
  if (e.target === reviewModal) closeReviewModal();
});

/* Keyboard: open with Enter/Space on the "Leave a review" link */
document.getElementById('open-review-modal').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') openReviewModal();
});

/* ── Star picker ── */
const spStars = document.querySelectorAll('.sp-star');

spStars.forEach(function (star) {
  star.addEventListener('mouseover', function () {
    const v = parseInt(star.getAttribute('data-v'), 10);
    spStars.forEach(function (s) {
      s.classList.toggle('selected', parseInt(s.getAttribute('data-v'), 10) <= v);
    });
  });

  star.addEventListener('mouseleave', function () {
    spStars.forEach(function (s) {
      s.classList.toggle('selected', parseInt(s.getAttribute('data-v'), 10) <= selectedStars);
    });
  });

  star.addEventListener('click', function () {
    selectedStars = parseInt(star.getAttribute('data-v'), 10);
    spStars.forEach(function (s) {
      s.classList.toggle('selected', parseInt(s.getAttribute('data-v'), 10) <= selectedStars);
    });
  });
});

/* ── Submit ── */
document.getElementById('submit-review').addEventListener('click', function () {
  /* Reset errors */
  document.querySelectorAll('.form-error').forEach(function (e) {
    e.style.display = 'none';
  });

  let valid = true;

  if (!selectedStars) {
    document.getElementById('err-stars').style.display = 'block';
    valid = false;
  }

  const nameVal = document.getElementById('rv-name').value.trim();
  if (!nameVal) {
    document.getElementById('err-name').style.display = 'block';
    valid = false;
  }

  const textVal = document.getElementById('rv-text').value.trim();
  if (!textVal) {
    document.getElementById('err-text').style.display = 'block';
    valid = false;
  }

  if (!valid) return;

  /* Add review to in-memory data and rebuild UI */
  customerReviews.push({ stars: selectedStars, name: nameVal, text: textVal, photos: false });
  buildCustomerCards();
  updateHeroStars();

  /* Show success message */
  document.getElementById('review-form-content').style.display = 'none';
  document.getElementById('review-success').style.display      = 'block';

  /* Reset form and close after short delay */
  setTimeout(function () {
    document.getElementById('rv-name').value  = '';
    document.getElementById('rv-text').value  = '';
    selectedStars = 0;
    spStars.forEach(function (s) { s.classList.remove('selected'); });
    document.getElementById('review-form-content').style.display = 'block';
    document.getElementById('review-success').style.display      = 'none';
    closeReviewModal();
  }, 2400);
});


/* ═══════════════════════════════════════════════════════════
   GALLERY MODAL
   ═══════════════════════════════════════════════════════════ */
const galleryModal = document.getElementById('gallery-modal');
let galleryIdx = 0;

function openGallery() {
  galleryIdx = 0;
  renderGallery();
  galleryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  galleryModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('close-gallery-modal').addEventListener('click', closeGallery);

galleryModal.addEventListener('click', function (e) {
  if (e.target === galleryModal) closeGallery();
});

function renderGallery() {
  const total  = galleryImages.length;
  const img    = galleryImages[galleryIdx];

  document.getElementById('gallery-counter').textContent = (galleryIdx + 1) + ' / ' + total;

  /* Swap between real img tag and placeholder emoji */
  const wrap = document.querySelector('.gallery-img-wrap');
  wrap.innerHTML = img.src
    ? '<img src="' + img.src + '" alt="Gallery photo ' + (galleryIdx + 1) + '">'
    : '<div class="gallery-placeholder">' + img.emoji + '</div>';

  /* Rebuild dots */
  const dotsRow = document.getElementById('gallery-dots-row');
  dotsRow.innerHTML = '';
  galleryImages.forEach(function (_, i) {
    const d = document.createElement('div');
    d.className = 'gallery-dot' + (i === galleryIdx ? ' active' : '');
    dotsRow.appendChild(d);
  });
}

document.getElementById('gallery-prev').addEventListener('click', function () {
  galleryIdx = (galleryIdx - 1 + galleryImages.length) % galleryImages.length;
  renderGallery();
});

document.getElementById('gallery-next').addEventListener('click', function () {
  galleryIdx = (galleryIdx + 1) % galleryImages.length;
  renderGallery();
});

/* Keyboard arrow navigation in gallery */
document.addEventListener('keydown', function (e) {
  if (!galleryModal.classList.contains('open')) return;
  if (e.key === 'ArrowRight') {
    galleryIdx = (galleryIdx + 1) % galleryImages.length;
    renderGallery();
  } else if (e.key === 'ArrowLeft') {
    galleryIdx = (galleryIdx - 1 + galleryImages.length) % galleryImages.length;
    renderGallery();
  } else if (e.key === 'Escape') {
    closeGallery();
  }
});

/* Escape closes review modal too */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && reviewModal.classList.contains('open')) {
    closeReviewModal();
  }
});


/* ═══════════════════════════════════════════════════════════
   INIT — run on DOM ready
   ═══════════════════════════════════════════════════════════ */
updateHeroStars();
buildCustomerCards();
buildOwnerCards();
