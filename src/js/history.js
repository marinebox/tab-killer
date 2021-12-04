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

  const historyListElementUl = document.getElementById('history_list');
  historyListElementUl.innerHTML = '';

  for (const historyFactor of history.reverse()) {
    const newHistoryElementLi = document.createElement('li');
    newHistoryElementLi.className =
      'is-flex is-align-items-center is-justify-content-space-between px-3';

    const LinkElementA = document.createElement('a');
    LinkElementA.href = historyFactor.url;
    const title = historyFactor.title;
    const hasTooltip = title.length >= 50;

    // if title is too long, show tooltip
    if (hasTooltip) {
      newHistoryElementLi.dataset.tooltip = title;
    }

    // <a>を<li>に追加
    LinkElementA.innerHTML = hasTooltip ? title.slice(0, 50) + '...' : title;
    LinkElementA.target = '_blank';
    LinkElementA.className = 'is-flex-grow-1';
    newHistoryElementLi.appendChild(LinkElementA);

    // <li>を<button>に追加
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    newHistoryElementLi.appendChild(deleteButton);

    // <li>を<ul>に追加
    historyListElementUl.appendChild(newHistoryElementLi);

    // delete button event listener
    deleteButton.addEventListener('click', () => {
      deleteHistory(historyFactor);
    });
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

const deleteHistory = async (historyFactor) => {
  const history = (await getLocalStorage('tabKillerHistory')) || [];
  history.splice(history.indexOf(historyFactor), 1);
  chrome.storage.local.set({ tabKillerHistory: history });

  await initHistory();
};
