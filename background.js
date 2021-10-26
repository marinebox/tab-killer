function tabCount() {
  const tabUrlCounter = {};

  chrome.tabs.query({}, tabs => {
    
    tabs.forEach(tab => {
      const url = tab.url;
      tabUrlCounter[url] = (tabUrlCounter[url] || 0) + 1;
    });

    let deplicatedTabNum = 0;
    for (const url in tabUrlCounter) {
      deplicatedTabNum += tabUrlCounter[url] - 1;
    };

    chrome.action.setBadgeText({ text: deplicatedTabNum > 0 ? deplicatedTabNum.toString() : '' });
  });
}

setInterval(tabCount, 1000);
