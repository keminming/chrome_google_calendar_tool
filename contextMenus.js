chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message received");
	if (request.method == "getCalendarID")
      sendResponse({ID: localStorage['calendarID']});
    else
      sendResponse({}); // snub them.
});

function onClickHandler(info, tab) {
    if (info.menuItemId == "calendar"){
	var x = window.confirm("Is the time correct: " + info.selectionText + " ?");
	var time_message;
 	if(x == false)
	{
		time_message = window.prompt("Please enter the time: (mm/dd/yyyy hh:mm:ss)");	
		if(time_message == null)
			return;
	}
	else
	{
		time_message = info.selectionText;
	} 
		
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tab.id, {action: "time_location_title",time : time_message}, function(response) {});  
	});
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {

  chrome.contextMenus.create(
  {"id": "calendar", 
    "type": "normal", 
	"title": "Add to Google Calendar",     
	"contexts":["selection"]
  });
});