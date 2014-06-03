
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
		localStorage["calendarID"] = $('#calendar-list').val();
		localStorage["timezone"] = $('#time-zone').val();
		var timezone = $( "#time-zone option:selected" ).text();
		$('#calendar').text(localStorage["calendarID"]);
		$('#timezone').text(timezone + localStorage["timezone"]);
	});
}


ListCalendar(get_calendars);