document.getElementById('toggleHighlighter').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.windows.create({ url: activeTab.url, type: 'popup', width: 800, height: 600 }, (newWindow) => {
      const newTab = newWindow.tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['highlighter.js']
      }, () => {
        chrome.runtime.sendMessage({ action: 'setNewTabId', newTabId: newTab.id });
      });
    });
  });
});
