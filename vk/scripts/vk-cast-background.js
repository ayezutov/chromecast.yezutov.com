(function(){
	function registerRules() {
	  chrome.webRequest.onCompleted.addListener(
		  function(info) {
			//TODO: replace timeout with communication from content script
			setTimeout(function() {
					chrome.tabs.sendMessage(info.tabId, {action: "recreateAllChromeCastIcons"})
				}, 500);
		  },
		  {
			urls: [ "http://vk.com/*.swf*" ]
		  },
		  []);
	}

	registerRules();
})();