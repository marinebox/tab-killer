
const initLocalStorage = () => {
    const isOverWindows = JSON.parse(localStorage.getItem('tabKillerIsOverWindows'));
    if (isOverWindows === null) {
        localStorage.setItem('tabKillerIsOverWindows', false);
    }
    document.getElementById('target_all_windows').checked = isOverWindows;
}
initLocalStorage();

const checkElement = document.getElementById('target_all_windows');
checkElement.addEventListener('change', () => {
    localStorage.setItem('tabKillerIsOverWindows', checkElement.checked);
});

document.getElementById('normal_action').addEventListener('click', () => {
    const isOverWindows = document.getElementById('target_all_windows').checked;
    const windowQuery = isOverWindows ? {} : {currentWindow: true};
    chrome.tabs.query(windowQuery, tabs => {
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
    const isOverWindows = document.getElementById('target_all_windows').checked;
    const windowQuery = isOverWindows ? {} : {currentWindow: true};
    const designatedURL = document.getElementById('designate').value;
    if(designatedURL === ''){
        alert("空白を条件に指定することはできません。");
        return;
    }
    chrome.tabs.query(windowQuery, tabs => {
        tabs.map((currentTab) => {
            if(currentTab.url.match(designatedURL)){
                chrome.tabs.remove(currentTab.id)
            }
        })
    })
});
