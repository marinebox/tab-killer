'use strict';

import { initDomainButton } from './domain.js';
import {
  addHistory,
  initHistory,
  setHistoryEventListeners
} from './history.js';
import { initLanguage, setLanguageEventListeners } from './language.js';
import { setScreenSwitchEventListeners } from './screenSwitch.js';
import {
  getStorage,
  getTabs,
  getTabsNotInWhiteList,
  keywordChecker,
  setStorage
} from './utils.js';
import { initWhiteList, setWhiteListEventListeners } from './whitelist.js';

const initKillOverWindow = async () => {
  const isKillOverWindow =
    (await getStorage('tabKillerIsOverWindows')) || false;
  setStorage('tabKillerIsOverWindows', isKillOverWindow);
  document.getElementById('target_all_windows').checked = isKillOverWindow;
};

const setCheckboxEventListener = () => {
  const checkElement = document.getElementById('target_all_windows');
  checkElement.addEventListener('change', async () => {
    setStorage('tabKillerIsOverWindows', checkElement.checked);
  });
};

const setDeleteDuplicateTabsEventListener = () => {
  document
    .getElementById('normal_action')
    .addEventListener('click', async () => {
      const tabs = await getTabsNotInWhiteList();

      tabs.sort((a, b) => {
        return b.active - a.active;
      });

      const urlSet = new Set(tabs.map((tab) => tab.url));
      const urlAlreadyExistFlagMap = {};
      urlSet.forEach((url) => (urlAlreadyExistFlagMap[url] = false));
      tabs.map((tab) => {
        if (urlAlreadyExistFlagMap[tab.url] === false) {
          urlAlreadyExistFlagMap[tab.url] = true;
        } else {
          chrome.tabs.remove(tab.id);
        }
      });
    });
};

const setKeywordDeleteTabsEventListener = () => {
  document
    .getElementById('designate_delete')
    .addEventListener('click', async () => {
      const tabs = await getTabsNotInWhiteList();
      const designatedURL = document.getElementById('designate').value;
      const newHistoryFactors = {};
      const keywordCheckerResult = await keywordChecker(designatedURL);

      if (keywordCheckerResult) {
        tabs.map((currentTab) => {
          if (currentTab.url.match(designatedURL)) {
            chrome.tabs.remove(currentTab.id);
            newHistoryFactors[currentTab.url] = currentTab.title;
          }
        });

        addHistory(newHistoryFactors);
      }
    });
};

const setDomainArrangementEventListener = () => {
  document.getElementById('range_tabs').addEventListener('click', async () => {
    const tabsIdUrl = [];
    const tabs = await getTabs();
    tabs.map((tab) => {
      const url = tab.url;
      const id = tab.id;
      tabsIdUrl.push({ id, url });
    });
    tabsIdUrl.sort((a, b) => {
      return a.url > b.url ? 1 : -1;
    });
    chrome.tabs.move(
      tabsIdUrl.map((tab) => tab.id),
      { index: 0 }
    );
  });
};

const setTooltipOnDeleteDuplicateTabsEventListener = () => {
  document
    .getElementById('normal_action')
    .addEventListener('mouseover', async () => {
      const tabs = await getTabs();
      const urlCounter = {};
      const urlTitleDictionary = {};

      tabs.map((currentTab) => {
        const title = currentTab.title;
        const url = new URL(currentTab.url);
        urlCounter[url.href] = (urlCounter[url.href] || 0) + 1;
        urlTitleDictionary[url.href] = title;
      });

      const urlKeys = Object.keys(urlCounter);
      urlKeys.sort();

      const duplicates = [];
      urlKeys.forEach((url) => {
        if (urlCounter[url] > 1) {
          duplicates.push({
            url: url,
            title: urlTitleDictionary[url],
            count: urlCounter[url]
          });
        }
      });

      const normalButton = document.getElementById('normal_action');
      let isFirstLine = true;
      let titleString = '';
      duplicates.forEach((value) => {
        if (isFirstLine) {
          titleString = value['title'] + ': ' + value['count'];
          isFirstLine = false;
        } else {
          titleString += '\n' + value['title'] + ': ' + value['count'];
        }
      });
      normalButton.title = titleString;
    });
};

const setChromeStorageOnChangedEventListener = () => {
  chrome.storage.onChanged.addListener((changes) => {
    const changedStorageKeys = Object.keys(changes);
    for (const key of changedStorageKeys) {
      switch (key) {
        case 'tabKillerIsOverWindows':
          initDomainButton();
          initKillOverWindow();
          break;
        case 'tabKillerWhiteList':
          initWhiteList();
          break;
        case 'tabKillerHistory':
          initHistory();
          break;
        case 'tabKillerLanguage':
          initLanguage();
          break;
      }
    }
  });
};

const addEventListeners = () => {
  setLanguageEventListeners();
  setWhiteListEventListeners();
  setHistoryEventListeners();
  setScreenSwitchEventListeners();

  setCheckboxEventListener();
  setDeleteDuplicateTabsEventListener();
  setKeywordDeleteTabsEventListener();
  setDomainArrangementEventListener();
  setTooltipOnDeleteDuplicateTabsEventListener();

  setChromeStorageOnChangedEventListener();
};

const initialize = () => {
  initLanguage();
  initKillOverWindow();
  initWhiteList();
  initDomainButton();
  addEventListeners();
};

initialize();
