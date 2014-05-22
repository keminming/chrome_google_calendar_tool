var clientId = '776848882882-bhdqeba0e3f55m1ufn3l2h220ip43r12.apps.googleusercontent.com';
var apiKey = 'AIzaSyAm8bEq8r0nMXyjMnYqsamsu5pe53-pNfU';
var scopes = 'https://www.googleapis.com/auth/calendar';

var script = document.createElement('script');
script.src = 'https://apis.google.com/js/client.js';
document.head.appendChild(script);

var start;
var end;
var title;
var calendarID;


chrome.runtime.sendMessage({method: "getCalendarID"}, function(response) {
  console.log(response.ID);
  calendarID = response.ID;
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.action == 'time_location_title') {
	title = window.prompt("please enter event title");
	if(title == null)
		return;
  
	var date = get_date(msg.time);
	var time = get_time(msg.time);
	var timezone = get_time_zone(msg.time);
	var AM_PM = get_AM_PM(msg.time);
	var date_time = get_data_time(date,time,AM_PM);

	start = format_time_google_calendar(date_time,timezone);
	date_time.setHours(date_time.getHours() + 1);
	end = format_time_google_calendar(date_time,timezone);
	
	add_to_calendar();
  }
});

// Use a button to handle authentication the first time.
function add_to_calendar() {
    chrome.identity.removeCachedAuthToken(
              { 'token': access_token }
              );
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
	if (chrome.runtime.lastError) 
	{
        console.log(chrome.runtime.lastError);
        return;
    }
	
	gapi.client.setApiKey(apiKey);
	makeInsertApiCall();
	});
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	makeInsertApiCall();
}

//"2011-12-16T10:00:00.000-07:00"
function makeInsertApiCall() {
	console.log(start);
	console.log(end);
   gapi.client.load('calendar', 'v3', function() {
 var request = gapi.client.calendar.events.insert({
   "calendarId": "primary",
   resource:{
       "summary": title,
       "location": "--",
       "start": {
         "dateTime": start
       },
       "end": {
         "dateTime": end
           }
         }
     });
          
     request.execute(function(resp) {
       console.log(resp);
     });
   });
 }

