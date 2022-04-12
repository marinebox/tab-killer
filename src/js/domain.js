'use strict';

import { addHistory } from './history.js';
import {
  getAllTabs,
  getSyncStorage,
  getTabsOnActiveWindow,
  getTabsWithoutWhiteList
} from './utils.js';

export const initDomainButton = async () => {
  const isOverWindows =
    (await getSyncStorage('tabKillerIsOverWindows')) || false;
  const allTabs = isOverWindows
    ? await getAllTabs()
    : await getTabsOnActiveWindow();

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
  const parent = document.getElementById('domains');
  parent.innerHTML = '';
  for (const domain of domains) {
    const cnt = tabUrlCounter[domain];

    // faviconを<li>に追加
    const faviconElementImg = document.createElement('img');
    faviconElementImg.src = 'http://favicon.yandex.net/favicon/' + domain;
    faviconElementImg.style.width = '16px';
    faviconElementImg.style.marginRight = '4px';

    const button = document.createElement('button');
    button.className = 'button is-link is-outlined';
    button.id = domain;

    button.appendChild(faviconElementImg);
    button.innerHTML = button.innerHTML + '&nbsp;' + domain + ' (' + cnt + ')';

    parent.appendChild(button);

    document.getElementById(domain).addEventListener('click', async () => {
      const newHistoryFactors = {};

      const tabs = await getTabsWithoutWhiteList();
      tabs.map((currentTab) => {
        const currentTabUrl = new URL(currentTab.url);
        if (currentTabUrl.hostname === domain) {
          chrome.tabs.remove(currentTab.id);
          newHistoryFactors[currentTab.url] = currentTab.title;
        }
      });
      // remove button
      const whiteList = (await getSyncStorage('tabKillerWhiteList')) || [];
      if (!whiteList.includes(domain)) {
        document.getElementById(domain).remove();
        addHistory(newHistoryFactors);
      }
    });
  }
};
