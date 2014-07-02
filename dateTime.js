// "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArkU3jcFE60x5kS62bE137ebykdAmfsY1Xqkfaz+2pdd1pKoc6AbDHvsDvQx7CB/AStI65A1YOGz030GZ9/Zj5yRqh4JusoWS6t9n90yJQa1XalaCiDi/5MHChhEJkjFekRljYv411JUBgRllmE4neNqESNg3IFGMwKYzfWZ6XiwmQsFup66lX/Te141mfzOdDOkKEKNYP4WtieKkyvU5hzJh6Z/wJC/2gHvIkVuQOQI3wCUWnRK/xqCwUQ2SMhlwS5tV0dRxwSHDtTXgXoLjVViHP0DEWd99iToUqYgJ+rNvLPLXVliybzzusbwNeOpU+FccrWg58TgngZAdMszkdQIDAQAB",

/**
 * @fileoverview Core date and time component, using moment.js library to parse, set and display date and time
 *
 * @author keminming@google.com (Ke Wang)
 */

   
/**
 * Namespace for popup functionality.
 */ 
DateTime = {};

/**
 * Time zone mapping.
 */ 
DateTime.timeZoneMapping = 
{
	"PDT" : "-07:00",
	"PST" : "-08:00",
	"PACIFIC TIME" : "-08:00",
	"MDT" : "-06:00",
	"MST" : "-07:00",
	"MOUNTAIN TIME" : "-07:00",
	"CDT" : "-05:00",
	"CST" : "-06:00",
	"CENTRAL TIME" : "-06:00",
	"EDT" : "-04:00",
	"EST" : "-05:00",
	"EASTERN TIME" : "-05:00"
};


/**
 * Parse time zone information.
 * @param {input string}.
 */
DateTime.parseTimeZone = function(input)
{
	var res;
	var timeZone;
	for(var key in DateTime.timeZoneMapping)
	{
		var s = input.toUpperCase();
		res = s.match(key);
		//console.log(res);
		if( res != null)
		{
			timeZone = DateTime.timeZoneMapping[res[0]];
			return timeZone;
		}
	}
	return localStorage["timezone"];	
}

/**
 * Format date time to ISO8601 google calendar internal format.
 * @param {input string}.
 */
DateTime.isValid = function(input)
{
	var format = moment.parseFormat(input);

	console.log(format); // format
	console.log(moment(input,format,true).parsingFlags());
	if(moment(input,format,true).isValid())
	{
		return true;
	}
	else if(moment(input).isValid())
	{
		return true;
	}
	else
		return false;
}


/**
 * Format date time to ISO8601 google calendar internal format.
 * @param {input string}.
 */
DateTime.toCalendar = function(input)
{
	var format = moment.parseFormat(input);
	
	if(moment(input,format,true).isValid())
	{
		var start = moment(input,DateTime.format,true).format("YYYY-MM-DDTHH:mm:ssZ");
		var end = moment(start).add(1,"hours").format("YYYY-MM-DDTHH:mm:ssZ");
		return [start,end];
	}
	else if(moment(input).isValid())
	{
		var start = moment(input).format("YYYY-MM-DDTHH:mm:ssZ");
		var end = moment(start).add(1,"hours").format("YYYY-MM-DDTHH:mm:ssZ");
		return [start,end];	
	}
	else
		return null;
}

/**
 * Format date time to HTML input field format.
 * @param {input string}.
 */
DateTime.fromCalendar = function(input)
{
	var dateTime = moment(input).format("YYYY-MM-DD HH:mm Z");
		
	return dateTime.split(" ");
}

/**
 * Format date time to date time picker format.
 * @param {input string}.
 */
DateTime.toContentScript = function(input)
{
	var format = moment.parseFormat(input);
	if(moment(input,format,true).isValid())
	{
		return moment(input,format,true).format("YYYY-MM-DD H:mm");
	}
	else if(moment(input).isValid())
	{
		return moment(input).format("YYYY-MM-DD H:mm");
	}
	else
		return null;
}
