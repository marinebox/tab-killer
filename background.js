(() => {
    chrome.browserAction.onClicked.addListener(() => {
        chrome.tabs.query({}, tabs => {
            tabs.map((currentTab, index) => {
                tabs.slice(index).map(targetTab => {
                    if(currentTab.id === targetTab.id) return;
                    else if(currentTab.url === targetTab.url){
                        chrome.tabs.remove(targetTab.id);
                    }
                    else return;
                });
            });
        });
    });
})();
