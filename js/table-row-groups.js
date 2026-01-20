/**
 * Table Row Group Highlighting
 * Two-level highlighting:
 * 1. Light highlight for entire section when hovering any row in the group
 * 2. Stronger highlight for the specific row being hovered
 */

(function() {
  'use strict';

  function initTableRowGroupHighlight() {
    // Find all cells with rowspan attribute
    const rowspanCells = document.querySelectorAll('.data-table td[rowspan]');
    
    rowspanCells.forEach(cell => {
      const rowspan = parseInt(cell.getAttribute('rowspan'), 10);
      const startRow = cell.parentElement;
      const tbody = startRow.parentElement;
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const startIndex = rows.indexOf(startRow);
      
      // Get all rows in this group
      const groupRows = rows.slice(startIndex, startIndex + rowspan);
      
      // Add hover listeners to all rows in the group
      groupRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
          // Level 1: Highlight entire group (light)
          groupRows.forEach(r => r.classList.add('row-group-highlight'));
          // Level 2: Highlight active row (stronger)
          row.classList.add('row-active');
        });
        
        row.addEventListener('mouseleave', () => {
          // Remove all highlights
          groupRows.forEach(r => r.classList.remove('row-group-highlight'));
          row.classList.remove('row-active');
        });
      });
    });
    
    console.log('Table row groups: initialized for', rowspanCells.length, 'cells');
  }

  // Listen for pagesLoaded event (fired by page-loader.js after dynamic content loads)
  document.addEventListener('pagesLoaded', initTableRowGroupHighlight);
  
  // Also run on DOMContentLoaded for static pages
  document.addEventListener('DOMContentLoaded', initTableRowGroupHighlight);

})();
