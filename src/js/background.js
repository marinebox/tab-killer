'use strict';

const tabCount = () => {
  const tabUrlCounter = {};

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const url = tab.url;
      tabUrlCounter[url] = (tabUrlCounter[url] || 0) + 1;
    });

    const duplicatedTabNum = Object.values(tabUrlCounter).reduce(
      (prev, current) => prev + current - 1,
      0
    );

    chrome.action.setBadgeText({
      text: duplicatedTabNum > 0 ? duplicatedTabNum.toString() : '',
    });
  });
};

chrome.tabs.onCreated.addListener(tabCount);
chrome.tabs.onUpdated.addListener(tabCount);
chrome.tabs.onRemoved.addListener(tabCount);
