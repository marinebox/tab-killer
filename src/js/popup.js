'use strict';

import { initDomainButton } from './domain.js';
import { addHistory } from './history.js';
import { setScreenSwitchEventListeners } from './screenSwitch.js';
import { initWhiteList, setWhiteListEventListeners } from './whitelist.js';

const initKillOverWindow = () => {
  chrome.storage.sync.get('tabKillerIsOverWindows', (items) => {
    const isKillOverWindow =
      items.tabKillerIsOverWindows === undefined
        ? false
        : items.tabKillerIsOverWindows;

    chrome.storage.sync.set({ tabKillerIsOverWindows: isKillOverWindow });
    document.getElementById('target_all_windows').checked = isKillOverWindow;
  });
};

const addEventListeners = () => {
  setWhiteListEventListeners();
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

  // domain arrangement
  document.getElementById('range_tabs').addEventListener('click', () => {
    const tabsIdUrl = [];
    const isOverWindows = document.getElementById('target_all_windows').checked;
    const windowQuery = isOverWindows ? {} : { currentWindow: true };
    chrome.tabs.query(windowQuery, (tabs) => {
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
  });
};

initKillOverWindow();
initWhiteList();
initDomainButton();
addEventListeners();
