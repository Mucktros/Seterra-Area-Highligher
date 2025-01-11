let tooltipObserver = null;

function sendTooltipId() {
  const tooltip = document.querySelector('[data-current-question-id]');
  if (!tooltip) return;

  const targetRegionId = tooltip.getAttribute('data-current-question-id');
  console.log("Sending tooltip ID:", targetRegionId);
  chrome.runtime.sendMessage({ action: 'highlight', targetRegionId: targetRegionId });
}

function observeTooltipChanges() {
  tooltipObserver = new MutationObserver(() => {
    sendTooltipId();
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

observeTooltipChanges();
