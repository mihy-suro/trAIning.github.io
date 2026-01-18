/**
 * Collapsible Box: Accessible, vanilla JS
 *
 * Features:
 * - Uses a button with aria-expanded and aria-controls
 * - Manages smooth open/close using inline max-height animation
 * - Preserves keyboard accessibility and screen reader semantics
 *
 * Usage:
 * - Structure your HTML as in index.html
 * - Include this script at the end of the body or with defer
 */

(function () {
  function setupCollapsible(root) {
    const toggle = root.querySelector(".collapsible__toggle");
    const panel = root.querySelector(".collapsible__panel");
    if (!toggle || !panel) return;

    // Initialize state from markup (hidden attribute)
    let isOpen = !panel.hasAttribute("hidden");

    // Ensure aria-expanded matches current state
    toggle.setAttribute("aria-expanded", String(isOpen));
    panel.dataset.open = String(isOpen);

    // Prepare panel for animation
    panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : "0px";

    function open() {
      panel.hidden = false;
      panel.dataset.open = "true";
      toggle.setAttribute("aria-expanded", "true");
      // Force reflow before setting target height for transition
      panel.style.maxHeight = panel.scrollHeight + "px";
      isOpen = true;
    }

    function close() {
      panel.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      // Animate to height 0
      panel.style.maxHeight = panel.scrollHeight + "px"; // set from current
      // Force next frame for transition to 0
      requestAnimationFrame(() => {
        panel.style.maxHeight = "0px";
      });
      isOpen = false;
    }

    function togglePanel() {
      if (isOpen) {
        close();
      } else {
        open();
      }
    }

    // Click to toggle
    toggle.addEventListener("click", togglePanel);

    // Keyboard: Enter/Space already trigger click on button, but ensure robustness
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePanel();
      }
    });

    // Transition end: when fully closed, hide for a11y/semantics
    panel.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "max-height") return;
      if (!isOpen) {
        panel.hidden = true;
      } else {
        // Ensure final height matches content in case content changed
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });

    // Optional: handle dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      if (isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
    resizeObserver.observe(panel);

    // Apply transition via inline style to keep CSS simple
    panel.style.transition = "max-height 200ms ease";
  }

  // Initialize all collapsibles on the page
  function initCollapsible() {
    const collapsibles = document.querySelectorAll("[data-collapsible]");
    console.log(`Collapsible: initializing ${collapsibles.length} elements`);
    collapsibles.forEach(setupCollapsible);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollapsible);
  } else {
    initCollapsible();
  }

  // Re-initialize after dynamic content load
  document.addEventListener('pagesLoaded', initCollapsible);

  // Export for manual initialization
  window.initCollapsible = initCollapsible;
})();