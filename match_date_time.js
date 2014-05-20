//time zone mapping
time_zone_mapping = {};
time_zone_mapping["PDT"] = "-07:00";
time_zone_mapping["PST"] = "-08:00";
time_zone_mapping["PACIFIC TIME"] = "-08:00";
time_zone_mapping["MDT"] = "-06:00";
time_zone_mapping["MST"] = "-07:00";
time_zone_mapping["MOUNTAIN TIME"] = "-07:00";
time_zone_mapping["CDT"] = "-05:00";
time_zone_mapping["CST"] = "-06:00";
time_zone_mapping["CENTRAL TIME"] = "-06:00";
time_zone_mapping["EDT"] = "-04:00";
time_zone_mapping["EST"] = "-05:00";
time_zone_mapping["EASTERN TIME"] = "-05:00";

//month mapping
month_mapping = {};
month_mapping["January"] = 1;
month_mapping["Jan"] = 1;
month_mapping["February"] = 2;
month_mapping["Feb"] = 2;
month_mapping["March"] = 3;
month_mapping["Mar"] = 3;
month_mapping["April"] = 4;
month_mapping["Apr"] = 4;
month_mapping["May"] = 5;
month_mapping["June"] = 6;
month_mapping["Jun"] = 6;
month_mapping["July"] = 7;
month_mapping["Jul"] = 7;
month_mapping["August"] = 8;
month_mapping["Aug"] = 8;
month_mapping["September"] = 9;
month_mapping["Sep"] = 9;
month_mapping["Sept"] = 9;
month_mapping["October"] = 10; 
month_mapping["Oct"] = 10;
month_mapping["November"] = 11;
month_mapping["Nov"] = 11;
month_mapping["December"] = 12;
month_mapping["Dec"] = 12;

function get_AM_PM(input)
{
	var res;
	var AM_PM;
	res = input.toUpperCase().match("PM");
	console.log(res);
	if(res != null)
	{
		return "PM";
	}
	return "AM";
}

function get_time_zone(input)
{
	var res;
	var time_zone;
	for(var key in time_zone_mapping)
	{
		var s = input.toUpperCase();
		res = s.match(key);
		console.log(res);
		if( res != null)
		{
			time_zone = time_zone_mapping[res[0]];
			return time_zone;
		}
	}
	return "-00:00";
}

function get_date(input)
{
	var res;
	var date;
	console.log(input);
	//mm/dd/yyyy
	res = input.match(/\d\d\/\d\d\/\d\d\d\d/g);
	console.log(res);
	if( res != null)
	{
		date = res[0].split("/");
		return date;
	}
	
	//yyyy/mm/dd
	res = input.match(/\d\d\d\d\/\d\d\/\d\d/g);
	console.log(res);
	if( res != null)
	{
		date = res[0].split("/");
		var tmp = date[0];
		date[0] = date[3];
		date[3] = tmp;
		return date;
	}

	//Jan, 10 2014
	for(var key in month_mapping)
	{
		var pattern = key + ",?\s*(\d\d)|(\d)";
		console.log(pattern);
		var re = new RegExp(pattern,"g");
		res = input.match(re);
		if( res != null)
		{
			date = res[0].split(",?\s*");
			return date;
		}
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
	return null;
}

function get_data_time(date,time,AM_PM)
{
	var d = new Date();
	//set date
	if(date.length == 3)
	{
		d.setFullYear(parseInt(date[2]));
	}
	else
	{
		d.setFullYear(d.getFullYear());
	}
	d.setMonth(parseInt(date[0]) - 1);
	d.setDate(parseInt(date[1]));
	
	//set time
	if(AM_PM == "PM")
	{
		d.setHours(parseInt(time[0]) + 12);
	}
	else
	{
		d.setHours(parseInt(time[0]));
	}
	d.setMinutes(parseInt(time[1]));
	if(time.length == 3)
	{
		d.setSeconds(parseInt(time[2]));
	}
	else
	{
		d.setSeconds(0);
	}
	console.log(d);

	return d;
}

function to_full(input)
{
	if(input < 10)
	{
		return '0' + input;
	}
	else
	{
		return input;
	}
}

//convert javascript date to RFC 3339 format
//1996-12-19T16:39:57-08:00
function format_time_google_calendar(input,timezone)
{
	var res;
	var year = input.getFullYear();
	var month = to_full(input.getMonth() + 1) ;
	var day = to_full(input.getDate());
	var hour = to_full(input.getHours());
	var minute = to_full(input.getMinutes());
	var second = to_full(input.getSeconds());
	res = year + '-' + month + '-' + day + 'T' + hour
	+ ':' + minute + ':' + second + ".000" + timezone;
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
