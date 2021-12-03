'use strict';

import { addHistory } from './history.js';
import { getAllTabs } from './utils.js';

export const initDomainButton = async () => {
  const allTabs = await getAllTabs();

  // extract the domains
  const tabUrlCounter = {};

  allTabs.forEach((tab) => {
    const url = new URL(tab.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return;
    }
    const domain = url.hostname;
    tabUrlCounter[domain] = (tabUrlCounter[domain] || 0) + 1;
  });

  // set button
  const domains = Object.keys(tabUrlCounter);
  domains.sort();
  for (const domain of domains) {
    const cnt = tabUrlCounter[domain];
    const button = document.createElement('button');
    button.className = 'button is-link is-outlined';
    button.id = domain;
    button.innerHTML = domain + ' (' + cnt + ')';

    const parent = document.getElementById('domains');
    parent.appendChild(button);

    document.getElementById(domain).addEventListener('click', () => {
      const newHistoryFactors = {};
      chrome.tabs.query({}, (tabs) => {
        tabs.map((currentTab) => {
          const currentTabUrl = new URL(currentTab.url);
          if (currentTabUrl.hostname === domain) {
            chrome.tabs.remove(currentTab.id);
            newHistoryFactors[currentTab.url] = currentTab.title;
          }
        });
        // remove button
        document.getElementById(domain).remove();
      });
      addHistory(newHistoryFactors);
    });
  }
};
