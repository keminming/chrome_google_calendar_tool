/**
 * @fileoverview Perform interaction with google calendar restful service
 *
 * @author keminming@google.com (Ke Wang)
 */
 
/**
 * Namespace for options functionality.
 */
var options = {}; 

/**
 * Initialize option page.
 */ 
options.init = function()
{
	calendar.ListCalendar(getCalendars);
}

/**
 * Generate calendar ID list.
 * @param {list}.
 */
function getCalendars(list)
{
	var calendarList = JSON.parse(list).items;
	createUI(calendarList,time_zone_mapping);
}

/**
 * Generate options UI.
 * @param {calendarList,time_zone_mapping}.
 */
function createUI(calendarList,time_zone_mapping)
{
	for(var i=0;i<calendarList.length;i++)
	{
		var option = document.createElement("option");
		$(option).attr({'class':'calender_option'}).text(calendarList[i].id).appendTo($('#calendar-list'));
	}
	$('select.calendar-list option[value="primary"]').attr("selected",true);

	for(var key in time_zone_mapping)
	{
		console.log(key);
		var option = document.createElement("option");
		console.log(time_zone_mapping[key]);
		$(option).attr({'value':time_zone_mapping[key],'class':'timezone_option'}).text(key).appendTo($('#time-zone'));
	}
	$('select.time-zone option[value="CDT"]').attr("selected",true);
	$('#submit').bind("click",function(){
		localStorage["calendarID"] = $('#calendar-list').val();
		localStorage["timezone"] = $('#time-zone').val();
		var timezone = $( "#time-zone option:selected" ).text();
		$('#calendar').text(localStorage["calendarID"]);
		$('#timezone').text(timezone + localStorage["timezone"]);
	});
}

options.init();