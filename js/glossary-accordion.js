/* ==========================================================================
   GLOSSARY ACCORDION JAVASCRIPT
   Interactive accordion navigation for glossary terms
   ========================================================================== */

(function() {
  'use strict';

  /**
   * Initialize glossary accordion functionality
   * Called on DOMContentLoaded and pagesLoaded events
   */
  function initGlossaryAccordion() {
    const navButtons = document.querySelectorAll('.glossary-nav__btn');
    const entries = document.querySelectorAll('.glossary-entry');
    const closeButtons = document.querySelectorAll('.glossary-entry__close');

    if (navButtons.length === 0 || entries.length === 0) {
      return; // Not on glossary page or not loaded yet
    }

    // Set up navigation button click handlers
    navButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        toggleEntry(targetId, navButtons, entries);
      });
    });

    // Set up close button handlers
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        closeAllEntries(navButtons, entries);
        // Scroll back to navigation
        const navContainer = document.querySelector('.glossary-nav');
        if (navContainer) {
          navContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Handle URL hash on page load
    handleUrlHash(navButtons, entries);

    // Listen for hash changes (back/forward navigation)
    window.addEventListener('hashchange', function() {
      handleUrlHash(navButtons, entries);
    });

    // Keyboard navigation support
    setupKeyboardNavigation(navButtons, entries);
  }

  /**
   * Toggle a specific glossary entry
   * @param {string} targetId - The ID of the entry to toggle
   * @param {NodeList} navButtons - All navigation buttons
   * @param {NodeList} entries - All glossary entries
   */
  function toggleEntry(targetId, navButtons, entries) {
    const targetEntry = document.getElementById(targetId);
    const targetButton = document.querySelector(`[data-target="${targetId}"]`);

    if (!targetEntry) return;

    const isCurrentlyActive = targetEntry.classList.contains('is-active');

    // Close all entries first
    closeAllEntries(navButtons, entries);

    // If clicking on a different entry (or same entry was closed), open it
    if (!isCurrentlyActive) {
      openEntry(targetEntry, targetButton);
      
      // Update URL hash without scrolling
      history.replaceState(null, null, `#${targetId}`);
      
      // No scrolling - keep navigation visible
    } else {
      // Clear hash if closing
      history.replaceState(null, null, window.location.pathname);
    }
  }

  /**
   * Open a specific entry
   * @param {HTMLElement} entry - The entry element to open
   * @param {HTMLElement} button - The corresponding nav button
   */
  function openEntry(entry, button) {
    entry.classList.add('is-active');
    if (button) {
      button.setAttribute('aria-expanded', 'true');
    }

    // Re-initialize any interactive components inside the entry
    reinitializeComponents(entry);
  }

  /**
   * Close all entries
   * @param {NodeList} navButtons - All navigation buttons
   * @param {NodeList} entries - All glossary entries
   */
  function closeAllEntries(navButtons, entries) {
    entries.forEach(entry => {
      entry.classList.remove('is-active');
    });

    navButtons.forEach(button => {
      button.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Handle URL hash navigation
   * @param {NodeList} navButtons - All navigation buttons
   * @param {NodeList} entries - All glossary entries
   */
  function handleUrlHash(navButtons, entries) {
    const hash = window.location.hash.slice(1); // Remove the #

    if (hash) {
      const targetEntry = document.getElementById(hash);
      const targetButton = document.querySelector(`[data-target="${hash}"]`);

      if (targetEntry && targetEntry.classList.contains('glossary-entry')) {
        closeAllEntries(navButtons, entries);
        openEntry(targetEntry, targetButton);

        // Scroll to entry after a short delay to ensure rendering
        setTimeout(() => {
          targetEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  /**
   * Re-initialize interactive components after showing an entry
   * This ensures tokenizer demo, collapsibles, hotspots work properly
   * @param {HTMLElement} entry - The entry element containing components
   */
  function reinitializeComponents(entry) {
    // Trigger resize event to help components recalculate layouts
    window.dispatchEvent(new Event('resize'));

    // Re-initialize tokenizer if present
    const tokenizerDemo = entry.querySelector('.tokenizer-demo');
    if (tokenizerDemo) {
      const textarea = tokenizerDemo.querySelector('.tokenizer-demo__input');
      if (textarea) {
        // Trigger input event to refresh tokenizer display
        textarea.dispatchEvent(new Event('input'));
      }
    }

    // Ensure collapsibles are properly initialized
    const collapsibles = entry.querySelectorAll('[data-collapsible]');
    collapsibles.forEach(collapsible => {
      // Components should already be initialized, just ensure aria states are correct
      const toggle = collapsible.querySelector('.collapsible__toggle');
      const panel = collapsible.querySelector('.collapsible__panel');
      if (toggle && panel) {
        // Reset to collapsed state if needed
        if (!toggle.hasAttribute('aria-expanded')) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Re-initialize hotspots if present
    const hotspots = entry.querySelectorAll('.hotspot');
    hotspots.forEach(hotspot => {
      // Trigger mouseenter/mouseleave cycle to reset tooltip positions
      const tooltip = hotspot.querySelector('.hotspot__tooltip');
      if (tooltip) {
        tooltip.setAttribute('hidden', '');
      }
    });
  }

  /**
   * Set up keyboard navigation for accessibility
   * @param {NodeList} navButtons - All navigation buttons
   * @param {NodeList} entries - All glossary entries
   */
  function setupKeyboardNavigation(navButtons, entries) {
    const navContainer = document.querySelector('.glossary-nav');
    if (!navContainer) return;

    navContainer.addEventListener('keydown', function(e) {
      const currentButton = document.activeElement;
      const buttonArray = Array.from(navButtons);
      const currentIndex = buttonArray.indexOf(currentButton);

      if (currentIndex === -1) return;

      let nextIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % buttonArray.length;
          buttonArray[nextIndex].focus();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + buttonArray.length) % buttonArray.length;
          buttonArray[nextIndex].focus();
          break;

        case 'Home':
          e.preventDefault();
          buttonArray[0].focus();
          break;

        case 'End':
          e.preventDefault();
          buttonArray[buttonArray.length - 1].focus();
          break;

        case 'Escape':
          e.preventDefault();
          closeAllEntries(navButtons, entries);
          history.replaceState(null, null, window.location.pathname);
          break;
      }
    });

    // ESC key to close from anywhere in the entry
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const activeEntry = document.querySelector('.glossary-entry.is-active');
        if (activeEntry) {
          closeAllEntries(navButtons, entries);
          history.replaceState(null, null, window.location.pathname);
          
          // Focus back on the navigation
          const navContainer = document.querySelector('.glossary-nav');
          if (navContainer) {
            const firstButton = navContainer.querySelector('.glossary-nav__btn');
            if (firstButton) {
              firstButton.focus();
            }
          }
        }
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryAccordion);
  } else {
    initGlossaryAccordion();
  }

  // Re-initialize after dynamic page loads (for SPA-like navigation)
  document.addEventListener('pagesLoaded', initGlossaryAccordion);

})();
