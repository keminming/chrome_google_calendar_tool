/**
 * @fileoverview Performs operations that must be done on a schedule: e.g.
 * updating the badge, fetching new events from the server, etc.
 *
 * @author keminming@google.com (Ke Wang)
 */

/**
 * The namespace for all scheduling operations.
 */
var scheduler = {};

/**
 * Update the badge every hour.
 * @type {number}
 * @const
 * @private
 */
scheduler.BADGE_UPDATE_INTERVAL_MS_ = 60 * 60 * 1000;


scheduler.accessUserInfo = function()
{
	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
		if (chrome.runtime.lastError) 
		{
			console.log(chrome.runtime.lastError);
			return;
		}

		var URL = "https://www.googleapis.com/plus/v1/people/me?";
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
				chrome.identity.removeCachedAuthToken({ 'token': token });
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
				localStorage["profile"] = client.responseText;
			}
		}
		client.open("GET", URL);
		client.setRequestHeader("Content-Type", "application/json");
		client.setRequestHeader('Authorization','Bearer ' + token);
		client.send("");				
	});	
}

/**
 * Poll event from calendar
 * @private
 */
scheduler.poll = function(){
  calendar.getEventsFromCalendar(function(){
    var event_table = JSON.parse(localStorage.event_table);
    var count = 0;

    for(var i=0;i<event_table.length;i++)
    {
	  var now = new Date();
	  var date = event_table[i].date.value;
	  var date_array = date.split("-");
	  if(now.getFullYear() == parseInt(date_array[0]) && now.getMonth() + 1 == parseInt(date_array[1]) && now.getDate() == parseInt(date_array[2]))
		   count++;
    }

	chrome.browserAction.setBadgeText({'text': count.toString()});
  });
}


/**
 * Starts the scheduler that updates the badge (more often) and the feed from
 * the calendar (less often).
 */
scheduler.start = function() {
  console.log('scheduler.start()');
  scheduler.accessUserInfo();
  scheduler.poll();
  // Do a one-time initial fetch on load.
  window.setInterval(scheduler.poll, scheduler.BADGE_UPDATE_INTERVAL_MS_);
};

scheduler.start();