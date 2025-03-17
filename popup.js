fetch(chrome.runtime.getURL('settings.json'))
    .then(response => response.json())
    .then(settings => {
      const settingsSelect = document.getElementById('settings');
      Object.keys(settings).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        settingsSelect.appendChild(option);
      });

      settingsSelect.addEventListener('change', () => {
        const selectedSetting = settings[settingsSelect.value];
        chrome.storage.local.set({ gooseSettings: selectedSetting });
      });
    })
    .catch(error => console.error('Error loading settings:', error));

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