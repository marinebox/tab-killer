'use strict';

export const getLocalStorage = (key = null) =>
  new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => resolve(data[key]));
  });

export const getSyncStorage = (key = null) =>
  new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => resolve(data[key]));
  });
