/**
 * Technique Explorer - Interactive split view for prompting techniques
 */

(function() {
  'use strict';

  function initTechniqueExplorer() {
    const explorers = document.querySelectorAll('.technique-explorer');
    
    explorers.forEach(explorer => {
      const items = explorer.querySelectorAll('.technique-item');
      const detailPanel = explorer.querySelector('.technique-detail');
      const contentTemplates = explorer.querySelectorAll('.technique-content');
      
      if (!detailPanel) return;

      items.forEach(item => {
        item.addEventListener('click', () => {
          // Remove active class from all items
          items.forEach(i => i.classList.remove('is-active'));
          
          // Add active class to clicked item
          item.classList.add('is-active');
          
          // Get technique ID
          const techniqueId = item.dataset.technique;
          
          // Find matching content template
          const content = explorer.querySelector(`.technique-content[data-technique="${techniqueId}"]`);
          
          if (content) {
            showDetail(detailPanel, content, item);
          }
        });

        // Keyboard accessibility
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });
      });
    });
  }

  function showDetail(panel, content, item) {
    const title = item.querySelector('.technique-item__name').textContent;
    const badge = item.querySelector('.technique-item__badge');
    const badgeClass = badge ? badge.className : '';
    const badgeText = badge ? badge.textContent : '';
    
    const description = content.dataset.description || '';
    const example = content.dataset.example || '';
    const whenToUse = content.dataset.when || '';

    panel.innerHTML = `
      <div class="technique-detail__body">
        <h3 class="technique-detail__title">
          ${badgeText ? `<span class="${badgeClass}">${badgeText}</span>` : ''}
          ${title}
        </h3>
        ${whenToUse ? `<p class="technique-detail__subtitle">${whenToUse}</p>` : ''}
        
        <div class="technique-detail__section">
          <h4 class="technique-detail__section-title">Co to dělá</h4>
          <p class="technique-detail__description">${description}</p>
        </div>
        
        ${example ? `
        <div class="technique-detail__section">
          <h4 class="technique-detail__section-title">Ukázka promptu</h4>
          <pre class="technique-detail__example">${escapeHtml(example)}</pre>
        </div>
        ` : ''}
      </div>
    `;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechniqueExplorer);
  } else {
    initTechniqueExplorer();
  }

  // Re-initialize after dynamic content load
  document.addEventListener('pagesLoaded', initTechniqueExplorer);

  // Export for manual initialization
  window.initTechniqueExplorer = initTechniqueExplorer;

})();
