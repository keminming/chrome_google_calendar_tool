var script= document.createElement('script');
script.src = 'match_date_time.js';
document.head.appendChild(script);

var colors = ["#B26B00","#FF0000","#33CC33","#0000FF"];


get_events_from_calendar(generate_event_list);
var events_div = document.getElementById("calendar-events");
events_div.setAttribute('align','center');
var busy = document.createElement("img");
busy.setAttribute("src","wait.gif");

events_div.appendChild(busy);


function generate_event_list()
{
	var table = document.createElement("table");
	table.setAttribute("id","event_table");
	var event_table = JSON.parse(localStorage.event_table);
	//console.log(event_table.length);
	for(var i = 0; i<event_table.length;i++)
	{
		var date_input = document.createElement("input");
		date_input.setAttribute("id",event_table[i].date.id);
		date_input.setAttribute("name",event_table[i].date.id);
		date_input.setAttribute("type","date");
		date_input.setAttribute("value",event_table[i].date.value);
		date_input.style.backgroundColor = colors[i%colors.length];

		var date_cell = document.createElement("td");
		date_cell.className = "date";
		date_cell.appendChild(date_input);
		date_cell.style.backgroundColor = colors[i%colors.length];
		
		var time_input = document.createElement("input");
		time_input.setAttribute("id",event_table[i].time.id);
		time_input.setAttribute("name",event_table[i].time.id);
		time_input.setAttribute("type","time");
		time_input.setAttribute("value",event_table[i].time.value);
		//time_input.style.backgroundColor = colors[i%colors.length];
		
		var time_cell = document.createElement("td");
		time_cell.appendChild(time_input);
		time_cell.className = "time";		
		//time_cell.style.backgroundColor = colors[i%colors.length];

		time_cell.style.borderBottomStyle = "solid";
		time_cell.style.borderBottomColor = colors[i%colors.length];
		
		
		var summary_input = document.createElement("textarea");
		summary_input.setAttribute("id",event_table[i].summary.id);
		console.log("#" + event_table[i].summary.id);
		summary_input.setAttribute("name",event_table[i].summary.id);
		var summary_txt = document.createTextNode(event_table[i].summary.value);
		summary_input.appendChild(summary_txt);
	
		var summary_cell = document.createElement("td");
		summary_cell.appendChild(summary_input);
		summary_cell.className = "summary";
		summary_cell.style.borderLeftStyle = "solid";
		summary_cell.style.borderLeftColor = colors[i%colors.length];
		
		var change_btn = document.createElement("img");
		change_btn.setAttribute("src","Pencil-16.png");
		change_btn.setAttribute("class","panel");
		change_btn.setAttribute("id","change" + i);
		change_btn.setAttribute("src","pen.png");
		change_btn.setAttribute("title","Modify");
		change_btn.onmouseover = function(){this.src = "pen-alter.png"};
		change_btn.onmouseout = function(){this.src = "pen.png"}
		var delete_btn = document.createElement("img");
		delete_btn.setAttribute("src","bin.png");
		delete_btn.onmouseover = function(){this.src = "bin-alter.png"};
		delete_btn.onmouseout = function(){this.src = "bin.png"}
		delete_btn.setAttribute("class","panel");
		delete_btn.setAttribute("id","delete" + i);
		delete_btn.setAttribute("title","Delete");
		
		var panel_cell = document.createElement("td");
		panel_cell.appendChild(change_btn);
		panel_cell.appendChild(delete_btn);
		panel_cell.className = "panel";
		
		var first_row = document.createElement("tr");
		first_row.setAttribute("id","r1-"+ event_table[i].id);
		var second_row = document.createElement("tr");
		second_row.setAttribute("id","r2-"+ event_table[i].id);
		first_row.appendChild(date_cell);
		first_row.appendChild(time_cell);
		second_row.appendChild(summary_cell);
		second_row.appendChild(panel_cell);
		
		table.appendChild(first_row);
		table.appendChild(second_row);
	}
	events_div.appendChild(table);
	if(busy != null && busy.parentNode == events_div)
	{
		console.log("remove");
		events_div.removeChild(busy);
	}
	init_wiget();
}

function init_wiget()
{
	console.log("init_wiget");
	var event_table = JSON.parse(localStorage.event_table);
	console.log(event_table);
	for(var i=0;i<event_table.length;i++)
	{
		var change_id = "#change" + i;
		console.log(change_id);
		$(change_id).bind('click', function() {
			console.log("click");
			var index = $(this).attr('id').substr(6);
			var did = "#d" + index;
			var tid = "#t" + index;
			var sid = "#s" + index;
			console.log(did);
			console.log(tid);
			console.log(sid);
			var date = $(did).val();
			var time = $(tid).val();
			var summary = $(sid).val();
			console.log(date);
			console.log(time);
			console.log(summary);
			event_table[index].date.value = date;
			event_table[index].time.value = time;
			event_table[index].summary.value = summary;
			UpdateEvent(event_table[index]);
		});
		
		var delete_id = "#delete" + i;
		$(delete_id).bind('click', function() {
			console.log("delete");
			var index = $(this).attr('id').substr(6);
			DeleteEvent(event_table[index]);
			$("#r1-" + index).fadeOut();
			setTimeout("$('#r1-' + index)..remove()",1000);
			$("#r2-" + index).fadeOut();
			setTimeout("$('#r1-' + index)..remove()",1000);
		});
	}
}



