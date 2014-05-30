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
var calendar_list;

function get_calendars(list)
{
	calendar_list = JSON.parse(list).items;
	create_UI(calendar_list,time_zone_mapping);
}

function create_UI(calendar_list,time_zone_mapping)
{
	for(var i=0;i<calendar_list.length;i++)
	{
		var option = document.createElement("option");
		option.setAttribute("value",calendar_list[i].id);
		option.setAttribute("class","calender_option");
		var txt = document.createTextNode(calendar_list[i].id);
		option.appendChild(txt);
		$('#calendar-list').append(option);
	}
	$('select.calendar-list option[value="primary"]').attr("selected",true);

	for(var key in time_zone_mapping)
	{
		console.log(key);
		var option = document.createElement("option");
		console.log(time_zone_mapping[key]);
		option.setAttribute("value",time_zone_mapping[key]);
		var txt = document.createTextNode(key);
		option.appendChild(txt);
		option.setAttribute("class","timezone_option");
		$('#time-zone').append(option);
	}
	$('select.time-zone option[value="CDT"]').attr("selected",true);
	$('#submit').bind("click",function(){
		console.log("xxxxxxx");
		localStorage["calendarID"] = $('#calendar-list').val();
		localStorage["timezone"] = $('#time-zone').val();
		var timezone = $( "#time-zone option:selected" ).text();
		$('#calendar').text(localStorage["calendarID"]);
		$('#timezone').text(timezone + localStorage["timezone"]);
	});
}


ListCalendar(get_calendars);