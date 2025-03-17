chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const tabId = tab.id;
  const url = tab.url;

  if (!url.startsWith('chrome://')) {
    document.getElementById('spawnGoose').addEventListener('click', () => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["goose.js"]
      });
    });

    document.getElementById('clearGoose').addEventListener('click', () => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          document.querySelectorAll('div[style*="z-index: 2147483647"]').forEach(el => el.remove());
        }
      });
    });
  } else {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = 'Cannot execute script on chrome:// URLs';
    errorMessage.style.display = 'block';
  }
});