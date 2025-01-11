let isHighlighterActive = false;
let tooltipObserver = null;

function highlightRegionBasedOnTooltip(targetRegionId) {
  console.log("Highlighting region:", targetRegionId);
  const svgContainer = document.querySelector('#svgpoint');
  if (!svgContainer) return;

  const allRegions = svgContainer.querySelectorAll('path, circle, polygon');
  allRegions.forEach(region => {
    region.style.fill = '';
  });

  if (!targetRegionId) return;

  const targetRegion = svgContainer.querySelector(`#${CSS.escape(targetRegionId)}`);
  if (!targetRegion) return;

  const regionElements = targetRegion.querySelectorAll('path, circle, polygon');
  if (regionElements.length > 0) {
    regionElements.forEach(element => {
      element.style.fill = 'gold';
    });
  } else {
    targetRegion.style.fill = 'gold';
  }
}

function observeTooltipChanges() {
  tooltipObserver = new MutationObserver(() => {
    chrome.runtime.sendMessage({ action: 'getTooltipId' }, (response) => {
      if (response && response.tooltipId) {
        highlightRegionBasedOnTooltip(response.tooltipId);
      }
    });
  });

  const waitForTooltip = (callback) => {
    const tooltip = document.querySelector('[data-current-question-id]');
    if (tooltip) {
      callback(tooltip);
    } else {
      const observer = new MutationObserver(() => {
        const tooltip = document.querySelector('[data-current-question-id]');
        if (tooltip) {
          observer.disconnect();
          callback(tooltip);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  waitForTooltip((tooltip) => {
    tooltipObserver.observe(tooltip, { attributes: true, attributeFilter: ['data-current-question-id'] });
  });
}

function highlighterON() {
  if (!isHighlighterActive) {
    isHighlighterActive = true;
    observeTooltipChanges();
  }
}

function highlighterOFF() {
  if (isHighlighterActive) {
    isHighlighterActive = false;
    const svgContainer = document.querySelector('#svgpoint');
    if (svgContainer) {
      const allRegions = svgContainer.querySelectorAll('path, circle, polygon');
      allRegions.forEach(region => {
        region.style.fill = '';
      });
    }
    if (tooltipObserver) {
      tooltipObserver.disconnect();
      tooltipObserver = null;
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight') {
    highlightRegionBasedOnTooltip(request.targetRegionId);
  }
});

highlighterON();
