'use strict';

function tabCount() {
  const tabUrlCounter = {};

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const url = tab.url;
      tabUrlCounter[url] = (tabUrlCounter[url] || 0) + 1;
    });

    let duplicatedTabNum = 0;
    for (const url in tabUrlCounter) {
      duplicatedTabNum += tabUrlCounter[url] - 1;
    }

    chrome.action.setBadgeText({
      text: duplicatedTabNum > 0 ? duplicatedTabNum.toString() : '',
    });
  });
}

chrome.tabs.onCreated.addListener(tabCount);
chrome.tabs.onUpdated.addListener(tabCount);
chrome.tabs.onRemoved.addListener(tabCount);
