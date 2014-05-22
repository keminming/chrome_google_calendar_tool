function trackButtonClick()
{
	var ID = document.getElementById("calendarID");
	console.log(ID.value);
	localStorage.calendarID = ID.value;
	location.reload();
}

function resetHandle()
{
	localStorage.removeItem("calendarID");
	location.reload();
}

function generate_event_list()
{
	get_events_from_calendar();
	var events = JSON.parse(localStorage.events);
	console.log(events);
	var body = document.getElementById("b");
	var ul = document.createElement("ul");
	for(var i = events.items.length - 1; i >= events.items.length - 10; i--)
	{
		var ui = document.createElement("ui");
		var start_time;
		if(events.items[i].start.date != null)
			start_time = events.items[i].start.date;
		else if(events.items[i].dateTime != null)
			start_time = events.items[i].start.dateTime;
		else
			start_time = "NA";
		var ut = "+ Summary: " + events.items[i].summary + "\n" + "+ Location: " + events.items[i].location + "\n" + "+ Start Time: " + start_time + "\n";
		var utn = document.createTextNode(ut);
		ui.appendChild(utn);
		ul.appendChild(ui);
	}
	body.appendChild(ul);
}

if(localStorage.getItem("calendarID") === null)
{
	var p=document.createElement("p");
	var t=document.createTextNode("Your Google Calendar ID:");
	var body = document.getElementById("b");
	p.appendChild(t);
	body.appendChild(p);
	
	var txt = document.createElement("input");
	txt.setAttribute('id', 'calendarID');
	txt.setAttribute('value', 'primary');
	document.body.appendChild(txt);

	var btn = document.createElement("button");
	btn.setAttribute('id', 'submit');
	var t1=document.createTextNode("Submit");
	btn.appendChild(t1);
	btn.addEventListener('click', trackButtonClick);
	document.body.appendChild(btn);
	
	generate_event_list();
}
else
{
	var body = document.getElementById("b");
	var p=document.createElement("p")
	var t=document.createTextNode("Your Google Calendar ID:");
	p.appendChild(t);
	document.body.appendChild(p);
	
	var p1 = document.createElement("p");
	var t1 = document.createTextNode(localStorage.calendarID);
	p1.appendChild(t1);
	document.body.appendChild(p1);
	
	var btn = document.createElement("button");
	btn.setAttribute('id', 'reset');
	var t2=document.createTextNode("Reset");
	btn.appendChild(t2);
	btn.addEventListener('click', resetHandle);
	document.body.appendChild(btn);
	
	generate_event_list();
}
