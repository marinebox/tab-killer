"use strict";

const initLocalStorage = () => {
  chrome.storage.sync.get("tabKillerIsOverWindows", (items) => {
    console.log(items);
    if (items.tabKillerIsOverWindows === undefined) {
      chrome.storage.sync.set({ tabKillerIsOverWindows: false });
    }
    document.getElementById("target_all_windows").checked =
      items.tabKillerIsOverWindows;
  });
};

const addEventListeners = () => {
  // checkbox event
  const checkElement = document.getElementById("target_all_windows");
  checkElement.addEventListener("change", () => {
    chrome.storage.sync.set({ tabKillerIsOverWindows: checkElement.checked });
  });

  // delete duplicate tabs event
  document.getElementById("normal_action").addEventListener("click", () => {
    const isOverWindows = document.getElementById("target_all_windows").checked;
    const windowQuery = isOverWindows ? {} : { currentWindow: true };
    chrome.tabs.query(windowQuery, (tabs) => {
      tabs.map((currentTab, index) => {
        tabs.slice(index).map((targetTab) => {
          if (currentTab.id === targetTab.id) return;
          else if (currentTab.url === targetTab.url) {
            chrome.tabs.remove(targetTab.id);
          } else return;
        });
      });
    });
  });

  // keyword delete tabs event
  document.getElementById("designate_delete").addEventListener("click", () => {
    const isOverWindows = document.getElementById("target_all_windows").checked;
    const windowQuery = isOverWindows ? {} : { currentWindow: true };
    const designatedURL = document.getElementById("designate").value;
    if (designatedURL === "") {
      alert("空白を条件に指定することはできません。");
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
  document.getElementById("range_tabs").addEventListener("click", () => {
    const tabsIdUrl = [];
    const isOverWindows = document.getElementById("target_all_windows").checked;
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

const setDomainButton = () => {
  chrome.tabs.query({}, (tabs) => {
    // extract the domains
    const tabUrlCounter = {};
    tabs.forEach((tab) => {
      const url = new URL(tab.url);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
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
      const button = document.createElement("button");
      button.className = "button is-link is-outlined";
      button.id = domain;
      button.innerHTML = domain + " (" + cnt + ")";

      const parent = document.getElementById("domains");
      parent.appendChild(button);

      document.getElementById(domain).addEventListener("click", () => {
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

initLocalStorage();
setDomainButton();
addEventListeners();
