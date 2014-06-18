/**
 * @fileoverview Popup page
 *
 * @author keminming@google.com (Ke Wang)
 */

/**
 * Port to communicate with backgroud page.
 */
var port = chrome.runtime.connect({name: "closeDetect"});

/**
 * Namespace for popup functionality.
 */
var popup = {};

/**
 * The event background color, using google logo color.
 * @type {string[]}
 * @const
 */
popup.colors = ["#0266C8","#F90101","#F2B50F"," #00933B"];

/**
 * Initialize popup page.
 */
popup.init = function()
{
	var eventsDiv = $('#calendar-events').get(0);
	$('#calendar-events').attr({'align':'center'});
	var busy = document.createElement("img");
	$(busy).attr({"src":"wait.gif"}).appendTo($('#calendar-events'));
	calendar.getEventsFromCalendar(popup.generateUI,{"eventsDiv":eventsDiv,"busy":busy});
}

/**
 * Generate popup UI HTML.
 * @param {{"eventsDiv":eventsDiv,"busy":busy}}.
 * @private
 */
popup.generateUI = function (param)
{
	var eventsDiv = param["eventsDiv"];
	var busy = param["busy"];
	var table = document.createElement("table");
	$(table).attr({'id':'eventTable'});
	event_table = JSON.parse(localStorage.event_table);

	for(var i = 0; i<event_table.length;i++)
	{
		var dateInput = document.createElement("input");
		$(dateInput).attr(
			{
				'id':event_table[i].date.id,
				'name':event_table[i].date.id,
				'type':'date',
				'value':event_table[i].date.value
			}
		);
		
		$(dateInput).css({'background-color':popup.colors[i%popup.colors.length]});
		
		var dateCell = document.createElement("td");
		$(dateCell)
			.addClass('date')
			.css({'background-color':popup.colors[i%popup.colors.length]})
			.append($(dateInput));
		
		var timeInput = document.createElement("input");
		$(timeInput).attr(
			{
				'id':event_table[i].time.id,
				'name':event_table[i].time.id,
				'type':'time',
				'value':event_table[i].time.value
			}
		);		
		
		var timeCell = document.createElement("td");
		$(timeCell)
			.addClass('time')
			.css({'border-bottom-style':"solid",'border-bottom-color':popup.colors[i%popup.colors.length]})
			.append($(timeInput));
						
		var summaryInput = document.createElement("textarea");
		$(summaryInput).attr(
			{
				'id':event_table[i].summary.id,
				'name':event_table[i].summary.id,
				'type':'time',
				'value':event_table[i].summary.value
			}
		).text(event_table[i].summary.value);			
	
		var summaryCell = document.createElement("td");
		$(summaryCell)
			.addClass('summary')
			.css({'border-left-style':"solid",'border-left-color':popup.colors[i%popup.colors.length]})
			.append($(summaryInput));		
			
		var resetBtn = document.createElement("img");
		$(resetBtn).attr(
			{
				'src':'reset.png',
				'class':'panel',
				'id':'reset' + i,
				'title':'Reset'
			}
		);			
		
		var resetDiv = document.createElement("div");
		$(resetDiv)
			.addClass('panel')
			.attr(
				{
					'id':'left',
					'align':'center'
				}
			)
			.mousedown(function(){this.style.backgroundColor = "#B2B2B2";})
			.mouseup(function(){this.style.backgroundColor = "#FAFAFA";})
			.append($(resetBtn));			
		
		
		var deleteBtn = document.createElement("img");
		$(deleteBtn).attr(
			{
				'src':'bin.png',
				'class':'panel',
				'id':'delete' + i,
				'title':'delete'
			}
		);			
		
		var deleteDiv = document.createElement("div");
		$(deleteDiv)
			.addClass('panel')
			.attr(
				{
					'id':'right',
					'align':'center'
				}
			)
			.mousedown(function(){this.style.backgroundColor = "#B2B2B2";})
			.mouseup(function(){this.style.backgroundColor = "#FAFAFA";})
			.append($(deleteBtn));				
		
		
		var panelCell = document.createElement("td");
		$(panelCell).addClass('panel').append(deleteDiv,resetDiv);
			
		var firstRow = document.createElement("tr");
		$(firstRow).attr({'id':"r1-"+ event_table[i].id}).append(dateCell,timeCell);
		
		var secondRow = document.createElement("tr");
		$(secondRow).attr({"id":"r2-"+ event_table[i].id}).append(summaryCell,panelCell);
		
		$(table).append(firstRow,secondRow);
	}
	eventsDiv.appendChild(table);
	for(var i =0;i<event_table.length;i++)
	{
		popup.initListener(i);
	}
	if(busy != null && busy.parentNode == eventsDiv)
	{
		//console.log("remove");
		eventsDiv.removeChild(busy);
	}
}

/**
 * Initialize UI event listener.
 * @param {i} event index.
 * @private
 */
popup.initListener = function(i)
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


popup.init();


