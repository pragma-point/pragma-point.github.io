document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.carousel-track');
  const indicators = document.querySelectorAll('.indicator');
  const slides = document.querySelectorAll('.carousel-slide');

  // Only initialize if carousel exists on the page
  if (!carousel || !track || !indicators.length || !slides.length) return;

  let currentIndex = 0;
  let autoAdvanceInterval = null;
  let isInitialized = false;

  // Event handler references for cleanup
  let touchStartHandler, touchEndHandler;
  const indicatorHandlers = [];

  // Stop auto-advance when user interacts
  function stopAutoAdvance() {
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = null;
    }
  }

  // Update carousel position and indicators
  function updateCarousel(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  // Initialize carousel behavior
  function initCarousel() {
    if (isInitialized) return;
    isInitialized = true;

    currentIndex = 0;
    updateCarousel(0);

    // Add click handlers to indicators
    indicators.forEach((indicator, i) => {
      const handler = (e) => {
        const index = parseInt(e.target.dataset.index);
        stopAutoAdvance();
        updateCarousel(index);
      };
      indicatorHandlers[i] = handler;
      indicator.addEventListener('click', handler);
    });

    // Touch/swipe support
    let touchStartX = 0;

    touchStartHandler = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    touchEndHandler = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      const swipeThreshold = 20;

      if (Math.abs(diff) > swipeThreshold) {
        stopAutoAdvance();
        if (diff > 0) {
          updateCarousel(currentIndex + 1);
        } else {
          updateCarousel(currentIndex - 1);
        }
      }
    };

    carousel.addEventListener('touchstart', touchStartHandler, { passive: true });
    carousel.addEventListener('touchend', touchEndHandler, { passive: true });

    // Auto-advance every 7 seconds
    autoAdvanceInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      updateCarousel(nextIndex);
    }, 7000);
  }

  // Destroy carousel behavior
  function destroyCarousel() {
    if (!isInitialized) return;
    isInitialized = false;

    stopAutoAdvance();

    // Remove indicator handlers
    indicators.forEach((indicator, i) => {
      if (indicatorHandlers[i]) {
        indicator.removeEventListener('click', indicatorHandlers[i]);
      }
    });

    // Remove touch handlers
    if (touchStartHandler) {
      carousel.removeEventListener('touchstart', touchStartHandler);
    }
    if (touchEndHandler) {
      carousel.removeEventListener('touchend', touchEndHandler);
    }

    // Reset carousel position
    track.style.transform = '';
    currentIndex = 0;
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === 0);
    });
  }

  // Handle screen size changes
  const mediaQuery = window.matchMedia('(min-width: 1024px)');

  function handleScreenChange(e) {
    if (e.matches) {
      // Desktop - destroy carousel
      destroyCarousel();
    } else {
      // Mobile - initialize carousel
      initCarousel();
    }
  }

  // Listen for changes
  mediaQuery.addEventListener('change', handleScreenChange);

  // Initial check
  handleScreenChange(mediaQuery);
});
