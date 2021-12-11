'use strict';

/**
 * @param  {string} key
 * @return {Promise} local storage object
 */
export const getLocalStorage = (key = null) =>
  new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => resolve(data[key]));
  });

/**
 * @param  {string} key
 * @param  {Object} value
 * @return {Promise} local storage object
 */
export const setLocalStorage = (key, value) =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve());
  });

/**
 * @param  {string} key
 * @param  {Object} value
 * @return {Promise} sync storage object
 */
export const setSyncStorage = (key, value) =>
  new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => resolve());
  });

/**
 * @param  {string} key
 * @return {Promise} sync storage object
 */
export const getSyncStorage = (key = null) =>
  new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => resolve(data[key]));
  });

/**
 * @return {Promise<Array>} All tabs
 */
export const getAllTabs = () =>
  new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => resolve(tabs));
  });

/**
 * @return {Promise<Array>} tabs on active window
 */
export const getTabsOnActiveWindow = () =>
  new Promise((resolve) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => resolve(tabs));
  });

/**
 * @returns {Promise<Array>} tabs object
 */
export const getTabs = async () => {
  const isOverWindows =
    (await getSyncStorage('tabKillerIsOverWindows')) || false;
  const tabs = isOverWindows
    ? await getAllTabs()
    : await getTabsOnActiveWindow();
  return tabs;
};

/**
 * @return {Promise<Object>} current tab
 */
export const getCurrentTab = () =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      resolve(tabs[0])
    );
  });

/**
 * @param {string} keyword
 * @returns {Boolean} if keyword is correct, return true, else false
 */
export const stringJudger = (keyword) => {
  if (keyword === '') {
    alert('空白を条件に指定することはできません。');
    return false;
  } else if (keyword === '.' || keyword === '/' || keyword === ':') {
    alert('無効な文字列です。');
    return false;
  } else {
    return true;
  }
};
