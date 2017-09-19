
var currentBlacklist = [];
function refreshBlacklist()
{
    browser.storage.local.get("regexBlacklist")
        .then(function(storageResult){
            currentBlacklist = storageResult.regexBlacklist || [];
        }, function(error){
            console.log(`Error: ${error}`);
    });
}


function onLoad()
{
    refreshBlacklist();
    function blockRequestIfBlackListed(requestDetails) {
        var hasMatch = false;
        var k = 0;
        while(k<currentBlacklist.length && !hasMatch)
        {
            hasMatch = new RegExp(currentBlacklist[k]).test(requestDetails.url);
            k++;
        }
        
        if (hasMatch)
        {
            console.log("Canceling: " + requestDetails.url);
            return {cancel: true};
        }
    }

    browser.webRequest.onBeforeRequest.addListener(
      blockRequestIfBlackListed,
      {urls: ["<all_urls>"]},
      ["blocking"]
    );

}
document.addEventListener("DOMContentLoaded", onLoad);
