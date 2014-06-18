/**
 * @fileoverview Context menu functionality
 *
 * @author keminming@google.com (Ke Wang)
 */

var raw_date_time;
var title;

function promptTime()
{
	chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.query({active: true}, function(tabs){  		  
			chrome.tabs.sendMessage(tab.id, {action: "open_time_box"}); 		
		});
    });     
}

function promptTitle()
{
	chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.query({active: true}, function(tabs){  		  
			chrome.tabs.sendMessage(tab.id, {action: "open_title_box"}); 		
		});
    });  
}

function messageHandler(msg, sender, sendResponse)
{
	console.log("msg received in context menu");
	console.log(msg);
	if(msg.action == "open_date_box")
	{
		console.log("receive open_date_box in context menu");
		raw_date_time = msg.value;
		promptTitle();
	}
	
	if(msg.action == "open_title_box")
	{
		console.log("receive open_title_box in context menu");
		title = msg.value;
		console.log(date_time);
		console.log(title);

		var date = get_date_from_tab(raw_date_time);
		var time = get_time_from_tab(raw_date_time);
		
		var date_time = get_data_time(date,time,"AM");	
		var start = format_time_google_calendar(date_time,localStorage["timezone"]);
		date_time.setHours(date_time.getHours() + 1);
		var end = format_time_google_calendar(date_time,localStorage["timezone"]);
		calendar.addToCalendar(start,end,title);
	}
}

function onClickHandler(info, tab) {
    if (info.menuItemId == "calendar"){
		var time_message;
		var date;
		var time;
		var timezone;
		var AM_PM;
		var date_time;

		time_message = info.selectionText; 
		
		date = get_date_from_tab(time_message);
		
		time = get_time_from_tab(time_message);
		timezone = get_time_zone_from_tab(time_message);
		AM_PM = get_AM_PM_from_tab(time_message);
		
		if(date === null || time === null || timezone === null || AM_PM === null)
		{		
			promptTime();
		}
		else
		{
			date_time = get_data_time(date,time,AM_PM);	
			start = format_time_google_calendar(date_time,timezone);
			date_time.setHours(date_time.getHours() + 1);
			end = format_time_google_calendar(date_time,timezone);
		
			title = promptTitle();
			if(title == null)
				return;
		
			calendar.addToCalendar(start,end,title);
		}
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
