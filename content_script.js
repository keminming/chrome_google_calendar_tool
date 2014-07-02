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
 * Initilize modal box.
 */
contentScript.init = function(){
	$.get(chrome.extension.getURL('/modal-dt.html'), function(data) {
		$(data).appendTo('body');
		$("#modal-dt").easyModal(
			{
				overlay : 0.4,
				onClose: function(myModal){
					$('#date').val("");
					$('#title').val("");
				}
			}
		);
	});

	$.get(chrome.extension.getURL('/modal-s.html'), function(data) {
		$(data).appendTo('body');
		$("#modal-s").easyModal();
	});
}

/**
 * Show prompt box.
 */
contentScript.showPromptBox = function(isValid,date)
{
	if(isValid)
	{
		console.log(date);
		$("#date").val(date);
	}
	
	$("#suggestion").text("Start time").css({"font-weight": "bold"});
	$("#titleText").text("Event title").css({"font-weight": "bold"});

	$("#modal-dt").trigger('openModal');
	
	$("#ok").unbind("click");
	$("#ok").click(function() {
		var date = $("#date").val();
		var title = $("#title").val();
		chrome.runtime.sendMessage({"action": "open_prompt_response","date":date,"title":title});
		$('#modal-dt').trigger('closeModal');
	});	
}

/**
 * Show success box.
 */
contentScript.showSuccessBox = function()
{
	$("#modal-s").trigger('openModal');
	var url = chrome.extension.getURL("success.png") ;
	$("#success").attr({'id':'success','src':url,'align':'center'});
	setTimeout(function(){		
	$('#modal-s').trigger('closeModal');},2000);
}

function messageHandler(msg, sender, sendResponse)
{
	if(msg.action == "open_prompt")
	{
		console.log("open prompt content script");
		contentScript.showPromptBox(msg.isValid,msg.date);
		console.log(msg.isValid);
	}
		
	if(msg.action == "add_event_sucess")
	{
		console.log("add_event_sucess msg received in content script");
		contentScript.showSuccessBox();
	}
}

	
contentScript.init();
chrome.extension.onMessage.addListener(messageHandler);






