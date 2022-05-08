'use strict';

const keyMap = {
  tabKillerHistory: 'local',
  tabKillerIsOverWindows: 'sync',
  tabKillerLanguage: 'local',
  tabKillerWhiteList: 'sync'
};

/**
 * @param  {('tabKillerHistory'|'tabKillerIsOverWindows'|'tabKillerLanguage'|'tabKillerWhiteList')} key a key of chrome.storage
 * @param  {Object} value a value of chrome.storage
 * @return {Promise} sync storage object
 * @throws {Error} Unknown key is used
 */
export const setStorage = (key, value) => {
  const keyType = keyMap[key];
  if (keyType === 'local') {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  } else if (keyType === 'sync') {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => resolve());
    });
  } else {
    throw new Error(`Unknown key: ${key}`);
  }
};

/**
 * @param  {('tabKillerHistory'|'tabKillerIsOverWindows'|'tabKillerLanguage'|'tabKillerWhiteList')} [key=null] a key of chrome.storage. Default key is 'null'.
 * @return {Promise} sync storage object
 * @throws {Error} Unknown key is used
 */
export const getStorage = (key = null) => {
  const keyType = keyMap[key];
  if (keyType === 'local') {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (data) => resolve(data[key]));
    });
  } else if (keyType === 'sync') {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (data) => resolve(data[key]));
    });
  } else {
    throw new Error(`Unknown key: ${key}`);
  }
};

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
  const isOverWindows = (await getStorage('tabKillerIsOverWindows')) || false;
  const tabs = isOverWindows
    ? await getAllTabs()
    : await getTabsOnActiveWindow();
  return tabs;
};

export const filterTabsWhichIsNotInWhiteList = (tabs, whiteList) => {
  const domainReg = /^https?:\/\/.+/;
  const whiteListDomains = whiteList.filter((w) => !domainReg.test(w));

  return tabs
    .filter((t) => {
      return !whiteListDomains.some((d) => {
        const domainMatchReg = new RegExp('^(' + d + '|.+.' + d + ')$');
        return domainMatchReg.test(new URL(t.url).hostname);
      });
    })
    .filter((t) => !whiteList.includes(new URL(t.url).href));
};

/**
 * @return {Promise<Array>} tabs object
 */
export const getTabsNotInWhiteList = async () => {
  const tabs = await getTabs();
  const whiteList = (await getStorage('tabKillerWhiteList')) || [];

  return filterTabsWhichIsNotInWhiteList(tabs, whiteList);
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
  const languageConfig = (await getStorage('tabKillerLanguage')) || 'auto';
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
  const languageConfig = (await getStorage('tabKillerLanguage')) || 'auto';
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
