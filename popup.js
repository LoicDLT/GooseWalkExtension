chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;

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
});