(function () {
  const root = document.querySelector('.content'); // search scope
  if (!root) return;

  const input = document.getElementById('site-search');
  const countEl = document.getElementById('find-count');
  const nextBtn = document.getElementById('find-next');
  const prevBtn = document.getElementById('find-prev');
  const clearBtn = document.getElementById('find-clear');

  const HIGHLIGHT = 'find-highlight';
  const CURRENT = 'current';

  let matches = [];
  let currentIndex = -1;
  let lastQuery = '';

  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  function clearHighlights() {
    // Remove "current" class first
    matches.forEach(m => m.classList.remove(CURRENT));
    // Unwrap all highlights
    document.querySelectorAll('mark.' + HIGHLIGHT).forEach(mark => {
      const parent = mark.parentNode;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
      parent.normalize(); // merge adjacent text nodes
    });
    matches = [];
    currentIndex = -1;
    updateCounter();
  }

  function highlightAll(query) {
    if (!query) return;
    const qLower = query.toLowerCase();

    // Walk all text nodes in root
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // Skip empty/whitespace-only nodes and nodes already inside a mark
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest('mark.' + HIGHLIGHT)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      wrapMatchesInTextNode(node, qLower, query.length);
    }
  }

  function wrapMatchesInTextNode(textNode, qLower, qLen) {
    let cur = textNode;
    while (cur && cur.nodeType === Node.TEXT_NODE) {
      const value = cur.nodeValue;
      const idx = value.toLowerCase().indexOf(qLower);
      if (idx === -1) break;

      const range = document.createRange();
      range.setStart(cur, idx);
      range.setEnd(cur, idx + qLen);

      const mark = document.createElement('mark');
      mark.className = HIGHLIGHT;

      range.surroundContents(mark);
      matches.push(mark);

      // Continue in the text node after the inserted mark
      cur = mark.nextSibling;
    }
  }

  function setCurrent(i) {
    matches.forEach(m => m.classList.remove(CURRENT));
    if (matches.length === 0) {
      currentIndex = -1;
      updateCounter();
      return;
    }
    currentIndex = ((i % matches.length) + matches.length) % matches.length; // safe modulo
    const el = matches[currentIndex];
    el.classList.add(CURRENT);
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    updateCounter();
  }

  function updateCounter() {
    const total = matches.length;
    const pos = total ? (currentIndex + 1) : 0;
    if (countEl) countEl.textContent = `${pos}/${total}`;
  }

  function performSearch(q, keepIndex = false) {
    const query = (q || '').trim();
    if (query === lastQuery && matches.length) {
      // same query, do nothing
      return;
    }
    clearHighlights();
    lastQuery = query;

    if (!query) return;

    highlightAll(query);
    if (matches.length) {
      setCurrent(0);
    } else {
      updateCounter(); // 0/0
    }
  }

  function next() {
    if (!matches.length) return;
    setCurrent(currentIndex + 1);
  }

  function prev() {
    if (!matches.length) return;
    setCurrent(currentIndex - 1);
  }

  // Debounce input for smoother UX
  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const onInput = debounce(() => performSearch(input.value), 120);

  // Wire up events
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) prev(); else next();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      input.value = '';
      lastQuery = '';
      clearHighlights();
    }
  });

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  clearBtn?.addEventListener('click', () => {
    input.value = '';
    lastQuery = '';
    clearHighlights();
    input.focus();
  });

  // Optional: focus the search with Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
})();