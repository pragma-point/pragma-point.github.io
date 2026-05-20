document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll('.carousel-container');
  if (!containers.length) return;

  containers.forEach(setupCarousel);
});

function setupCarousel(container) {
  const carousel = container.querySelector('.carousel');
  const track = container.querySelector('.carousel-track');
  const indicators = container.querySelectorAll('.indicator');
  const slides = container.querySelectorAll('.carousel-slide');

  if (!carousel || !track || !indicators.length || !slides.length) return;

  let currentIndex = 0;
  let autoAdvanceInterval = null;
  let isInitialized = false;

  let touchStartHandler, touchEndHandler;
  const indicatorHandlers = [];

  function stopAutoAdvance() {
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = null;
    }
  }

  function updateCarousel(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  function initCarousel() {
    if (isInitialized) return;
    isInitialized = true;

    currentIndex = 0;
    updateCarousel(0);

    indicators.forEach((indicator, i) => {
      const handler = (e) => {
        const index = parseInt(e.target.dataset.index);
        stopAutoAdvance();
        updateCarousel(index);
      };
      indicatorHandlers[i] = handler;
      indicator.addEventListener('click', handler);
    });

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

    autoAdvanceInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      updateCarousel(nextIndex);
    }, 7000);
  }

  function destroyCarousel() {
    if (!isInitialized) return;
    isInitialized = false;

    stopAutoAdvance();

    indicators.forEach((indicator, i) => {
      if (indicatorHandlers[i]) {
        indicator.removeEventListener('click', indicatorHandlers[i]);
      }
    });

    if (touchStartHandler) {
      carousel.removeEventListener('touchstart', touchStartHandler);
    }
    if (touchEndHandler) {
      carousel.removeEventListener('touchend', touchEndHandler);
    }

    track.style.transform = '';
    currentIndex = 0;
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === 0);
    });
  }

  const mediaQuery = window.matchMedia('(min-width: 1024px)');

  function handleScreenChange(e) {
    if (e.matches) {
      destroyCarousel();
    } else {
      initCarousel();
    }
  }

  mediaQuery.addEventListener('change', handleScreenChange);
  handleScreenChange(mediaQuery);
}
