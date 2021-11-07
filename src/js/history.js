'use strict';

export const setHistoryEventListeners = () => {
  // make history list when history tab clicked
  document.getElementById('screen_history').addEventListener('click', () => {
    initHistory();
  });
};

export const initHistory = () => {
  chrome.storage.local.get('tabKillerHistory', (items) => {
    if (items.tabKillerHistory === undefined) return;

    const historyList = document.getElementById('history_list');
    historyList.innerHTML = '';
    const historyFactors = items.tabKillerHistory;

    for (const historyFactor of historyFactors.reverse()) {
      const newHistoryElement = document.createElement('li');
      const historyLink = document.createElement('a');
      historyLink.href = historyFactor.url;
      const title = historyFactor.title;
      const hasTooltip = title.length >= 50;

      // if title is too long, show tooltip
      if (hasTooltip) {
        newHistoryElement.dataset.tooltip = title;
      }

      historyLink.innerHTML = hasTooltip ? title.slice(0, 50) + '...' : title;
      historyLink.target = '_blank';

      newHistoryElement.appendChild(historyLink);
      historyList.appendChild(newHistoryElement);
    }
  });
};

/**
 * @param {Object} newHistoryFactors
 */
export const addHistory = (newHistoryFactors) => {
  chrome.storage.local.get('tabKillerHistory', (items) => {
    const history =
      items.tabKillerHistory === undefined ? [] : items.tabKillerHistory;
    Object.keys(newHistoryFactors).map((key) => {
      history.push({ url: key, title: newHistoryFactors[key] });
    });
    while (history.length > 50) {
      history.shift();
    }
    chrome.storage.local.set({ tabKillerHistory: history });
  });
};
