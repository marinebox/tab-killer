import { filterTabsWhichIsNotInWhiteList } from '../src/js/utils.js';

describe('test_filterTabsWhichIsNotInWhiteList', () => {
  test('ホワイトリストに入ったドメインは除かれる', () => {
    const whiteList = ['example.com'];
    const tabs = [
      {
        url: 'https://example.com/hoge'
      }
    ];

    const filteredTabs = filterTabsWhichIsNotInWhiteList(tabs, whiteList);
    expect(filteredTabs).toStrictEqual([]);
  });

  test('ホワイトリストに入っていないドメインは除かれない', () => {
    const whiteList = ['example.com'];
    const tabs = [
      {
        url: 'https://google.com/hoge'
      }
    ];

    const filteredTabs = filterTabsWhichIsNotInWhiteList(tabs, whiteList);
    expect(filteredTabs).toStrictEqual(tabs);
  });

  test('ホワイトリストに入っているURLは除かれる', () => {
    const whiteList = ['https://example.com/'];
    const tabs = [
      {
        url: 'https://example.com'
      }
    ];

    const filteredTabs = filterTabsWhichIsNotInWhiteList(tabs, whiteList);
    expect(filteredTabs).toStrictEqual([]);
  });

  test('ホワイトリストに入っていないURLは除かれない', () => {
    const whiteList = [];
    const tabs = [
      {
        url: 'https://example.com'
      }
    ];

    const filteredTabs = filterTabsWhichIsNotInWhiteList(tabs, whiteList);
    expect(filteredTabs).toStrictEqual(tabs);
  });
});
