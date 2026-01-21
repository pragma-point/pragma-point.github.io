document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const track = document.querySelector('.carousel-track');
  const indicators = document.querySelectorAll('.indicator');
  const slides = document.querySelectorAll('.carousel-slide');

  // Only initialize if carousel exists on the page
  if (!track || !indicators.length || !slides.length) return;

  let currentIndex = 0;

  // Update carousel position and indicators
  function updateCarousel(index) {
    // Ensure index is within bounds
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    currentIndex = index;

    // Move the track
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update indicators
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Add click handlers to indicators
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      updateCarousel(index);
    });
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next slide
        updateCarousel(currentIndex + 1);
      } else {
        // Swiped right - go to previous slide
        updateCarousel(currentIndex - 1);
      }
    }
  }

  // Auto-advance every 7 seconds
  // setInterval(() => {
  //   const nextIndex = (currentIndex + 1) % slides.length;
  //   updateCarousel(nextIndex);
  // }, 7000);
});
