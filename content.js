function highlightFlagsBasedOnTooltip() {
  const tooltip = document.querySelector('[data-current-question-id]');
  if (!tooltip) return;

  const targetRegionId = tooltip.getAttribute('data-current-question-id');
  if (!targetRegionId) return;

  const svgContainer = document.querySelector('#svgpoint');
  if (!svgContainer) return;

  const allElements = svgContainer.querySelectorAll('path, rect, image, use');
  allElements.forEach(el => {
    el.style.fill = '';
    el.style.stroke = '';
    el.style.filter = '';
  });

  const targetRegion = svgContainer.querySelector(`#${CSS.escape(targetRegionId)}`);
  if (!targetRegion) return;

  const flagElements = targetRegion.querySelectorAll('image, use, rect');
  flagElements.forEach(flag => {
    flag.style.stroke = 'gold';
    flag.style.strokeWidth = '3px';
  });
}




function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function observeTooltipChanges() {
  waitForElement('[data-current-question-id]', (tooltip) => {
    const observer = new MutationObserver(() => {
      highlightRegionBasedOnTooltip();
    });
    observer.observe(tooltip, { attributes: true, attributeFilter: ['data-current-question-id'] });
  });
}

window.addEventListener('load', () => {
  waitForElement('#svgpoint', () => {
    highlightRegionBasedOnTooltip();
    observeTooltipChanges();
  });
});
