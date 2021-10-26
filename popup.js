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

chrome.tabs.query({}, tabs => {

    // extract the domains
    const tabUrlCounter = {};
    tabs.forEach(tab => {
        const url = tab.url;
        if (!url.includes('http')) {
            return;
        }
        const domain = url.match(/^https?:\/\/([^\/]+)/)[1];
        tabUrlCounter[domain] = (tabUrlCounter[domain] || 0) + 1;
    });

    // set button
    for (const [domain, cnt] of Object.entries(tabUrlCounter)) {
        const button = document.createElement("button");
        button.id = domain;
        button.innerHTML = domain + ' (' + cnt + ')';

        const insertDiv = document.createElement('div');
        insertDiv.className = "domain_button_wrapper";
        insertDiv.appendChild(button);

        const parent = document.getElementById('domains');
        parent.appendChild(insertDiv);

        // add event listener
        document.getElementById(domain).addEventListener('click', () => {
            chrome.tabs.query({}, tabs => {
                tabs.map((currentTab) => {
                    if(currentTab.url.includes(domain)){
                        chrome.tabs.remove(currentTab.id)
                    }
                })
            })
            // remove button
            document.getElementById(domain).remove();
        });
    }

});
