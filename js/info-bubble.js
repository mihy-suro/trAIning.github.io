/**
 * Info bubble: hover, focus, and click-activated tooltip.
 * Accessibility:
 * - Button has aria-label and aria-expanded.
 * - Tooltip has role="tooltip" and is shown/hidden by toggling [hidden].
 * - Escape closes. Clicking outside closes. Only one tooltip open at a time.
 * - Works inline anywhere in text.
 */

(function () {
  let uid = 0;
  let openInstance = null;

  function ensureId(el, prefix) {
    if (!el.id) {
      uid += 1;
      el.id = `${prefix}-${uid}`;
    }
    return el.id;
  }

  function show(root) {
    if (openInstance && openInstance !== root) {
      hide(openInstance);
    }
    const trigger = root.querySelector(".info__trigger");
    const tip = root.querySelector(".info__tooltip");
    if (!trigger || !tip) return;

    tip.hidden = false;
    root.dataset.open = "true";
    trigger.setAttribute("aria-expanded", "true");
    // Link button to tooltip for SR
    const id = ensureId(tip, "tooltip");
    trigger.setAttribute("aria-describedby", id);
    openInstance = root;
  }

  function hide(root) {
    const trigger = root.querySelector(".info__trigger");
    const tip = root.querySelector(".info__tooltip");
    if (!trigger || !tip) return;

    tip.hidden = true;
    root.dataset.open = "false";
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("aria-describedby");
    if (openInstance === root) openInstance = null;
  }

  function setup(root) {
    const trigger = root.querySelector(".info__trigger");
    const tip = root.querySelector(".info__tooltip");
    if (!trigger || !tip) return;

    // Start hidden
    tip.hidden = true;
    root.dataset.open = "false";
    trigger.setAttribute("aria-expanded", "false");

    // Hover in/out
    root.addEventListener("pointerenter", () => show(root));
    root.addEventListener("pointerleave", () => hide(root));

    // Focus in/out (keyboard)
    trigger.addEventListener("focus", () => show(root));
    trigger.addEventListener("blur", (e) => {
      // If focus moves inside tooltip (unlikely since it's not focusable), ignore.
      // Otherwise, close.
      if (!root.contains(e.relatedTarget)) hide(root);
    });

    // Click toggles (touch-friendly)
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (root.dataset.open === "true") {
        hide(root);
      } else {
        show(root);
      }
    });

    // ESC to close while focused
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hide(root);
        trigger.blur();
      }
    });

    // Click outside closes
    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) hide(root);
    });
  }

  function initInfoBubbles() {
    const bubbles = document.querySelectorAll("[data-info]");
    console.log(`Info bubbles: initializing ${bubbles.length} elements`);
    bubbles.forEach(setup);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfoBubbles);
  } else {
    initInfoBubbles();
  }

  // Re-initialize after dynamic content load
  document.addEventListener('pagesLoaded', initInfoBubbles);

  // Export for manual initialization
  window.initInfoBubbles = initInfoBubbles;
})();
