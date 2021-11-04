'use strict';

import { initDomainButton, setDomainEventListeners } from './domain.js';
import { addHistory, setHistoryEventListeners } from './history.js';
import { setScreenSwitchEventListeners } from './screenSwitch.js';
import { initWhiteList, setWhiteListEventListeners } from './whitelist.js';

const initKillOverWindow = () => {
  chrome.storage.sync.get('tabKillerIsOverWindows', (items) => {
    if (items.tabKillerIsOverWindows === undefined) {
      chrome.storage.sync.set({ tabKillerIsOverWindows: false });
    }
    document.getElementById('target_all_windows').checked =
      items.tabKillerIsOverWindows;
  });
};

const addEventListeners = () => {
  setWhiteListEventListeners();
  setDomainEventListeners();
  setHistoryEventListeners();
  setScreenSwitchEventListeners();

  // checkbox event
  const checkElement = document.getElementById('target_all_windows');
  checkElement.addEventListener('change', () => {
    chrome.storage.sync.set({ tabKillerIsOverWindows: checkElement.checked });
  });

  // delete duplicate tabs event
  document.getElementById('normal_action').addEventListener('click', () => {
    const isOverWindows = document.getElementById('target_all_windows').checked;
    const windowQuery = isOverWindows ? {} : { currentWindow: true };
    chrome.storage.sync.get('tabKillerWhiteList', (items) => {
      const whiteList = items.tabKillerWhiteList;
      chrome.tabs.query(windowQuery, (tabs) => {
        tabs.map((currentTab, index) => {
          tabs
            .slice(index)
            .filter((targetTab) => targetTab.id !== currentTab.id)
            .filter((targetTab) => targetTab.url === currentTab.url)
            .filter((targetTab) => !whiteList.includes(targetTab.url))
            .map((targetTab) => chrome.tabs.remove(targetTab.id));
        });
      });
    });
  });

  // keyword delete tabs event
  document.getElementById('designate_delete').addEventListener('click', () => {
    const isOverWindows = document.getElementById('target_all_windows').checked;
    const windowQuery = isOverWindows ? {} : { currentWindow: true };
    const designatedURL = document.getElementById('designate').value;
    if (designatedURL === '') {
      alert('空白を条件に指定することはできません。');
      return;
    }
    const newHistoryFactors = {};
    chrome.tabs.query(windowQuery, (tabs) => {
      tabs.map((currentTab) => {
        if (currentTab.url.match(designatedURL)) {
          chrome.tabs.remove(currentTab.id);
          newHistoryFactors[currentTab.url] = currentTab.title;
        }
      });
    });
    addHistory(newHistoryFactors);
  });
};

initKillOverWindow();
initWhiteList();
initDomainButton();
addEventListeners();
