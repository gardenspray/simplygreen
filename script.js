const body = document.body;

const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");
const overlayLinks = document.querySelectorAll(".overlay-link");

const reviewModal = document.getElementById("reviewModal");
const openReviewModalTop = document.getElementById("openReviewModalTop");
const openReviewModalReviews = document.getElementById("openReviewModalReviews");
const reviewForm = document.getElementById("reviewForm");
const submitReviewBtn = document.getElementById("submitReviewBtn");
const starButtons = document.querySelectorAll(".star-btn");
const reviewEmail = document.getElementById("reviewEmail");
const reviewText = document.getElementById("reviewText");
const customerTrack = document.getElementById("customerTrack");
const customerDots = document.getElementById("customerDots");

const galleryModal = document.getElementById("galleryModal");
const galleryImage = document.getElementById("galleryImage");
const galleryCounter = document.getElementById("galleryCounter");
const galleryDots = document.getElementById("galleryDots");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryTriggers = document.querySelectorAll(".gallery-trigger");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

let selectedRating = 0;
let currentGallery = [];
let currentGalleryIndex = 0;

function lockScroll() {
  body.classList.add("lock-scroll");
}

function unlockScroll() {
  if (!menuOverlay.hidden || !reviewModal.hidden || !galleryModal.hidden) {
    return;
  }
  body.classList.remove("lock-scroll");
}

function openMenu() {
  menuOverlay.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  lockScroll();
}

function closeMenu() {
  menuOverlay.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  unlockScroll();
}

menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);

menuOverlay?.addEventListener("click", (event) => {
  if (event.target === menuOverlay) {
    closeMenu();
  }
});

overlayLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

function openModal(modal) {
  modal.hidden = false;
  lockScroll();
}

function closeModal(modal) {
  modal.hidden = true;
  unlockScroll();
}

openReviewModalTop?.addEventListener("click", () => openModal(reviewModal));
openReviewModalReviews?.addEventListener("click", () => openModal(reviewModal));

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-close-modal");
    const modal = document.getElementById(modalId);
    closeModal(modal);
  });
});

[reviewModal, galleryModal].forEach((modal) => {
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

function updateSubmitState() {
  const valid = selectedRating > 0 && reviewEmail.value.trim() !== "" && reviewText.value.trim() !== "";
  submitReviewBtn.disabled = !valid;
}

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);

    starButtons.forEach((btn) => {
      const buttonRating = Number(btn.dataset.rating);
      btn.classList.toggle("active", buttonRating <= selectedRating);
    });

    updateSubmitState();
  });
});

reviewEmail?.addEventListener("input", updateSubmitState);
reviewText?.addEventListener("input", updateSubmitState);

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const starsFilled = "★ ".repeat(selectedRating).trim();
  const starsEmpty = "☆ ".repeat(5 - selectedRating).trim();
  const fullStars = `${starsFilled}${selectedRating < 5 ? ` ${starsEmpty}` : ""}`.trim();

  const article = document.createElement("article");
  article.className = "review-card carousel-slide";
  article.innerHTML = `
    <div class="review-stars">${fullStars}</div>
    <div class="review-head">
      <div class="avatar avatar-light">👤</div>
      <h3>Valued Customer</h3>
    </div>
    <p>${reviewText.value.trim()}</p>
    <p class="muted">Submitted review</p>
  `;

  customerTrack.appendChild(article);

  const newDot = document.createElement("button");
  newDot.className = "dot";
  newDot.setAttribute("data-index", String(customerTrack.children.length - 1));
  customerDots.appendChild(newDot);

  attachDotHandlers(customerTrack.closest(".tab-panel").querySelector(".carousel"), customerDots);

  reviewForm.reset();
  selectedRating = 0;
  starButtons.forEach((btn) => btn.classList.remove("active"));
  submitReviewBtn.disabled = true;
  closeModal(reviewModal);

  document.querySelector('[data-tab="customersPanel"]').click();
  document.getElementById("reviews").scrollIntoView({ behavior: "smooth" });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

function activateDots(container, dotsContainer) {
  const slides = container.querySelectorAll(".carousel-slide");
  const dots = dotsContainer.querySelectorAll(".dot");

  if (!slides.length || !dots.length) {
    return;
  }

  const slideWidth = container.clientWidth;
  const index = Math.round(container.scrollLeft / slideWidth);

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function attachDotHandlers(carousel, dotsContainer) {
  const dots = dotsContainer.querySelectorAll(".dot");

  dots.forEach((dot) => {
    dot.onclick = () => {
      const index = Number(dot.dataset.index);
      carousel.scrollTo({
        left: carousel.clientWidth * index,
        behavior: "smooth"
      });
    };
  });
}

function setupCarousel(carouselId, dotsId) {
  const carousel = document.getElementById(carouselId);
  const dotsContainer = document.getElementById(dotsId);

  if (!carousel || !dotsContainer) {
    return;
  }

  attachDotHandlers(carousel, dotsContainer);

  carousel.addEventListener("scroll", () => {
    activateDots(carousel, dotsContainer);
  });

  window.addEventListener("resize", () => {
    activateDots(carousel, dotsContainer);
  });
}

setupCarousel("programCarousel", "programDots");
setupCarousel("customerCarousel", "customerDots");
setupCarousel("ownerCarousel", "ownerDots");

function renderGallery() {
  if (!currentGallery.length) {
    return;
  }

  galleryImage.src = currentGallery[currentGalleryIndex];
  galleryCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;

  galleryDots.innerHTML = "";

  currentGallery.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `gallery-dot ${index === currentGalleryIndex ? "active" : ""}`;
    dot.addEventListener("click", () => {
      currentGalleryIndex = index;
      renderGallery();
    });
    galleryDots.appendChild(dot);
  });
}

function openGallery(images) {
  currentGallery = images;
  currentGalleryIndex = 0;
  renderGallery();
  openModal(galleryModal);
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const images = JSON.parse(trigger.dataset.gallery);
    openGallery(images);
  });
});

galleryPrev?.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
  renderGallery();
});

galleryNext?.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
  renderGallery();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeModal(reviewModal);
    closeModal(galleryModal);
  }

  if (!galleryModal.hidden) {
    if (event.key === "ArrowLeft") {
      currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
      renderGallery();
    }

    if (event.key === "ArrowRight") {
      currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
      renderGallery();
    }
  }
});