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

popup.deleteEventCount = 0;

/**
 * Count for new events.
 */
popup.newEventCount = 0;

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
	
	$('#add').bind('click',function()
	{
		popup.createNewEvent(popup.newEventCount++);
	});
}

popup.createExistEvent = function(table,event_table,i)
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
			'type':'text',
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
		.attr(
			{
				'class':'left',
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
			'title':'Delete'
		}
	);			
	
	var deleteDiv = document.createElement("div");
	$(deleteDiv)
		.attr(
			{
				'class':'right',
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

popup.createNewEvent = function(index)
{
	var dateInput = document.createElement("input");
	$(dateInput).attr(
		{
			'id':'nd' + index,
			'name':'newDate',
			'type':'date',
		}
	);
	
	$(dateInput).css({'background-color':"#B2B2B2"});
	
	var dateCell = document.createElement("td");
	$(dateCell)
		.addClass('date')
		.css({'background-color':"#B2B2B2"})
		.append($(dateInput));
	
	var timeInput = document.createElement("input");
	$(timeInput).attr(
		{
			'id':'nt' + index,
			'name':'newTime',
			'type':'time',
		}
	).css({'background-color':"yellow"});		
	
	var timeCell = document.createElement("td");
	$(timeCell)
		.addClass('time')
		.css({'border-bottom-style':"solid",'border-bottom-color':"#B2B2B2"})
		.append($(timeInput));
					
	var summaryInput = document.createElement("textarea");
	$(summaryInput).attr(
		{
			'id':"ns" + index,
			'name':"new summary",
		}
	).css({'background-color':"yellow"}).text("TODO");			

	var summaryCell = document.createElement("td");
	$(summaryCell)
		.addClass('summary')
		.css({'border-left-style':"solid",'border-left-color':"#B2B2B2"})
		.append($(summaryInput));				
		
	var addBtn = document.createElement("img");
	$(addBtn).attr(
		{
			'src':'save.png',
			'class':'panel',
			'id':'plusn' + index,
			'title':'Save'
		}
	).bind('click',function(){
		if($('#nd' + index).val() != "" && $('#nt' + index).val() != "")
		{
			console.log($('#nd' + index).val());
			console.log($('#nt' + index).val());
			var dateTime = DateTime.toCalendar($('#nd' + index).val() + " " + $('#nt' + index).val() + " " + localStorage["timezone"]);
			console.log(dateTime);
			calendar.addToCalendar(dateTime[0],dateTime[1],$('#ns' + index).val());
			
			$('#leftn' + index).hide();
			$('#rightn' + index).hide();
		}
		else
		{
			$('#ns' + index).val("Oops! Format error");
		}
	});			
	
	var addDiv = document.createElement("div");
	$(addDiv)
		.attr(
			{
				'id':'leftn' + index,
				'align':'center',
				'class':'left'
			}
		)
		.mousedown(function(){this.style.backgroundColor = "#B2B2B2";})
		.mouseup(function(){this.style.backgroundColor = "#FAFAFA";})
		.append($(addBtn));			
	
	
	var deleteBtn = document.createElement("img");
	$(deleteBtn).attr(
		{
			'src':'bin.png',
			'class':'panel',
			'id':'deleten' + index,
			'title':'Delete'
		}
	).bind('click',function()
	{
		$("#r1n" + index).fadeOut();
		setTimeout("$('#r1n' + index).remove()",1000);
		$("#r2n" + index).fadeOut();
		setTimeout("$('#r2n' + index).remove()",1000);
	});			

	var deleteDiv = document.createElement("div");
	$(deleteDiv)
		.attr(
			{
				'id':'rightn' + index,
				'align':'center',
				'class':'right'
			}
		)
		.mousedown(function(){this.style.backgroundColor = "#B2B2B2";})
		.mouseup(function(){this.style.backgroundColor = "#FAFAFA";})
		.append($(deleteBtn));				
	
	
	var panelCell = document.createElement("td");
	$(panelCell).addClass('panel').append(deleteDiv,addDiv);
		
	var firstRow = document.createElement("tr");
	$(firstRow).attr({'id':"r1n" + index}).append(dateCell,timeCell).hide();
	
	var secondRow = document.createElement("tr");
	$(secondRow).attr({"id":"r2n" + index}).append(summaryCell,panelCell).hide();
	
	$(secondRow).prependTo($('#eventTable'));
	$(firstRow).prependTo($('#eventTable'));
	$(firstRow).fadeIn("slow");
	$(secondRow).fadeIn("slow");
}

/**
 * Initialize UI event listener.
 * @param {i} event index.
 * @private
 */
popup.initListener = function(table,event_table,i)
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
		popup.createExistEvent(table,event_table,10 + popup.deleteEventCount);
		popup.deleteEventCount += 1;
	});
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
	eventsDiv.appendChild(table);
	console.log(event_table);

	for(var i = 0; i<10;i++)
	{
		popup.createExistEvent(table,event_table,i);
		popup.initListener(table,event_table,i);
	}

	if(busy != null && busy.parentNode == eventsDiv)
	{
		//console.log("remove");
		eventsDiv.removeChild(busy);
	}
}

popup.init();


