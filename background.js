let newTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight') {
    if (newTabId) {
      console.log("Sending highlight request to new tab:", newTabId, request.targetRegionId);
      chrome.tabs.sendMessage(newTabId, { action: 'highlight', targetRegionId: request.targetRegionId });
    } else {
      console.log("New tab ID not set, cannot send highlight request.");
    }
  } else if (request.action === 'getTooltipId') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'getTooltipId' }, (response) => {
        if (response) {
          sendResponse(response);
        }
      });
    });
    return true; // Keep the message channel open for sendResponse
  } else if (request.action === 'setNewTabId') {
    newTabId = request.newTabId;
    console.log("New tab ID set:", newTabId);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Highlight Elements in New Window extension installed.");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Highlight Elements in New Window extension started.");
});
