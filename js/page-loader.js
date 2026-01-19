/**
 * Page Loader - Dynamicky načítá obsah stránek pomocí fetch
 * Pro GitHub Pages hosting
 */

(function() {
  'use strict';

  // Mapování sekcí na soubory
  const PAGE_MAP = {
    'introduction': 'pages/introduction.html',
    'basics': 'pages/basics.html',
    'glossary': 'pages/glossary.html',
    'prompting': 'pages/prompting.html',
    'usage': 'pages/usage.html',
    'safety': 'pages/safety.html',
    'models': 'pages/models.html',
    'usecases': 'pages/usecases.html',
    'resources': 'pages/resources.html'
  };

  // Cache pro načtené stránky
  const pageCache = new Map();

  // Hlavní kontejner pro obsah
  let contentContainer = null;

  /**
   * Inicializace page loaderu
   */
  function init() {
    console.log('Page loader: initializing...');
    contentContainer = document.querySelector('.content');
    if (!contentContainer) {
      console.error('Page loader: .content container not found');
      return;
    }

    // Načti všechny stránky při startu (pro rychlý přepínání)
    loadAllPages();

    // Navigace při kliknutí na menu
    setupNavigation();
  }

  /**
   * Načte všechny stránky do cache a zobrazí je
   */
  async function loadAllPages() {
    const pages = Object.keys(PAGE_MAP);
    
    // Odstraň loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    
    let loadedCount = 0;
    
    for (const pageId of pages) {
      try {
        console.log(`Loading page: ${pageId}`);
        const html = await fetchPage(pageId);
        if (html) {
          // Vlož obsah do kontejneru
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html.trim();
          const element = wrapper.firstElementChild;
          if (element) {
            contentContainer.appendChild(element);
            loadedCount++;
          }
        }
      } catch (error) {
        console.error(`Failed to load page: ${pageId}`, error);
      }
    }

    // Odstraň loading indicator po načtení
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
    
    console.log(`Page loader: loaded ${loadedCount} pages`);

    // Po načtení všech stránek reinicializuj JS komponenty
    reinitializeComponents();
    
    // Zpracuj hash v URL při načtení
    handleInitialHash();
  }

  /**
   * Načte stránku z cache nebo ze serveru
   */
  async function fetchPage(pageId) {
    // Zkontroluj cache
    if (pageCache.has(pageId)) {
      return pageCache.get(pageId);
    }

    const url = PAGE_MAP[pageId];
    if (!url) {
      console.warn(`Unknown page: ${pageId}`);
      return null;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const html = await response.text();
      pageCache.set(pageId, html);
      return html;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return `<section id="${pageId}"><div class="section section--white"><p>Chyba při načítání obsahu.</p></div></section>`;
    }
  }

  /**
   * Nastaví navigaci pro menu odkazy
   */
  function setupNavigation() {
    const menuLinks = document.querySelectorAll('.menu a[href^="#"]');
    
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        
        // Pokud je to hlavní sekce, scrolluj na ni
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Aktualizuj URL bez reload
          history.pushState(null, '', `#${targetId}`);
        }
      });
    });
  }

  /**
   * Zpracuje hash v URL při prvním načtení
   */
  function handleInitialHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      // Počkej až se DOM aktualizuje
      setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  /**
   * Reinicializuje JS komponenty po načtení nového obsahu
   */
  function reinitializeComponents() {
    console.log('Page loader: reinitializing components...');
    
    // Dispatch custom event pro všechny komponenty
    // Komponenty poslouchají na tento event a reinicializují se samy
    document.dispatchEvent(new CustomEvent('pagesLoaded'));
    
    console.log('Page loader: pagesLoaded event dispatched');

    // Re-typeset MathJax for dynamically loaded content
    if (window.MathJax && window.MathJax.typesetPromise) {
      console.log('Page loader: running MathJax typeset...');
      window.MathJax.typesetPromise().then(() => {
        console.log('Page loader: MathJax typeset complete');
      }).catch((err) => {
        console.warn('Page loader: MathJax typeset error:', err);
      });
    } else if (window.MathJax && window.MathJax.startup) {
      // MathJax not fully loaded yet, wait for it
      window.MathJax.startup.promise.then(() => {
        console.log('Page loader: MathJax ready, running typeset...');
        return window.MathJax.typesetPromise();
      }).then(() => {
        console.log('Page loader: MathJax typeset complete');
      }).catch((err) => {
        console.warn('Page loader: MathJax typeset error:', err);
      });
    }
  }

  // Spusť po načtení DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
