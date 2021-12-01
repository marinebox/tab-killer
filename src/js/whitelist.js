'use strict';

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

export const initWhiteList = () => {
  chrome.storage.sync.get('tabKillerWhiteList', (items) => {
    if (items.tabKillerWhiteList === undefined) return;

    for (const whiteURL of items.tabKillerWhiteList) {
      createWhiteListBadge(whiteURL);
    }
  });
};

const addWhiteList = () => {
  const addingUrl = document.getElementById('white_list_input').value;
  if (addingUrl === '') {
    alert('空白を条件に指定することはできません。');
    return;
  }
  if (addingUrl === '.' || addingUrl === '/') {
    alert('無効な文字列です。');
    return;
  }

  createWhiteListBadge(addingUrl);
  addWhiteListStorage(addingUrl);

  // clear input
  document.getElementById('white_list_input').value = '';
};

const addPresentUrlWhiteList = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const presentURL = new URL(tabs[0].url);
    createWhiteListBadge(presentURL.href);
    addWhiteListStorage(presentURL.href);
  });
};

const addPresentDomainWhiteList = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const presentURL = new URL(tabs[0].url);
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

const addWhiteListStorage = (addingUrl) => {
  // add new URL white list on storage
  chrome.storage.sync.get('tabKillerWhiteList', (items) => {
    const whiteListOnStorage = items.tabKillerWhiteList;
    const newWhiteList =
      whiteListOnStorage === undefined ? [] : whiteListOnStorage;
    newWhiteList.push(addingUrl);
    chrome.storage.sync.set({ tabKillerWhiteList: newWhiteList });
  });
};

const deleteWhiteList = (buttonElement) => {
  const parent = buttonElement.parentElement;
  parent.remove();

  // delete URL on the whitelist and renew storage
  const deleteURL = parent.id;
  chrome.storage.sync.get('tabKillerWhiteList', (items) => {
    const whiteListOnStorage = items.tabKillerWhiteList;
    const newWhiteList =
      whiteListOnStorage === undefined
        ? []
        : whiteListOnStorage.filter((whiteURL) => whiteURL !== deleteURL);
    chrome.storage.sync.set({ tabKillerWhiteList: newWhiteList });
  });
};

const allClear = () => {
  chrome.storage.sync.set({ tabKillerWhiteList: [] });
  const whiteListBoardElement = document.getElementById('white_list');
  whiteListBoardElement.innerHTML = '';
};
