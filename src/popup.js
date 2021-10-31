'use strict';

const initLocalStorage = () => {
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
    chrome.tabs.query(windowQuery, (tabs) => {
      tabs.map((currentTab) => {
        if (currentTab.url.match(designatedURL)) {
          chrome.tabs.remove(currentTab.id);
        }
      });
    });
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
    screen_element.addEventListener('click', screenSwitcher);
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
};

const setDomainButton = () => {
  chrome.tabs.query({}, (tabs) => {
    // extract the domains
    const tabUrlCounter = {};
    tabs.forEach((tab) => {
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
        chrome.tabs.query({}, (tabs) => {
          tabs.map((currentTab) => {
            const currentTabUrl = new URL(currentTab.url);
            if (currentTabUrl.hostname === domain) {
              chrome.tabs.remove(currentTab.id);
            }
          });
          // remove button
          document.getElementById(domain).remove();
        });
      });
    }
  });
};

const screenSwitcher = () => {
  const screen_elements = document.getElementsByClassName('screen_switch');
  for (const screen_element of screen_elements) {
    const screen_id = screen_element.id;
    const parent = screen_element.parentElement;
    const block_element = document.getElementById(screen_id + '_block');
    if (parent.className.includes('is-active')) {
      parent.classList.remove('is-active');
      block_element.style.display = 'none';
    } else {
      parent.classList.add('is-active');
      block_element.style.display = 'block';
    }
  }
};

const createWhiteListBadge = (addingUrl) => {
  // create new badge
  const newWhiteElement = document.createElement('div');
  newWhiteElement.id = addingUrl;
  newWhiteElement.className =
    'is-flex is-align-items-center mb-1 white_list_card';
  newWhiteElement.innerHTML = `<span class="tag is-warning mr-2"></span>
                                <button class="delete"></button>`;
  const buttonElement = newWhiteElement.lastElementChild;
  buttonElement.addEventListener('click', () => deleteWhiteList(buttonElement));
  newWhiteElement.firstChild.innerHTML = addingUrl;

  // insert new badge
  const whiteListBoardElement = document.getElementById('white_list');
  whiteListBoardElement.appendChild(newWhiteElement);
};

const initWhiteList = () => {
  chrome.storage.sync.get('tabKillerWhiteList', (items) => {
    if (items.tabKillerWhiteList === undefined) {
      return;
    }
    for (const whiteURL of items.tabKillerWhiteList) {
      createWhiteListBadge(whiteURL);
    }
  });
};

const addWhiteList = () => {
  const addingUrl = document.getElementById('white_list_input').value;
  if (addingUrl === '') {
    alert('空白を条件に指定することはできません。');
    return;
  }
  if (addingUrl === '.' || addingUrl === '/') {
    alert('無効な文字列です。');
    return;
  }

  createWhiteListBadge(addingUrl);

  // add white list storage
  chrome.storage.sync.get('tabKillerWhiteList', (items) => {
    const whiteListOnStorage = items.tabKillerWhiteList;
    const newWhiteList =
      whiteListOnStorage === undefined ? [] : whiteListOnStorage;
    newWhiteList.push(addingUrl);
    chrome.storage.sync.set({ tabKillerWhiteList: newWhiteList });
  });

  // clear input
  document.getElementById('white_list_input').value = '';
};

const deleteWhiteList = (button_element) => {
  const parent = button_element.parentElement;
  parent.remove();

  // delete URL on the whitelist and renew storage
  const deleteURL = parent.id;
  chrome.storage.sync.get('tabKillerWhiteList', (items) => {
    const whiteListOnStorage = items.tabKillerWhiteList;
    const newWhiteList = whiteListOnStorage.filter(
      (whiteURL) => whiteURL !== deleteURL
    );
    chrome.storage.sync.set({ tabKillerWhiteList: newWhiteList });
  });
};

initLocalStorage();
initWhiteList();
setDomainButton();
addEventListeners();
