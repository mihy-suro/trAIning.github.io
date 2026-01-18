/**
 * Tokenizer Demo Component
 * Využívá LLaMA3 tokenizér pro interaktivní demonstraci tokenizace textu
 */

(function() {
  'use strict';

  // Debounce helper pro optimalizaci výkonu
  function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Speciální tokeny LLaMA3
  const SPECIAL_TOKENS = {
    128000: '<|begin_of_text|>',
    128001: '<|end_of_text|>',
    128002: '<|reserved_special_token_0|>',
    128003: '<|reserved_special_token_1|>',
    128004: '<|finetune_right_pad_id|>',
    128005: '<|reserved_special_token_2|>',
    128006: '<|start_header_id|>',
    128007: '<|end_header_id|>',
    128008: '<|eom_id|>',
    128009: '<|eot_id|>'
  };

  function initTokenizer() {
    const container = document.getElementById('tokenizer-demo');
    if (!container) {
      console.log('Tokenizer: container not found');
      return;
    }

    // Kontrola dostupnosti tokenizéru
    if (typeof llama3Tokenizer === 'undefined') {
      console.warn('Tokenizer: llama3Tokenizer not loaded');
      container.innerHTML = `
        <div class="tokenizer-demo__error">
          Tokenizér se nepodařilo načíst. Zkuste obnovit stránku.
        </div>
      `;
      return;
    }

    console.log('Tokenizer: initializing...');

    const textarea = container.querySelector('.tokenizer-demo__input');
    const statsContainer = container.querySelector('.tokenizer-demo__stats');
    const tokensContainer = container.querySelector('.tokenizer-demo__tokens');
    const visualContainer = container.querySelector('.tokenizer-demo__visual');

    if (!textarea || !statsContainer || !tokensContainer) {
      console.error('Tokenizer: required elements not found');
      return;
    }

    function updateTokenization() {
      const text = textarea.value;
      
      if (!text.trim()) {
        statsContainer.innerHTML = `
          <div class="tokenizer-demo__stat">
            <span class="tokenizer-demo__stat-value">0</span>
            <span class="tokenizer-demo__stat-label">tokenů</span>
          </div>
          <div class="tokenizer-demo__stat">
            <span class="tokenizer-demo__stat-value">0</span>
            <span class="tokenizer-demo__stat-label">znaků</span>
          </div>
        `;
        tokensContainer.textContent = '';
        if (visualContainer) visualContainer.innerHTML = '';
        return;
      }

      try {
        // Tokenizace bez speciálních tokenů BOS/EOS
        const tokens = llama3Tokenizer.encode(text, { bos: false, eos: false });
        const charCount = text.length;
        const ratio = (tokens.length / charCount).toFixed(2);

        // Aktualizace statistik
        statsContainer.innerHTML = `
          <div class="tokenizer-demo__stat">
            <span class="tokenizer-demo__stat-value">${tokens.length}</span>
            <span class="tokenizer-demo__stat-label">tokenů</span>
          </div>
          <div class="tokenizer-demo__stat">
            <span class="tokenizer-demo__stat-value">${charCount}</span>
            <span class="tokenizer-demo__stat-label">znaků</span>
          </div>
          <div class="tokenizer-demo__stat">
            <span class="tokenizer-demo__stat-value">${ratio}</span>
            <span class="tokenizer-demo__stat-label">tok/znak</span>
          </div>
        `;

        // Zobrazení tokenů jako pole čísel
        tokensContainer.textContent = '[' + tokens.join(', ') + ']';

        // Vizuální reprezentace tokenů
        if (visualContainer) {
          try {
            // Dekódujeme každý token jednotlivě pro vizualizaci
            let visualHtml = '';
            for (const tokenId of tokens) {
              const decoded = llama3Tokenizer.decode([tokenId]);
              const displayText = decoded
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '↵')
                .replace(/\t/g, '→')
                .replace(/ /g, '·');
              
              const isSpecial = tokenId in SPECIAL_TOKENS;
              const specialClass = isSpecial ? ' tokenizer-demo__token--special' : '';
              
              visualHtml += `<span class="tokenizer-demo__token${specialClass}" title="ID: ${tokenId}">${displayText}</span>`;
            }
            visualContainer.innerHTML = visualHtml;
          } catch (e) {
            // Pokud vizualizace selže, prostě ji skryjeme
            visualContainer.innerHTML = '';
          }
        }

      } catch (error) {
        console.error('Tokenizer error:', error);
        tokensContainer.textContent = 'Chyba při tokenizaci';
      }
    }

    // Event listener s debounce pro lepší výkon
    textarea.addEventListener('input', debounce(updateTokenization, 150));

    // Inicializace s případným výchozím textem
    if (textarea.value) {
      updateTokenization();
    }

    console.log('Tokenizer: initialized successfully');
  }

  // Export do globálního scope
  window.initTokenizer = initTokenizer;

  // Inicializace po načtení stránek
  document.addEventListener('pagesLoaded', initTokenizer);

  // Fallback pro případ, že se event už nespustí
  if (document.readyState === 'complete') {
    setTimeout(initTokenizer, 100);
  }

})();
