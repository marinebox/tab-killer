'use strict';

import { addHistory } from './history.js';
import { getConfirmMsg } from './language.js';
import {
  getAllTabs,
  getStorage,
  getTabsOnActiveWindow,
  getTabsNotInWhiteList
} from './utils.js';

export const initDomainButton = async () => {
  const isOverWindows = (await getStorage('tabKillerIsOverWindows')) || false;
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
      const whiteList = (await getStorage('tabKillerWhiteList')) || [];

      let isForceDelete = false;

      if (whiteList.includes(domain)) {
        const confirmMessage = await getConfirmMsg(
          'DomainRemoveInWhiteListConfirm'
        );
        isForceDelete = confirm(confirmMessage);
        if (isForceDelete === false) return;
      }

      const tabs = isForceDelete
        ? await getAllTabs()
        : await getTabsNotInWhiteList();

      tabs.map((currentTab) => {
        const currentTabUrl = new URL(currentTab.url);
        if (currentTabUrl.hostname === domain) {
          chrome.tabs.remove(currentTab.id);
          newHistoryFactors[currentTab.url] = currentTab.title;
        }
      });

      document.getElementById(domain).remove();
      addHistory(newHistoryFactors);
    });
  }
};
