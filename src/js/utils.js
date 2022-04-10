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
 * @return {Promise<Array>} tabs object
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
 * @return {Boolean} if keyword is correct, return true, else false
 */
export const keywordChecker = async (keyword) => {
  const languageConfig = (await getLocalStorage('tabKillerLanguage')) || 'auto';
  const language =
    languageConfig === 'auto' ? chrome.i18n.getUILanguage() : languageConfig;

  let errorMsg = '';
  if (keyword === '') {
    if (language === 'ja') {
      errorMsg = '空白を条件に指定することはできません。';
    } else {
      errorMsg = 'empty cannot be used.';
    }
    alert(errorMsg);
    return false;
  } else if (keyword === '.' || keyword === '/' || keyword === ':') {
    if (language === 'ja') {
      errorMsg = '無効な文字列です。';
    } else {
      errorMsg = 'This is an invalid keyword.';
    }
    alert(errorMsg);
    return false;
  } else {
    return true;
  }
};

/**
 * @return {string} if 'ja' used, return 'ja', else 'en'.
 */
export const getAppropriateLanguageConfig = async () => {
  const languageConfig = (await getLocalStorage('tabKillerLanguage')) || 'auto';
  let language = 'en';
  if (languageConfig === 'auto') {
    const UILanguage = chrome.i18n.getUILanguage();
    if (UILanguage === 'en' || UILanguage === 'ja') {
      language = UILanguage;
    }
  } else {
    language = languageConfig;
  }
  return language;
};

/**
 * ホワイトリスト以外のタブを取得する
 * @return {Promise<Array>}
 */
export const getTabsWithoutWhiteList = async () => {
  const tabs = await getTabs();
  const whiteList = (await getSyncStorage('tabKillerWhiteList')) || [];

  return tabs.filter((tab) => !whiteList.includes(tab.url));
};
