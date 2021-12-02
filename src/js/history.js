'use strict';

import { getLocalStorage } from './utils.js';

export const setHistoryEventListeners = () => {
  // make history list when history tab clicked
  document.getElementById('screen_history').addEventListener('click', () => {
    initHistory();
  });
};

export const initHistory = async () => {
  const history = (await getLocalStorage('tabKillerHistory')) || [];
  if (history.length === 0) return;

  const historyList = document.getElementById('history_list');
  historyList.innerHTML = '';

  for (const historyFactor of history.reverse()) {
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
};

/**
 * @param {Object} newHistoryFactors
 */
export const addHistory = async (newHistoryFactors) => {
  const history = (await getLocalStorage('tabKillerHistory')) || [];

  Object.keys(newHistoryFactors).map((key) => {
    history.push({ url: key, title: newHistoryFactors[key] });
  });
  while (history.length > 50) {
    history.shift();
  }
  chrome.storage.local.set({ tabKillerHistory: history });
};
