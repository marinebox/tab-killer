'use strict';

import { getLocalStorage, getSyncStorage } from './utils.js';

export const setWhiteListEventListeners = () => {
  // add white list event
  document
    .getElementById('add_white_list')
    .addEventListener('click', addWhiteList);

  // add present url whitelist event
  document
    .getElementById('add_present_URL_whitelist')
    .addEventListener('click', addPresentUrlWhiteList);

  // add present domain whitelist event
  document
    .getElementById('add_present_domain_whitelist')
    .addEventListener('click', addPresentDomainWhiteList);

  // delete white list event
  const whiteListElements = document.getElementById('white_list');
  for (const whiteListElement of whiteListElements.children) {
    const buttonElement = whiteListElement.lastElementChild;
    buttonElement.addEventListener('click', () =>
      deleteWhiteList(buttonElement)
    );
  }

  const allClearButton = document.getElementById('all_clear_button');
  allClearButton.addEventListener('click', allClear);
};

export const initWhiteList = async () => {
  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  for (const whiteURL of whiteListOnStorage) {
    createWhiteListBadge(whiteURL);
  }
};

const addWhiteList = async () => {
  const addingUrl = document.getElementById('white_list_input').value;
  if (addingUrl === '') {
    alert('空白を条件に指定することはできません。');
    return;
  }
  if (addingUrl === '.' || addingUrl === '/') {
    alert('無効な文字列です。');
    return;
  }

  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const isDuplicate = whiteListOnStorage.includes(addingUrl);

  if (isDuplicate) {
    alert('already exists');
    return;
  }

  createWhiteListBadge(addingUrl);
  addWhiteListStorage(addingUrl);

  // clear input
  document.getElementById('white_list_input').value = '';
};

const addPresentUrlWhiteList = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const presentURL = new URL(tabs[0].url);

    const whiteListOnStorage =
      (await getSyncStorage('tabKillerWhiteList')) || [];
    const isDuplicate = whiteListOnStorage.includes(presentURL.href);

    if (isDuplicate) {
      alert('already exists');
      return;
    }

    createWhiteListBadge(presentURL.href);
    addWhiteListStorage(presentURL.href);
  });
};

const addPresentDomainWhiteList = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const presentURL = new URL(tabs[0].url);

    const whiteListOnStorage =
      (await getSyncStorage('tabKillerWhiteList')) || [];
    const isDuplicate = whiteListOnStorage.includes(presentURL.hostname);
    if (isDuplicate) {
      alert('already exists');
      return;
    }
    createWhiteListBadge(presentURL.hostname);
    addWhiteListStorage(presentURL.hostname);
  });
};

const createWhiteListBadge = (addingUrl) => {
  // create new badge
  const newWhiteElement = document.createElement('div');
  newWhiteElement.id = addingUrl;
  newWhiteElement.className =
    'is-flex is-align-items-center mb-1 white_list_card';
  newWhiteElement.innerHTML = `<span class="tag is-warning mr-2"></span>
                                <button class="delete"></button>`;
  const buttonElement = newWhiteElement.lastElementChild;
  buttonElement.addEventListener('click', () => deleteWhiteList(buttonElement));
  newWhiteElement.firstChild.innerHTML = addingUrl;

  // insert new badge
  const whiteListBoardElement = document.getElementById('white_list');
  whiteListBoardElement.appendChild(newWhiteElement);
};

const addWhiteListStorage = async (addingUrl) => {
  // add new URL white list on storage
  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const newWhiteList = [...whiteListOnStorage, addingUrl];
  chrome.storage.sync.set({ tabKillerWhiteList: newWhiteList });
};

const deleteWhiteList = async (buttonElement) => {
  const parent = buttonElement.parentElement;
  parent.remove();

  // delete URL on the whitelist and renew storage
  const deleteURL = parent.id;
  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const newWhiteList = whiteListOnStorage.filter((url) => url !== deleteURL);
  chrome.storage.sync.set({ tabKillerWhiteList: newWhiteList });
};

const allClear = async () => {
  const language = (await getLocalStorage('tabKillerLanguage')) || 'ja';
  const confirmMessage =
    language === 'ja' ? '本当にすべて削除しますか？' : 'Can I delete All?';
  const isDelete = confirm(confirmMessage);

  if (isDelete) {
    chrome.storage.sync.set({ tabKillerWhiteList: [] });
    const whiteListBoardElement = document.getElementById('white_list');
    whiteListBoardElement.innerHTML = '';
  }
};
