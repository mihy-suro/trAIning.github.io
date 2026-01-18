/**
 * Read more / Read less
 * Accessible approach:
 * - The teaser is always visible.
 * - The "more" part is in a separate span with the hidden attribute.
 * - Toggling removes/adds hidden and keeps aria-expanded in sync.
 *
 * Optional configuration via data attributes on the container:
 * - data-collapsed-text: button label when collapsed (default: "Read more")
 * - data-expanded-text: button label when expanded (default: "Read less")
 */

(function () {
  let uid = 0;

  function ensureId(el) {
    if (!el.id) {
      uid += 1;
      el.id = `read-more-extra-${uid}`;
    }
    return el.id;
  }

  function setup(root) {
    const btn = root.querySelector(".read-more__toggle");
    const more = root.querySelector("[data-read-more-more]");
    const collapsedText =
      root.getAttribute("data-collapsed-text") || "Read more";
    const expandedText = root.getAttribute("data-expanded-text") || "Read less";

    if (!btn || !more) return;

    // Ensure button controls the "more" region
    const moreId = ensureId(more);
    if (!btn.hasAttribute("aria-controls")) {
      btn.setAttribute("aria-controls", moreId);
    }

    // Initialize state based on hidden attribute
    let isOpen = !more.hasAttribute("hidden");
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.textContent = isOpen ? expandedText : collapsedText;

    function open() {
      more.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = expandedText;
      isOpen = true;
    }

    function close() {
      more.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = collapsedText;
      isOpen = false;
    }

    function toggle() {
      isOpen ? close() : open();
    }

    btn.addEventListener("click", toggle);

    // Buttons already respond to Enter/Space, no extra key handling needed.
  }

  document.querySelectorAll("[data-read-more]").forEach(setup);
})();