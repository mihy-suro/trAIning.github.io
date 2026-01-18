/**
 * Interactive image hotspots with tooltips
 * Accessibility: keyboard navigation, ARIA attributes, ESC to close
 */

(function () {
  let activeHotspot = null;

  function showTooltip(hotspot) {
    if (activeHotspot && activeHotspot !== hotspot) {
      hideTooltip(activeHotspot);
    }

    const tooltip = hotspot.querySelector('.hotspot__tooltip');
    if (!tooltip) return;

    tooltip.hidden = false;
    hotspot.dataset.active = 'true';
    hotspot.setAttribute('aria-expanded', 'true');
    activeHotspot = hotspot;

    // Adjust position if tooltip goes off-screen
    adjustTooltipPosition(hotspot, tooltip);
  }

  function hideTooltip(hotspot) {
    const tooltip = hotspot.querySelector('.hotspot__tooltip');
    if (!tooltip) return;

    tooltip.hidden = true;
    hotspot.dataset.active = 'false';
    hotspot.setAttribute('aria-expanded', 'false');
    if (activeHotspot === hotspot) {
      activeHotspot = null;
    }
  }

  function adjustTooltipPosition(hotspot, tooltip) {
    // Check if tooltip goes outside viewport
    const rect = tooltip.getBoundingClientRect();
    const isAbove = !tooltip.classList.contains('hotspot__tooltip--below');

    // If tooltip is cut off at top or bottom, flip it
    if (isAbove && rect.top < 0) {
      tooltip.classList.add('hotspot__tooltip--below');
    } else if (!isAbove && rect.bottom > window.innerHeight) {
      tooltip.classList.remove('hotspot__tooltip--below');
    }
  }

  function setupHotspot(hotspot) {
    const tooltip = hotspot.querySelector('.hotspot__tooltip');
    if (!tooltip) return;

    // Initialize state
    tooltip.hidden = true;
    hotspot.dataset.active = 'false';
    hotspot.setAttribute('tabindex', '0');
    hotspot.setAttribute('role', 'button');
    hotspot.setAttribute('aria-expanded', 'false');

    // Link tooltip to hotspot for screen readers
    if (!tooltip.id) {
      tooltip.id = `hotspot-tip-${Math.random().toString(36).substr(2, 9)}`;
    }
    hotspot.setAttribute('aria-describedby', tooltip.id);

    // Mouse events
    hotspot.addEventListener('mouseenter', () => showTooltip(hotspot));
    hotspot.addEventListener('mouseleave', () => hideTooltip(hotspot));

    // Click/tap toggle
    hotspot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hotspot.dataset.active === 'true') {
        hideTooltip(hotspot);
      } else {
        showTooltip(hotspot);
      }
    });

    // Keyboard support
    hotspot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hotspot.dataset.active === 'true') {
          hideTooltip(hotspot);
        } else {
          showTooltip(hotspot);
        }
      } else if (e.key === 'Escape') {
        hideTooltip(hotspot);
        hotspot.blur();
      }
    });

    // Focus management
    hotspot.addEventListener('focus', () => showTooltip(hotspot));
    hotspot.addEventListener('blur', (e) => {
      // Only hide if focus moves outside
      if (!hotspot.contains(e.relatedTarget)) {
        hideTooltip(hotspot);
      }
    });
  }

  // Close any open tooltip when clicking outside
  document.addEventListener('click', (e) => {
    if (activeHotspot && !activeHotspot.contains(e.target)) {
      hideTooltip(activeHotspot);
    }
  });

  // Global ESC handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeHotspot) {
      hideTooltip(activeHotspot);
    }
  });

  // Initialize all hotspots
  function initHotspots() {
    const hotspots = document.querySelectorAll('.hotspot');
    console.log(`Hotspots: initializing ${hotspots.length} elements`);
    hotspots.forEach(setupHotspot);
  }

  // Export to global scope
  window.initHotspots = initHotspots;

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHotspots);
  } else {
    initHotspots();
  }

  // Reinitialize when pages are loaded
  document.addEventListener('pagesLoaded', initHotspots);
})();