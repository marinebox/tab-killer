'use strict';

import { getConfirmMsg } from './language.js';
import { getCurrentTab, getSyncStorage, setSyncStorage } from './utils.js';

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

  // all clear event
  const allClearButton = document.getElementById('white_list_all_clear_button');
  allClearButton.addEventListener('click', allClear);
};

export const initWhiteList = async () => {
  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const whiteListBoardElement = document.getElementById('white_list');
  whiteListBoardElement.innerHTML = '';
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

  addWhiteListStorage(addingUrl);

  // clear input
  document.getElementById('white_list_input').value = '';
};

const addPresentUrlWhiteList = async () => {
  const currentTab = await getCurrentTab();
  const presentURL = new URL(currentTab.url);

  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const isDuplicate = whiteListOnStorage.includes(presentURL.href);

  if (isDuplicate) {
    alert('already exists');
    return;
  }

  addWhiteListStorage(presentURL.href);
};

const addPresentDomainWhiteList = async () => {
  const currentTab = await getCurrentTab();
  const presentURL = new URL(currentTab.url);

  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const isDuplicate = whiteListOnStorage.includes(presentURL.hostname);
  if (isDuplicate) {
    alert('already exists');
    return;
  }

  addWhiteListStorage(presentURL.hostname);
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
  setSyncStorage('tabKillerWhiteList', newWhiteList);
};

const deleteWhiteList = async (buttonElement) => {
  const parent = buttonElement.parentElement;
  parent.remove();

  // delete URL on the whitelist and renew storage
  const deleteURL = parent.id;
  const whiteListOnStorage = (await getSyncStorage('tabKillerWhiteList')) || [];
  const newWhiteList = whiteListOnStorage.filter((url) => url !== deleteURL);
  setSyncStorage('tabKillerWhiteList', newWhiteList);
};

const allClear = async () => {
  const confirmMessage = await getConfirmMsg('whiteListAllClearConfirm');
  const isDelete = confirm(confirmMessage);

  if (isDelete) {
    setSyncStorage('tabKillerWhiteList', []);
  }
};
