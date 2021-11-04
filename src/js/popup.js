'use strict';

import { setDomainButton } from './domain.js';
import { addHistory, initHistory } from './history.js';
import { addWhiteList, deleteWhiteList, initWhiteList } from './whitelist.js';

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

  // domain delete tabs event
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

  // screen switch event
  const screen_elements = document.getElementsByClassName('screen_switch');
  for (const screen_element of screen_elements) {
    screen_element.addEventListener('click', () =>
      screenSwitcher(screen_element)
    );
  }

  // add white list event
  document
    .getElementById('add_white_list')
    .addEventListener('click', addWhiteList);

  // delete white list event
  const white_list_elements = document.getElementById('white_list');
  for (const white_list_element of white_list_elements.children) {
    const buttonElement = white_list_element.lastElementChild;
    buttonElement.addEventListener('click', () =>
      deleteWhiteList(buttonElement)
    );
  }

  // make history list when history tab clicked
  document.getElementById('screen_history').addEventListener('click', () => {
    initHistory();
  });
};

const screenSwitcher = (clicked_element) => {
  const screen_elements = document.getElementsByClassName('screen_switch');
  for (const screen_element of screen_elements) {
    const screen_id = screen_element.id;
    const parent = screen_element.parentElement;
    const block_element = document.getElementById(screen_id + '_block');
    if (clicked_element.id === screen_id) {
      parent.classList.add('is-active');
      block_element.style.display = 'block';
    } else {
      parent.classList.remove('is-active');
      block_element.style.display = 'none';
    }
  }
};

initKillOverWindow();
initWhiteList();
setDomainButton();
addEventListeners();
