'use strict';

import {
  getAppropriateLanguageConfig,
  getLocalStorage,
  setLocalStorage
} from './utils.js';

const translateIdWord = new Map([
  [
    'target_all_windows_label',
    { en: 'Target all windows', ja: '全ウィンドウを対象' }
  ],
  ['normal_action', { en: 'Delete duplicate tabs', ja: '重複タブを削除' }],
  ['range_tabs', { en: 'Rearrange tabs', ja: 'タブを並び替える' }],
  [
    'word_delete_message',
    {
      en: 'Tabs that contain the following string in the URL',
      ja: 'URLに以下の文字列を含むタブを'
    }
  ],
  ['designate_delete', { en: 'Delete', ja: '削除' }],
  [
    'domain_delete_message',
    {
      en: 'Delete by specifying the domain (number of pages)',
      ja: 'ドメイン（ページ数）を指定して削除'
    }
  ],
  [
    'white_list_message',
    {
      en: 'You can set up a whitelist',
      ja: '消したくないタブのURLを設定できます。'
    }
  ],
  [
    'add_white_list',
    {
      en: 'Add',
      ja: '追加'
    }
  ],
  [
    'add_present_URL_whitelist',
    {
      en: 'Add present URL',
      ja: '現在のページを追加'
    }
  ],
  [
    'add_present_domain_whitelist',
    {
      en: 'Add present domain',
      ja: '現在のページのドメインを追加'
    }
  ]
]);

const placeholderIdsWord = new Map([
  ['white_list_input', { en: 'Enter URL', ja: 'URLを入力' }],
  ['designate', { en: 'URL keyword', ja: '消したいURL内のキーワード' }]
]);

export const translateConfirmWord = new Map([
  [
    'historyAllClearConfirm',
    {
      en: 'Are you sure you want to delete all history?',
      ja: '本当にすべて削除しますか？'
    }
  ],
  [
    'whiteListAllClearConfirm',
    {
      en: 'Are you sure you want to delete all whitelist?',
      ja: '本当にすべて削除しますか？'
    }
  ],
  [
    'whiteListDomainClearConfirm',
    {
      en: 'THe domain exists on whitelist.\n Are you sure close them?',
      ja: 'このドメインはホワイトリストに存在します。\n本当にタブを閉じますか？'
    }
  ]
]);

export const translateErrorWord = new Map([
  [
    'keywordCheckerEmptyError',
    {
      en: 'empty cannot be used.',
      ja: '空白を条件に指定することはできません。'
    }
  ],
  [
    'keywordCheckerInvalidStringError',
    {
      en: 'This is an invalid keyword.',
      ja: '無効な文字列です。'
    }
  ]
]);

export const initLanguage = async () => {
  const languageConfigOnStorage =
    (await getLocalStorage('tabKillerLanguage')) || 'auto';
  document
    .getElementById(`lang_${languageConfigOnStorage}`)
    .classList.add('is-active');

  const language = await getAppropriateLanguageConfig();

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

const switchDropdownActiveItems = async (element) => {
  const items = document.getElementsByClassName('language_dropdown_item');

  for (const item of items) {
    if (element.id === item.id) {
      const language = item.id.replace('lang_', '');
      setLocalStorage('tabKillerLanguage', language);
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

export const getConfirmMsg = async (key) => {
  const language = await getAppropriateLanguageConfig();
  const msg = translateConfirmWord.get(key)[language];
  return msg;
};
