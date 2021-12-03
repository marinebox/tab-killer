'use strict';

import { getLocalStorage } from './utils.js';

const translateIdWord = new Map([
  [
    'target_all_windows_label',
    { en: 'Target all windows', ja: '全ウィンドウを対象' },
  ],
  ['normal_action', { en: 'Delete duplicate tabs', ja: '重複タブを削除' }],
  ['range_tabs', { en: 'Rearrange tabs', ja: 'タブを並び替える' }],
  [
    'word_delete_message',
    {
      en: 'Tabs that contain the following string in the URL',
      ja: 'URLに以下の文字列を含むタブを',
    },
  ],
  ['designate_delete', { en: 'Delete', ja: '削除' }],
  [
    'domain_delete_message',
    {
      en: 'Delete by specifying the domain (number of pages)',
      ja: 'ドメイン（ページ数）を指定して削除',
    },
  ],
  [
    'white_list_message',
    {
      en: 'You can set up a whitelist',
      ja: '消したくないタブのURLを設定できます。',
    },
  ],
  [
    'add_white_list',
    {
      en: 'Add',
      ja: '追加',
    },
  ],
  [
    'add_present_URL_whitelist',
    {
      en: 'Add present URL',
      ja: '現在のページを追加',
    },
  ],
  [
    'add_present_domain_whitelist',
    {
      en: 'Add present domain',
      ja: '現在のページのドメインを追加',
    },
  ],
]);

const placeholderIdsWord = new Map([
  ['white_list_input', { en: 'Enter URL', ja: 'URLを入力' }],
  ['designate', { en: 'URL keyword', ja: '消したいURL内のキーワード' }],
]);

export const initLanguage = async () => {
  const defaultLanguage = chrome.i18n.getUILanguage();
  const language =
    (await getLocalStorage('tabKillerLanguage')) || defaultLanguage;
  document.getElementById(`lang_${language}`).classList.add('is-active');

  // translate
  translateIdWord.forEach((value, key) => {
    const element = document.getElementById(key);
    if (element === null) return;
    element.innerText = value[language];
  });
  placeholderIdsWord.forEach((value, key) => {
    const element = document.getElementById(key);
    if (element === null) return;

    element.placeholder = value[language];
  });
};

const switchDropdownActiveItems = (element) => {
  const items = document.getElementsByClassName('language_dropdown_item');

  for (const item of items) {
    if (element.id === item.id) {
      item.classList.add('is-active');
      const languageConfig = item.id.replace('lang_', '');
      const defaultLanguage = chrome.i18n.getUILanguage();
      const language =
        languageConfig === 'auto' ? defaultLanguage : languageConfig;
      chrome.storage.local.set({ tabKillerLanguage: language });
      initLanguage();
    } else {
      item.classList.remove('is-active');
    }
  }
};

const dropdownOpenClose = () => {
  const dropdown = document.getElementById('language_dropdown');
  const isOpen = dropdown.classList.contains('is-active');

  if (isOpen) {
    dropdown.classList.remove('is-active');
  } else {
    dropdown.classList.add('is-active');
  }
};

export const setLanguageEventListeners = () => {
  // dropdown open close event
  const languageDropdown = document.getElementById('language_dropdown');
  languageDropdown.addEventListener('click', dropdownOpenClose);

  // language change event
  const languageDropdownItems = document.getElementsByClassName(
    'language_dropdown_item'
  );
  for (const languageDropdownItem of languageDropdownItems) {
    languageDropdownItem.addEventListener('click', () => {
      switchDropdownActiveItems(languageDropdownItem);
    });
  }
};
