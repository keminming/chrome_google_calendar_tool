/**
 * @fileoverview Perform interaction with google calendar restful service
 *
 * @author keminming@google.com (Ke Wang)
 */

 
chrome.runtime.onConnect.addListener(function(port){
    console.log("onConnect");
	port.onMessage.addListener(function(msg) {
		console.log("msg received");
		if(msg.type == "modify")
		{
			console.log("modify");
			//console.log(event_table);
			calendar.changedEventTable.push(msg.payload);
		}
		
		if(msg.type == "reset")
		{
			console.log("reset");
			var id = msg.payload.id;
			for(var i=0;i<calendar.changedEventTable.length;i++)
			{
				console.log(calendar.changedEventTable[i].id);
				console.log(id);
				if(calendar.changedEventTable[i].id == id)
				{	
					calendar.changedEventTable.splice(i, 1);
				}
			}
		}
		
		if(msg.type == "delete")
		{
			var index = msg.payload.id;
			var eventTable = JSON.parse(localStorage.event_table);
			calendar.DeleteEvent(eventTable[index]);
		}
	});
	
	port.onDisconnect.addListener(function(msg) {
		var eventList = {};
		var eventTable = JSON.parse(localStorage.event_table);
		for(var i=0;i<calendar.changedEventTable.length;i++)
		{					
			var id = calendar.changedEventTable[i].id;
			var field = calendar.changedEventTable[i].field;
			var value = calendar.changedEventTable[i].value;		
			eventTable[id][field].value = value;	
			eventList[id]++;
		}
		for(var key in eventList)
		{
			console.log("event to update is:");
			console.log(eventTable[key]);
			calendar.UpdateEvent(eventTable[key]);
		}
			
		calendar.changedEventTable = [];
	});
});

/**
 * Namespace for calendar functionality.
 */
var calendar = {}

/**
 * The event background color, using google logo color.
 * @type {event[]}
 * @private
 */
calendar.changedEventTable = [];


/**
 * A function that show success information to user.
 * @private
 */
calendar.showSuccess = function()
{
	chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.query({active: true}, function(tabs){  		  
			chrome.tabs.sendMessage(tab.id, {action: "add_event_sucess"}); 		
		});
    });  
}

/**
 * A function that load event list to main data model.
 * @param {eventlist} events got from google calendar rest service.
 * @private
 */
calendar.loadDateModel = function(eventList)
{
	var events = JSON.parse(eventList);
	var newEventTable = [];
	
	var count = 0;
	for(var i = events.items.length - 1; i >= 0; i--)
	{
		if(events.items[i].start == null || events.items[i].start.dateTime == null)
		{
			continue;
		}
		
		var dateTimeO = DateTime.fromCalendar(events.items[i].start.dateTime);
		var zoneO = dateTimeO[2]
		
		var dateTime = DateTime.fromCalendar(moment(events.items[i].start.dateTime).zone(localStorage["timezone"]));
		console.log(dateTimeO)
		console.log(dateTime);
		var date = dateTime[0];
		var time = dateTime[1];
		var zone = dateTime[2]
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
				"zone":zoneO,
				"summary":s,
			};
			//console.log(event);
			newEventTable.push(event);
		}
		count++;
	}

	var eventTableTxt = JSON.stringify(newEventTable);
	localStorage.event_table = eventTableTxt;
}

/**
 * A function that add event to google calendar.
 * @param {start,end,title} start time, end time and title of event.
 */
calendar.addToCalendar = function (start,end,title){
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
		calendar.makeInsertApiCall(start,end,title,calendarID,token);
	});
}

/**
 * A function that actually add event to google calendar.
 * @param {start,end,title,calendarID, accessToken} start time, end time and title of event and calendarID, accessToken to do authentication.
 * @private
 */
calendar.makeInsertApiCall = function(start,end,title,calendarID,accessToken) {
	console.log("makeInsertApiCall");
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
			chrome.identity.removeCachedAuthToken({ 'token': accessToken });
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
			console.log(client.responseText);
			calendar.showSuccess();
			return;
		}
	}
	client.open("POST", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + accessToken);
	client.send(message);
}

/**
 * A function that return event in google calendar.
 * @param {callback, callback param} the callback is the function to use the event.
 */
calendar.getEventsFromCalendar = function(callback,param)
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			//console.log(chrome.runtime.lastError);
			console.log("mother");
			return;
		}
		var calendarID;
		if (localStorage.getItem("calendarID") === null)	
			calendarID = "primary";
		else
			calendarID = localStorage.calendarID;
		calendar.makeListApiCall(calendarID,token,callback,param);
	});
}

/**
 * A function that return event in google calendar.
 * @param {calendarID,accessToken,callback,param}.
 * @private 
 */
calendar.makeListApiCall = function (calendarID,accessToken,callback,param) {
	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events?maxResults=2500";
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
			chrome.identity.removeCachedAuthToken({ 'token': accessToken });
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
			//console.log(moment());
			//console.log(client.responseText);
			calendar.loadDateModel(client.responseText);
			callback(param);
		}
	}
	client.open("GET", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + accessToken);
	client.send("");
}

/**
 * A function that update a single event.
 * @param {event} event to be updated.
 */
calendar.UpdateEvent = function(event)
{
	console.log(event);
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		console.log("come in");
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		console.log("before UpdateEventApiCall");
		calendar.UpdateEventApiCall(event,"primary",token);
	});
}

/**
 * A function that actually update event.
 * @param {event,calendarID,accessToken}.
 * @private 
 */
calendar.UpdateEventApiCall = function(event,calendarID,accessToken) {
console.log("UpdateEventApiCall"); 
	var URL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID + "/events/" + event.eid;
	var client = new XMLHttpRequest();
	console.log("after XMLHttpRequest");
	
	console.log(event.date.value + " " + event.time.value + " " + localStorage["timezone"]);
	
	var dateTime = DateTime.toCalendar(moment(event.date.value + " " + event.time.value + " " + localStorage["timezone"]).zone(event.zone).format());
	
	var sequence = event.sequence + 1; 
	//console.log(sequence);

	var resource = 
	{
		"summary":event.summary.value,
		"start": {
			"dateTime": dateTime[0]
		},
		"end": {
			"dateTime": dateTime[1]
		},
		"sequence":sequence
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
			chrome.identity.removeCachedAuthToken({ 'token': accessToken });
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
	client.open("PUT", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + accessToken);
	client.send(message);
}

/**
 * A function that delete a single event.
 * @param {event} event to be deleted. 
 */
calendar.DeleteEvent = function(event)
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		
		calendar.DeleteEventApiCall(event,"primary",token);
	});
}

/**
 * A function that actually delete event.
 * @param {event,calendarID,accessToken}.
 * @private 
 */
calendar.DeleteEventApiCall =  function(event,calendarID,accessToken) {

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
			chrome.identity.removeCachedAuthToken({ 'token': accessToken });
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
	client.setRequestHeader('Authorization','Bearer ' + accessToken);
	client.send("");
}

/**
 * A function that get a event list.
 * @param {callback}.
 */
calendar.ListCalendar = function(callback)
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}
		
		calendar.ListCalendarApiCall(callback,token);
	});
}

/**
 * A function that actually get a event list.
 * @param {callback,accessToken}.
 * @private 
 */
calendar.ListCalendarApiCall = function(callback,accessToken) {

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
			chrome.identity.removeCachedAuthToken({ 'token': accessToken });
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
			callback(client.responseText);
		}
	}
	client.open("GET", URL);
	client.setRequestHeader("Content-Type", "application/json");
	client.setRequestHeader('Authorization','Bearer ' + accessToken);
	client.send("");
}


