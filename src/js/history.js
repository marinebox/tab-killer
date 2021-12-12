'use strict';

import { getConfirmMsg } from './language.js';
import { getLocalStorage, setLocalStorage } from './utils.js';

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

  const historyListElementUl = document.getElementById('history_list');
  historyListElementUl.innerHTML = '';

  for (const [index, historyFactor] of history.reverse().entries()) {
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

    // faviconを<li>に追加
    const faviconElementImg = document.createElement('img');
    faviconElementImg.src =
      'http://favicon.hatena.ne.jp/?url=' + historyFactor.url;
    newHistoryElementLi.appendChild(faviconElementImg);

    // <a>を<li>に追加
    LinkElementA.innerHTML = hasTooltip ? title.slice(0, 50) + '...' : title;
    LinkElementA.target = '_blank';
    LinkElementA.className = 'is-flex-grow-1 mx-1';
    newHistoryElementLi.appendChild(LinkElementA);

    // <li>を<button>に追加
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    newHistoryElementLi.appendChild(deleteButton);

    // <li>を<ul>に追加
    historyListElementUl.appendChild(newHistoryElementLi);

    // delete button event listener
    deleteButton.addEventListener('click', () => {
      deleteHistory(history.length - index - 1);
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
  setLocalStorage('tabKillerHistory', history);
};

const deleteHistory = async (index) => {
  const history = (await getLocalStorage('tabKillerHistory')) || [];
  history.splice(index, 1);
  await setLocalStorage('tabKillerHistory', history);

  initHistory();
};

const allClear = async () => {
  const confirmMessage = await getConfirmMsg('historyAllClearConfirm');
  const isDelete = confirm(confirmMessage);
  if (isDelete) {
    setLocalStorage('tabKillerHistory', []);
    const historyListBoardElement = document.getElementById('history_list');
    historyListBoardElement.innerHTML = '';
  }
};
