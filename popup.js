document.getElementById('normal_action').addEventListener('click', () => {
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

document.getElementById('designate_delete').addEventListener('click', () => {
    const designatedURL = document.getElementById('designate').value;
    if(designatedURL === ''){
        alert("空白を条件に指定することはできません。");
        return;
    }
    chrome.tabs.query({}, tabs => {
        tabs.map((currentTab) => {
            if(currentTab.url.match(designatedURL)){
                chrome.tabs.remove(currentTab.id)
            }
        })
    })
});