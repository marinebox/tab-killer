'use strict';

const getAllTabs = () =>
  new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => resolve(tabs));
  });

const getTabsOnActiveWindow = () =>
  new Promise((resolve) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => resolve(tabs));
  });

const getSyncStorage = (key = null) =>
  new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => resolve(data[key]));
  });

const tabCloser = async (tabs) => {
  const whiteList = (await getSyncStorage('tabKillerWhiteList')) || [];
  tabs.map((currentTab, index) => {
    tabs
      .slice(index)
      .filter((targetTab) => targetTab.id !== currentTab.id)
      .filter((targetTab) => targetTab.url === currentTab.url)
      .filter((targetTab) => !whiteList.includes(targetTab.url))
      .map((targetTab) => chrome.tabs.remove(targetTab.id));
  });
  return;
};

const tabCount = async () => {
  const allTabs = await getAllTabs();
  const allTabsUrl = allTabs.map((tab) => tab.url);
  const allTabsUrlSet = new Set(allTabsUrl);
  const duplicatedTabNum = allTabsUrl.length - allTabsUrlSet.size;

  chrome.action.setBadgeText({
    text: duplicatedTabNum > 0 ? duplicatedTabNum.toString() : ''
  });
};

chrome.tabs.onCreated.addListener(tabCount);
chrome.tabs.onUpdated.addListener(tabCount);
chrome.tabs.onRemoved.addListener(tabCount);

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case 'closeDuplicateTabs':
      tabCloser(await getTabsOnActiveWindow());
      break;
    case 'closeDuplicateTabsOnAllWindows':
      tabCloser(await getAllTabs());
      break;
    default:
      break;
  }
});
