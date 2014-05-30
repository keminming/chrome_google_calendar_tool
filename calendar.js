var script = document.createElement('script');
script.src = 'https://apis.google.com/js/client.js';
document.head.appendChild(script);

var script1 = document.createElement('script');
script1.src = 'match_date_time.js';
document.head.appendChild(script1);

//core date model
var event_table = [];

function load_date_model(event_list)
{
	var events = JSON.parse(event_list);
	//console.log(events);

	var count = 0;
	for(var i = events.items.length - 1; i >= events.items.length - 10; i--)
	{
		var d = parse_time_google_calendar(events.items[i]);
		var date = get_date_from_calendar(d);
		var time = get_time_from_calendar(d);
		var id = events.items[i].id;
		var sequence = events.items[i].sequence;
		
		if(date != null && time != null)
		{
			var d = {"id":"d" + count,"value":date};
			var t = {"id":"t" + count,"value" :time};
			var s = {"id":"s" + count,"value":events.items[i].summary};
			var event = {
				"id":count,
				"eid":id,
				"sequence":sequence,
				"date":d,
				"time":t,
				"summary":s,
			};
			event_table[count] = event;
		}
		count++;
	}
	var event_table_txt = JSON.stringify(event_table);
	localStorage.event_table = event_table_txt;
}

// Use a button to handle authentication the first time.
function add_to_calendar(start,end,title){
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		
		var calendarID;
		if (localStorage.getItem("calendarID") === null)	
			calendarID = "primary";
		else
			calendarID = localStorage.calendarID;
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

function get_events_from_calendar(callback)
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		var calendarID;
		if (localStorage.getItem("calendarID") === null)	
			calendarID = "primary";
		else
			calendarID = localStorage.calendarID;
		makeListApiCall(calendarID,token,callback);
	});
}

function makeListApiCall(calendarID,access_token,callback) {
	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events?";
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
			load_date_model(client.responseText);
			callback();
		}
	}
	client.open("GET", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + access_token);
	client.send("");
}

function UpdateEvent(event)
{
	console.log(event);
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		
		UpdateEventApiCall(event,"primary",token);
	});
}

function UpdateEventApiCall(event,calendarID,access_token) {

	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events/" + event.eid;
	var client = new XMLHttpRequest();
	var date_array = event.date.value.split("-");
	var time_array = event.time.value.split(":");
	var date_time = get_data_time(date_array,time_array,"AM");
	start = format_time_google_calendar(date_time,"-50:00");
	date_time.setHours(date_time.getHours() + 1);
	end = format_time_google_calendar(date_time,"-50:00");

	console.log(event.id);
	console.log(event.eid);
	console.log(start);
	console.log(end);

	var resource = 
	{
		"summary":event.summary.value,
		"start": {
			"dateTime": start
		},
		"end": {
			"dateTime": end
		},
		"sequence":event.sequence + 1
	};	
	var message = JSON.stringify(resource);
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
			//console.log(client.responseText);
		}
	}
	client.open("PUT", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + access_token);
	client.send(message);
}

function DeleteEvent(event)
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		
		DeleteEventApiCall(event,"primary",token);
	});
}

function DeleteEventApiCall(event,calendarID,access_token) {

	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events/" + event.eid;
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
		}
	}
	client.open("DELETE", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + access_token);
	client.send("");
}

function ListCalendar(callback)
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		
		ListCalendarApiCall(callback,token);
	});
}

function ListCalendarApiCall(callback,access_token) {

	var URL = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
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
			callback(client.responseText);
		}
	}
	client.open("GET", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + access_token);
	client.send("");
}