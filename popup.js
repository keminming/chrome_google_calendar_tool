var script= document.createElement('script');
script.src = 'match_date_time.js';
document.head.appendChild(script);

var colors = ["#0266C8","#F90101","#F2B50F"," #00933B"];
var port = chrome.runtime.connect({name: "closeDetect"});

var events_div = document.getElementById("calendar-events");
events_div.setAttribute('align','center');
var busy = document.createElement("img");
busy.setAttribute("src","wait.gif");
events_div.appendChild(busy);
get_events_from_calendar(generate_UI);
//var event_table;

function generate_UI()
{
	var table = document.createElement("table");
	table.setAttribute("id","event_table");
	event_table = JSON.parse(localStorage.event_table);
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
		//console.log("#" + event_table[i].summary.id);
		summary_input.setAttribute("name",event_table[i].summary.id);
		var summary_txt = document.createTextNode(event_table[i].summary.value);
		summary_input.appendChild(summary_txt);
	
		var summary_cell = document.createElement("td");
		summary_cell.appendChild(summary_input);
		summary_cell.className = "summary";
		summary_cell.style.borderLeftStyle = "solid";
		summary_cell.style.borderLeftColor = colors[i%colors.length];
		
		var reset_btn = document.createElement("img");
		reset_btn.setAttribute("src","reset.png");
		reset_btn.setAttribute("class","panel");
		reset_btn.setAttribute("id","reset" + i);
		reset_btn.setAttribute("title","Reset");
		
		var reset_div = document.createElement("div");
		reset_div.setAttribute("class","panel");
		reset_div.setAttribute("id","left");
		reset_div.setAttribute("align","center");
		reset_div.appendChild(reset_btn);

		reset_div.onmousedown = function(){this.style.backgroundColor = "#B2B2B2";}
		reset_div.onmouseup = function(){this.style.backgroundColor = "#FAFAFA";}
		
		var delete_btn = document.createElement("img");
		delete_btn.setAttribute("src","bin.png");
		delete_btn.setAttribute("class","panel");
		delete_btn.setAttribute("id","delete" + i);
		delete_btn.setAttribute("title","Delete");
		
		var delete_div = document.createElement("div");
		delete_div.setAttribute("class","panel");
		delete_div.setAttribute("id","right");
		delete_div.setAttribute("align","center");
		delete_div.appendChild(delete_btn);
		delete_div.onmousedown = function(){this.style.backgroundColor = "#B2B2B2";}
		delete_div.onmouseup = function(){this.style.backgroundColor = "#FAFAFA";}
		
		var panel_cell = document.createElement("td");
		panel_cell.appendChild(delete_div);
		panel_cell.appendChild(reset_div);
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
	for(var i =0;i<event_table.length;i++)
	{
		init_listener(i);
	}
	if(busy != null && busy.parentNode == events_div)
	{
		//console.log("remove");
		events_div.removeChild(busy);
	}
}

function init_listener(i)
{
	//console.log("init_listener" + i);

	var did = "#d" + i; 
	$(did).bind('input', function() {
		var index = parseInt(did.substr(2));
		//console.log("d" + index);

		var date = $(did).val();
		var msg = {"type":"modify","payload":{"id":index, "field":"date","value":date}};			
		port.postMessage(msg);
	});
	
	var tid = "#t" + i;
	$(tid).bind('input', function() {
		var index = parseInt(tid.substr(2));
		//console.log("t" + index);
		var time = $(tid).val();
		var msg = {"type":"modify","payload":{"id":index, "field":"time","value":time}};			
		port.postMessage(msg);
	});
	
	var sid = "#s" + i;
	$(sid).bind('input propertychange', function() {
		//console.log(sid);
		var index = parseInt(sid.substr(2));
		//console.log("s" + index);
		var summary = $(sid).val();
		var msg = {"type":"modify","payload":{"id":index, "field":"summary","value":summary}};			
		port.postMessage(msg);
	});
	
	var reset_id = "#reset" + i;
	//console.log(reset_id);
	$(reset_id).bind('click', function() {	
		var index = parseInt(reset_id.substr(6));
		//console.log("reset" + index);
		var did = "#d" + index; 
		var tid = "#t" + index;
		var sid = "#s" + index;
		
		$(tid).val(event_table[index].time.value);
		$(did).val(event_table[index].date.value);
		$(sid).val(event_table[index].summary.value);
		
		var msg = {"type":"reset","payload":{"id":index}};			
		port.postMessage(msg);
	});
	
	
	
	var delete_id = "#delete" + i;
	//console.log(delete_id);
	$(delete_id).bind('click', function() {

		var index = parseInt(delete_id.substr(7));
		//console.log("delete" + index);
		var msg = {"type":"delete","payload":{"id":index}};			
		port.postMessage(msg);
		$("#r1-" + index).fadeOut();
		setTimeout("$('#r1-' + index).remove()",1000);
		$("#r2-" + index).fadeOut();
		setTimeout("$('#r1-' + index).remove()",1000);
	});
}




