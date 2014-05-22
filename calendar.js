var script = document.createElement('script');
script.src = 'https://apis.google.com/js/client.js';
document.head.appendChild(script);

var script1 = document.createElement('script');
script1.src = 'match_date_time.js';
document.head.appendChild(script1);

// Use a button to handle authentication the first time.
function add_to_calendar(start,end,title){
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
	
		var calendarID = localStorage.calendarID;
		makeInsertApiCall(start,end,title,calendarID,token);
	});
}

//"2011-12-16T10:00:00.000-07:00"
function makeInsertApiCall(start,end,title,calendarID,access_token) {
	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events";
	var resource = 
	{
		"summary": title,
		"location": "--",
		"start": {
			"dateTime": start
		},
		"end": {
			"dateTime": end
		}
	};
	var message = JSON.stringify(resource);

   
	var client = new XMLHttpRequest();
	client.onload = function () {
		if(this.status === 400)
		{
			window.alert("Bad request.");
			return;
		}
		if (this.status === 401) {
			// This status may indicate that the cached
			// access token was invalid. Retry once with
			// a fresh token.
			chrome.identity.removeCachedAuthToken({ 'token': access_token });
			window.alert("Invalid token.")
			return;
		}
		else if(this.status === 404)
		{
			window.alert("Calendar not found.");
			return;
		}
		else if(this.status === 200)
		{
			window.alert("Event add success, check added events from popup.");
			return;
		}
	}
	client.open("POST", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + access_token);
	client.send(message);
}

function get_events_from_calendar()
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
	
		var calendarID = localStorage.calendarID;
		makeListApiCall(calendarID,token);
	});
}

function makeListApiCall(calendarID,access_token) {
	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events?orderBy=updated";
	var client = new XMLHttpRequest();
	client.onload = function () {
		if(this.status === 400)
		{
			console.log("Bad request.");
			return;
		}
		if (this.status === 401) {
			// This status may indicate that the cached
			// access token was invalid. Retry once with
			// a fresh token.
			chrome.identity.removeCachedAuthToken({ 'token': access_token });
			console.log("Invalid token.")
			return;
		}
		else if(this.status === 404)
		{
			console.log("Calendar not found.");
			return;
		}
		else if(this.status === 200)
		{
			console.log(client.responseText);
			localStorage.events = client.responseText;
		}
	}
	client.open("GET", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + access_token);
	client.send("");
}



