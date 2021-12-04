'use strict';

import { getLocalStorage } from './utils.js';

export const setHistoryEventListeners = () => {
  // make history list when history tab clicked
  document.getElementById('screen_history').addEventListener('click', () => {
    initHistory();
  });

  // all clear event
  const allClearButton = document.getElementById('history_all_clear_button');
  allClearButton.addEventListener('click', allClear);
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

const allClear = async () => {
  const language = (await getLocalStorage('tabKillerLanguage')) || 'ja';
  const confirmMessage =
    language === 'ja'
      ? '本当にすべて削除しますか？'
      : 'Are you sure you want to delete all history?';
  const isDelete = confirm(confirmMessage);
  if (isDelete) {
    chrome.storage.local.set({ tabKillerHistory: [] });
    const historyListBoardElement = document.getElementById('history_list');
    historyListBoardElement.innerHTML = '';
  }
};
