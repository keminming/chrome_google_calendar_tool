/**
 * @fileoverview Injected content script
 *
 * @author keminming@google.com (Ke Wang)
 */

/**
 * Namespace for contentScript functionality.
 */
var contentScript = {};

/**
 * Create box frame.
 * @param {contents,id} content of the box and msg box ID.
 * @private
 */ 
contentScript.createMsgBox = function(contents,id)
{
	var logo = document.createElement("div");
	$(logo).addClass('logo').text('Calendar++');

	var msgbox = document.createElement( 'div' );
	$(msgbox).attr({'id':id,'class':'msgbox'}).append($(logo));

	for(var i=0;i<contents.length;i++)
	{
		msgbox.appendChild(contents[i]);
	}
	
	return msgbox;
}

/**
 * Generate add event success box.
 */ 
contentScript.createSuccessBox = function()
{
	var contents = [];

	var successText = document.createElement("p");
	$(successText).addClass('promptText').text('Event add success, please check it out on the popup.');
	
	var successImg = document.createElement("img");
	var url = chrome.extension.getURL("success.png") ;
	$(successImg).attr({'id':'success','src':url,'align':'center'});
	
	var successImgDiv = document.createElement("div");
	$(successImgDiv).attr({'align':'center'}).append($(successImg));

	contents.push(successText);
	contents.push(successImgDiv);	
	var datebox = contentScript.createMsgBox(contents,"sucessbox");

	var dimmer = document.createElement("div");
	$(dimmer).attr({'id':'dimmer3','class':'dimmer'});

	$('body').append(dimmer,datebox);
	
	$("#dimmer3").click(function() {
		$("#sucessbox").fadeOut();
		$("#dimmer3").fadeOut();
		$("#sucessbox").remove();
		$("#dimmer3").remove();
	});
		
	$('#sucessbox').fadeIn();		
	$('#dimmer3').fadeIn();	
}

/**
 * Create date time prompt box.
 */ 
contentScript.createDateBox = function()
{
	var contents = [];
console.log("what the fuck");
	var dateText = document.createElement("p");
	$(dateText).addClass('promptText');
	$(dateText).text("Format can't be recognized, please input the date and time.");
	
	var dateInput = document.createElement("input");
	$(dateInput)
		.attr(
			{
				'id':'date',
				'type':'text',
				'data-field':'datetime',
				'class':'inputbox'
			}
		)

	var dateInputDiv = document.createElement("div");
	$(dateInputDiv).attr({'align':'center'}).append($(dateInput));
	
	var btn = document.createElement("input");
	$(btn).attr(
		{
			'type':'button',
			'value':'Submit',
			'id':'dateOk',
			'class':'calButton'
		}
	)
	
	var btnDiv = document.createElement("div");
	$(btnDiv).attr({'align':'center','class':'calButton'}).append($(btn));
	
	var dtBox = document.createElement("div");
	$(dtBox).attr({'id':'dtBox'});

	contents.push(dateText);
	contents.push(dateInputDiv);
	contents.push(btnDiv);
	contents.push(dtBox);
	
	var datebox = contentScript.createMsgBox(contents,"datebox");
	
	var dimmer = document.createElement("div");
	$(dimmer).attr({'id':'dimmer1','class':'dimmer'});

	$('body').append(dimmer,datebox);
	
	$("#dateOk").click(function() {

		var date = $("#date").val();
		chrome.runtime.sendMessage({action: "open_date_box",value:date});

		$("#datebox").fadeOut();
		$("#dimmer1").fadeOut();
		$("#datebox").remove();
		$("#dimmer1").remove();
	});
	
	$("#dimmer1").click(function() {
		$("#datebox").fadeOut();
		$("#dimmer1").fadeOut();
		$("#datebox").remove();
		$("#dimmer1").remove();
	});
	
 	$(document).ready(function()
	{
	  console.log("init dtbox");
	  $("#dtBox").DateTimePicker();		   
	}); 
	
	$('#datebox').fadeIn();		
	$('#dimmer1').fadeIn();	
}

/**
 * Create title prompt box.
 */ 
contentScript.createTitleBox = function()
{
	var contents = [];

	var titleText = document.createElement("p");
	$(titleText).addClass('promptText').text('Set event title.');

	var titleInput = document.createElement("input");
	$(titleInput).attr(
		{
			'id':'title',
			'type':'text',
			'class':'inputbox'
		}
	)
	
	var titleInputDiv = document.createElement("div");
	$(titleInputDiv).attr({'align':'center'}).append(titleInput);

	var btn = document.createElement("input");
	$(btn).attr(
		{
			'type':'button',
			'value':'Submit',
			'id':'titleOk',
			'class':'calButton'
		}
	)

	var btnDiv = document.createElement("div");
	$(btnDiv).attr({'align':'center','class':'calButton'}).append($(btn));

	contents.push(titleText);
	contents.push(titleInputDiv);
	contents.push(btnDiv);
	
	var titlebox = contentScript.createMsgBox(contents,"titlebox");
	
	var dimmer = document.createElement("div");
	$(dimmer).attr({'id':'dimmer2','class':'dimmer'});
	
	$('body').append(dimmer,titlebox);

	$("#titleOk").click(function() {
		title = $("#title").val();
		chrome.runtime.sendMessage({action: "open_title_box",value:title});
		$("#titlebox").fadeOut();
		$("#dimmer2").fadeOut();
		$("#titlebox").remove();
		$("#dimmer2").remove();		
	});
	
	$("#dimmer2").click(function() {
		$("#titlebox").fadeOut();
		$("#dimmer2").fadeOut();
		$("#titlebox").remove();
		$("#dimmer2").remove();
	});
	
	$('#titlebox').fadeIn();		
	$('#dimmer2').fadeIn();	
}

function messageHandler(msg, sender, sendResponse)
{
	if(msg.action == "open_time_box")
	{
		console.log("open time msg received in content script");
		contentScript.createDateBox();
	}
	
	if(msg.action == "open_title_box")
	{
		console.log("open title msg received in content script");
		contentScript.createTitleBox();	
	}
	
	if(msg.action == "add_event_sucess")
	{
		console.log("add_event_sucess msg received in content script");
		contentScript.createSuccessBox();
	}
}

chrome.extension.onMessage.addListener(messageHandler);






