function onLoad()
{
    var blackListDropdown = document.querySelector("#blacklist")
    
    function reloadScriptDataOnExtension(){
        browser.runtime.getBackgroundPage().then(function(page) {
            page.refreshBlacklist();            
        }, onError);
    }
    
    function selectedRegExChanged(e){
        // remove disabled
        document.querySelector("#removeSelectedRegEx").removeAttribute('disabled');
    }
    
    function removeSelectedRegEx(e){
        browser.storage.local.get("regexBlacklist")
            .then(function(storageResult){
                //TODO: find item to remove and then save
                var regExList = storageResult.regexBlacklist || [];
                var indexOfSelectedItem = regExList.indexOf(blackListDropdown.value)
                if (blackListDropdown.value &&
                    indexOfSelectedItem > -1)
                {
                    regExList.splice(indexOfSelectedItem,1);
                } 
                
                browser.storage.local.set({
                  regexBlacklist: regExList
                });
                
                setCurrentBlacklist(regExList);
                reloadScriptDataOnExtension();
            }, onError);
    }

    function addRegEx(e) {
        e.preventDefault();
      
        browser.storage.local.get("regexBlacklist")
            .then(function(storageResult){
                var regexText = document.querySelector("#regexText");                
                var regExList = storageResult.regexBlacklist || [];                
                regExList.push(regexText.value);
                
                browser.storage.local.set({
                  regexBlacklist: regExList
                });
                
                setCurrentBlacklist(regExList);
                reloadScriptDataOnExtension();
            }, onError);
    }
    
    function clearOptions(selectbox)
    {
        var i;
        for(i = selectbox.options.length; i > 0 ; i--)
        {
            selectbox.remove(i-1);
        }
    }
    
    function setCurrentBlacklist(result) {
        clearOptions(blackListDropdown);
        if (Array.isArray(result))
        {
            // add regex as options
            for (var i=0,l=result.length;i<l;i++)
            {
                var opt = document.createElement('option');
                opt.value = result[i];
                opt.text = result[i];
                blackListDropdown.appendChild(opt);
            }
        }
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("regexBlacklist");
    getting.then(function(getResult){setCurrentBlacklist(getResult.regexBlacklist);}, onError);
    
    blackListDropdown.addEventListener("change", selectedRegExChanged);
    document.querySelector("form").addEventListener("submit", addRegEx);
    document.querySelector("#removeSelectedRegEx").addEventListener("click", removeSelectedRegEx);
}

document.addEventListener("DOMContentLoaded", onLoad);