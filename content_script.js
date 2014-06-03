function createSuccessBox()
{
	var contents = [];

	var success_text = document.createElement("p");
	success_text.setAttribute("class","promptText");
	success_text.appendChild(document.createTextNode("Event add success, please check it out on the popup."));
	
	
	var success_img = document.createElement("img");
	success_img.setAttribute("id","success");
	var url = chrome.extension.getURL("success.png") ;
	success_img.setAttribute("src",url);
	success_img.setAttribute("align","center");
	
	var success_img_div = document.createElement("div");
	success_img_div.appendChild(success_img);
	success_img_div.setAttribute("align","center");

	contents.push(success_text);
	contents.push(success_img_div);	
	var datebox = createMsgBox(contents,"sucessbox");

	
	var dimmer = document.createElement("div");
	dimmer.setAttribute("id","dimmer3");
	dimmer.setAttribute("class","dimmer");
	$('body').append(dimmer);
	$('body').append(datebox);
	
	$("#dimmer3").click(function() {
		$("#sucessbox").fadeOut();
		$("#dimmer3").fadeOut();
		$("#sucessbox").remove();
		$("#dimmer3").remove();
	});
		
	$('#sucessbox').fadeIn();		
	$('#dimmer3').fadeIn();	
}

function createMsgBox(contents,id)
{
	var logo = document.createElement("div")
	logo.setAttribute("class","logo");
	var logo_text = document.createTextNode("Calendar++");
	logo.appendChild(logo_text);

	var msgbox = document.createElement( 'div' );
	msgbox.setAttribute("id",id);
	msgbox.setAttribute("class","msgbox");
	msgbox.appendChild(logo);
	for(var i=0;i<contents.length;i++)
	{
		msgbox.appendChild(contents[i]);
	}
	
	return msgbox;
}

function createDateBox()
{
	var contents = [];

	var date_text = document.createElement("p");
	date_text.setAttribute("class","promptText");
	date_text.appendChild(document.createTextNode("Format can't be recognized, please input the date and time."));
	var date_input = document.createElement("input");
	date_input.setAttribute("id","date");
	date_input.setAttribute("type","text");
	date_input.setAttribute("data-field","datetime");	
	date_input.setAttribute("class","inputbox");
	
	var date_input_div = document.createElement("div");
	date_input_div.appendChild(date_input);
	date_input_div.setAttribute("align","center");
	
	var btn = document.createElement("input");
	btn.setAttribute("type","button");
	btn.setAttribute("value","Submit");
	btn.setAttribute("id","dateOk");
	btn.setAttribute("class","calButton");
	var btnDiv = document.createElement("div");
	btnDiv.setAttribute("align","center");
	btnDiv.appendChild(btn);
	btnDiv.setAttribute("class","calButton");
	
	var dtBox = document.createElement("div");
	dtBox.setAttribute("id","dtBox");

	contents.push(date_text);
	contents.push(date_input_div);
	contents.push(btnDiv);
	contents.push(dtBox);
	
	var datebox = createMsgBox(contents,"datebox");
	
	var dimmer = document.createElement("div");
	dimmer.setAttribute("id","dimmer1");
	dimmer.setAttribute("class","dimmer");
	$('body').append(dimmer);
	$('body').append(datebox);
	
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

function createTitleBox()
{
	var contents = [];

	var title_text = document.createElement("p");
	title_text.setAttribute("class","promptText");
	title_text.appendChild(document.createTextNode("Set event title."));
	var title_input = document.createElement("input");
	title_input.setAttribute("id","title");
	title_input.setAttribute("type","text");
	title_input.setAttribute("class","inputbox");
	
	var title_input_div = document.createElement("div");
	title_input_div.appendChild(title_input);
	title_input_div.setAttribute("align","center");
			
	var btn = document.createElement("input");
	btn.setAttribute("type","button");
	btn.setAttribute("value","Submit");
	btn.setAttribute("id","titleOk");
	btn.setAttribute("class","calButton");
	var btnDiv = document.createElement("div");
	btnDiv.setAttribute("align","center");
	btnDiv.appendChild(btn);
	btnDiv.setAttribute("class","calButton");

	contents.push(title_text);
	contents.push(title_input_div);
	contents.push(btnDiv);
	
	var titlebox = createMsgBox(contents,"titlebox");
	var dimmer = document.createElement("div");
	dimmer.setAttribute("id","dimmer2");
	dimmer.setAttribute("class","dimmer");
	//$("#dimmer2").hide();
	$('body').append(dimmer);
	$('body').append(titlebox);

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
		createDateBox();
	}
	
	if(msg.action == "open_title_box")
	{
		console.log("open title msg received in content script");
		createTitleBox();	
	}
	
	if(msg.action == "add_event_sucess")
	{
		console.log("add_event_sucess msg received in content script");
		createSuccessBox();
	}
}

chrome.extension.onMessage.addListener(messageHandler);






