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
});
