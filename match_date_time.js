function get_date(input)
{
	var res;
	var date;
	console.log(input);
	res = input.match(/\d\d\/\d\d\/\d\d\d\d/g);
	console.log(res);
	if( res != null)
	{
		date = res[0].split("/");
		return date;
	}
}

function get_time(input)
{
	var res;
	var time;
	console.log(input);
	res = input.match(/(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?/g);
	console.log(res);
	if( res != null)
	{
		time = res[0].split(":");
		return time;
	}
}

function get_data_time(date,time)
{
	var d = new Date();
	if(date.length == 3)
	{
		d.setFullYear(date[2]);
		d.setMonth(date[0]);
		d.setDate(date[1]);
	}
	
	if(time.length == 2)
	{
		d.setHours(time[0]);
		d.setMinutes(time[1]);
		d.setSeconds(0);
	}
	else if(time.length == 3)
	{
		d.setHours(time[0]);
		d.setMinutes(time[1]);
		d.setSeconds(time[2]);
	}
	
	return d;
}

function to_full(input)
{
	if(input < 10)
	{
		return '0' + input;
	}
	else
		return input;
}

//convert javascript date to RFC 3339 format
//1996-12-19T16:39:57-08:00
function format_time_google_calendar(input,timezone)
{
	var res;
	var year = input.getFullYear();
	var month = to_full(input.getMonth()) ;
	var day = to_full(input.getDate());
	var hour = to_full(input.getHours());
	var minute = to_full(input.getMinutes());
	var second = to_full(input.getSeconds());
	res = year + '-' + month + '-' + day + 'T' + hour
	+ ':' + minute + ':' + second + ".000-00:00";
	console.log("time = " + res);
	return res;
}

function test(time)
{
	var date = get_date(time);
	var time = get_time(time);
	var date_time = get_data_time(date,time);
	var formated_time = format_time_google_calendar(date_time);
	return formated_time;
}
