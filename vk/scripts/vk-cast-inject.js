(function(){
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		if (request.action == "recreateAllChromeCastIcons"){
			recreateAllChromeCastIcons();			
		}
	  }
	);
	
	var recreateAllChromeCastIcons = function(){
		console.log("[VkCast] VK player load has been detected. Re-initializing current page");
		var embeds = document.getElementsByTagName("embed");
		for (var i = 0; i < embeds.length; i++){
			var embed = embeds[i];
			if (isVkPlayerEmbed(embed)) {
			    console.log("[VkCast] VK player instance has been found. Re-initialization has started");
				initializeVkPlayerEmbed(embed);
			}
		}
	};
	
	var isVkPlayerEmbed = function(embedded){
	    return embedded.id == "video_player" && embedded.name == "video_player" && embedded.src.indexOf("vk.com") >= 0;
	};
	
	var initializeVkPlayerEmbed = function(embedded){
	    removeChromeCastControlIfPresent(embedded);
	    var topControls = findTopControls(embedded);
	    var info = getVideoInformationFromEmbedded(embedded);
	    insertChromeCastControl(topControls, info, embedded);
	};
	
	var removeChromeCastControlIfPresent = function (embedded) {
	    console.log("[VkCast] Removing VkCast from already initialized embedded.");
	};
	
	var findTopControls = function (embedded) {
	    console.log("[VkCast] Searching for top controls");
	    var mvData = findClosestParent(embedded, function (p) {
	        return !!(p.className) && p.className.indexOf("mv_data") >= 0;
	    })
		
	    if (!mvData){
	        return null;
	    }
		
	    return findChild(mvData, function(c) { return !!(c.id) && c.id == "mv_top_controls" });
	};
	
	var findClosestParent = function(child, condition){
	    var p = child.parentElement;
		
	    if (!p || condition(p)){
	        return p;
	    }
		
	    return findClosestParent(p, condition);
	};

	var findChild = function (parent, condition, recursive) {
	    var children = parent.children;

	    for (var i = 0; i < children.length; i++) {
	        if (condition(children[i])) {
	            return children[i];
	        }
	    }

	    if (recursive) {
	        for (var i = 0; i < children.length; i++) {
	            var found = findChild(children[i], condition, recursive);
	            if (!!found) {
	                return found;
	            }
	        }
	    }

	    return null;
	}
	
	var getVideoInformationFromEmbedded = function (embedded) {
	    console.log("[VkCast] Getting information from embed's flashvars");
	    var flashArgs = embedded.attributes["flashvars"].value;
	    var pairs = flashArgs.split('&');

	    var result = {};
	    for (var i = 0; i < pairs.length; i++) {
	        var pair = pairs[i];
	        var nameValue = pair.split('=');
	        result[nameValue[0]] = decodeURIComponent(nameValue[1]);
	    }
	    console.log("[VkCast] Information from flashvars:");
	    console.log(result);
	    return result;
	};
	
	var insertChromeCastControl = function (topControls, info, embedded) {
	    console.log("[VkCast] Inserting VkCast controls");
	    var tempDiv = document.createElement("div");

	    tempDiv.innerHTML = '<div class="divider fl_r">|</div> <div class="mv_top_button fl_r" style="color: rgb(119, 119, 119);"><img src="' + chrome.extension.getURL("icons/chromecast-icon.png") + '" alt="VkCast"/></div>';

	    var children = Array.prototype.slice.call(tempDiv.children);
	    for (var i = 0; i < children.length; i++) {
	        topControls.appendChild(children[i]);
	    }
	};
})();