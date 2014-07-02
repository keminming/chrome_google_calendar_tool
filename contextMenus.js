/**
 * @fileoverview Context menu functionality
 *
 * @author keminming@google.com (Ke Wang)
 */


function prompt(isValid,date)
{
	chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.query({active: true}, function(tabs){  		  
			chrome.tabs.sendMessage(tab.id, {action: "open_prompt","isValid":isValid,'date':date}); 		
		});
    });     	
}


function messageHandler(msg, sender, sendResponse)
{
	if(msg.action == "open_prompt_response")
	{
		console.log("receive open_date_box in context menu");
		date = msg.date;
		title = msg.title;
		console.log(title);
		console.log(date);
		
		var dateTime = DateTime.toCalendar(moment(date).format("YYYY-MM-DD HH:mm:ss") + " " + localStorage["timezone"]);
		console.log(dateTime);
		if(dateTime != null)
		{
			console.log(dateTime[0]);
			console.log(dateTime[1]);
			calendar.addToCalendar(dateTime[0],dateTime[1],title);
		}
	}
}

function onClickHandler(info, tab) {
    if (info.menuItemId == "calendar"){

		console.log(info.selectionText);
		
		prompt(true,DateTime.toContentScript(info.selectionText));
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.extension.onMessage.addListener(messageHandler);

chrome.runtime.onInstalled.addListener(function() {

  localStorage["timezone"] = "-06:00";

  chrome.contextMenus.create(
  {"id": "calendar", 
    "type": "normal", 
	"title": "Add to Google Calendar",     
	"contexts":["selection"]
  });
});
