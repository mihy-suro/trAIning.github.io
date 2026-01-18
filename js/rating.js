// Renders static difficulty rating icons inside elements with class "difficulty-rating".
// Expects two icon files at:
//  - img/icons/brain.png      (off / empty brain)
//  - img/icons/brain_on.png   (on / filled brain)
// Usage:
//  <div class="difficulty-rating" data-rating="3" data-size="32" role="img" aria-label="Difficulty: 3 out of 5"></div>

(function () {
  const ROOT_OFF = 'img/icons/brain.png';
  const ROOT_ON = 'img/icons/brain_on.png';
  const MAX = 5;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function renderRating(el) {
    // If the element already has rendered icons, skip (idempotent)
    if (el.dataset._ratingRendered === 'true') return;

    let rating = parseInt(el.getAttribute('data-rating'), 10);
    if (Number.isNaN(rating)) {
      // try to find inner text like "3/5"
      const match = (el.textContent || '').match(/(\d+)\s*\/\s*5/);
      rating = match ? parseInt(match[1], 10) : 0;
    }
    rating = clamp(rating, 0, MAX);

    // size can be set via data-size attribute (px). Fallback default 28.
    let size = parseInt(el.getAttribute('data-size'), 10);
    if (Number.isNaN(size) || size <= 0) size = 28;

    // Clear existing non-noscript children (preserve sr-only and noscript if present)
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeName !== 'NOSCRIPT' && !(node.classList && node.classList.contains('sr-only'))) {
        node.remove();
      }
    });

    for (let i = 1; i <= MAX; i++) {
      const img = document.createElement('img');
      img.src = i <= rating ? ROOT_ON : ROOT_OFF;
      img.width = size;
      img.height = size;
      img.alt = ''; // decorative
      img.setAttribute('aria-hidden', 'true');
      el.appendChild(img);
    }

    // Update accessible label if not present
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', `Difficulty: ${rating} out of ${MAX}`);
    }

    el.dataset._ratingRendered = 'true';
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.difficulty-rating').forEach(renderRating);
    });
  } else {
    document.querySelectorAll('.difficulty-rating').forEach(renderRating);
  }

  // Expose a small API if someone wants to re-render (e.g., dynamic pages)
  window.DifficultyRating = {
    renderAll: function() {
      document.querySelectorAll('.difficulty-rating').forEach((el) => {
        // allow re-render by removing rendered flag
        delete el.dataset._ratingRendered;
        renderRating(el);
      });
    },
    renderOne: function(el) {
      if (!(el instanceof Element)) return;
      delete el.dataset._ratingRendered;
      renderRating(el);
    }
  };

  // Reinitialize when pages are loaded
  document.addEventListener('pagesLoaded', () => {
    document.querySelectorAll('.difficulty-rating').forEach(renderRating);
  });
})();