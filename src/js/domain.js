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

    // faviconを<li>に追加
    const faviconElementImg = document.createElement('img');
    faviconElementImg.src =
      'http://www.google.com/s2/favicons?domain=' + domain;

    const button = document.createElement('button');
    button.className = 'button is-link is-outlined';
    button.id = domain;

    button.appendChild(faviconElementImg);
    button.innerHTML = button.innerHTML + '&nbsp;' + domain + ' (' + cnt + ')';

    const parent = document.getElementById('domains');
    parent.appendChild(button);

    document.getElementById(domain).addEventListener('click', async () => {
      const newHistoryFactors = {};

      const allTabs = await getAllTabs();
      allTabs.map((currentTab) => {
        const currentTabUrl = new URL(currentTab.url);
        if (currentTabUrl.hostname === domain) {
          chrome.tabs.remove(currentTab.id);
          newHistoryFactors[currentTab.url] = currentTab.title;
        }
      });
      // remove button
      document.getElementById(domain).remove();

      addHistory(newHistoryFactors);
    });
  }
};
