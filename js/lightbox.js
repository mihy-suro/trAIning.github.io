/**
 * Lightbox: Click-to-zoom image functionality
 * - Click on thumbnail to open full-size image
 * - Click anywhere or press Escape to close
 */

(function () {
  // Create lightbox element once
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Zavřít">&times;</button>
    <img src="" alt="" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on click anywhere on lightbox
  lightbox.addEventListener('click', closeLightbox);

  // Close on close button
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach click handlers to thumbnails
  function initThumbnails() {
    document.querySelectorAll('.thumbnail').forEach((thumb) => {
      if (thumb.dataset.lightboxInit) return;
      thumb.dataset.lightboxInit = 'true';

      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const img = thumb.querySelector('img');
        if (img) {
          // Use data-full attribute for full-size image, or fallback to src
          const fullSrc = thumb.dataset.full || img.src;
          openLightbox(fullSrc, img.alt);
        }
      });

      // Keyboard accessibility
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('aria-label', 'Klikněte pro zvětšení obrázku');
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          thumb.click();
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThumbnails);
  } else {
    initThumbnails();
  }

  // Re-initialize when dynamic content is loaded (for page-loader.js)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        initThumbnails();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
