var script = document.createElement('script');
script.src = 'calendar.js';
document.head.appendChild(script);

function onClickHandler(info, tab) {
    if (info.menuItemId == "calendar"){
	var x = window.confirm("Is the time correct: " + info.selectionText + " ?");
	var time_message;
	var date;
	var time;
	var timezone;
	var AM_PM;
	
 	if(x == false)
	{
		return;
	}
	else
	{
		time_message = info.selectionText;
	} 
	
	date = get_date(time_message);
	time = get_time(time_message);
	timezone = get_time_zone(time_message);
	AM_PM = get_AM_PM(time_message);
	
	while(date === null || time === null || timezone === null || AM_PM === null)
	{
		time_message = window.prompt("Format can't be recognized, please enter the time: (mm/dd/yyyy hh:mm:ss)");	
		if(time_message == null)
			return;
		date = get_date(time_message);
		time = get_time(time_message);
		timezone = get_time_zone(time_message);
		AM_PM = get_AM_PM(time_message);
	}
	
	var date_time = get_data_time(date,time,AM_PM);
	start = format_time_google_calendar(date_time,timezone);
	date_time.setHours(date_time.getHours() + 1);
	end = format_time_google_calendar(date_time,timezone);
	
	title = window.prompt("please enter event title");
	if(title == null)
		return;
	
	add_to_calendar(start,end,title);
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