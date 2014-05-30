// Copyright 2012 and onwards Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

/**
 * Starts the scheduler that updates the badge (more often) and the feed from
 * the calendar (less often).
 */
scheduler.start = function() {
  console.log('scheduler.start()');
  get_events_from_calendar(function(){
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

  // Do a one-time initial fetch on load.
  window.setInterval(function() {
	  get_events_from_calendar(function(){
		var event_table = JSON.parse(localStorage.event_table);
		var count = 0;

		for(var i=0;i<event_table.length;i++)
		{
		  var now = new Date();
		  var date = event_table[i].date.value;
		  var date_array = date.split("-");
		  console.log(now.getFullYear());
		  console.log(now.getMonth());
		  console.log(now.getDate());
		  if(now.getFullYear() == parseInt(date_array[0]) && now.getMonth() + 1 == parseInt(date_array[1]) && now.getDate() == parseInt(date_array[2]))
			  count++;
		}
		chrome.browserAction.setBadgeText({'text': count.toString()});
	  });
	
  }, scheduler.BADGE_UPDATE_INTERVAL_MS_);
};

scheduler.start();