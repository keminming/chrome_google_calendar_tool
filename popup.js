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

if(localStorage.getItem("calendarID") === null)
{
	var p=document.createElement("p");
	var t=document.createTextNode("Your google calendar ID:");
	var body = document.getElementById("b");
	p.appendChild(t);
	body.appendChild(p);
	
	var txt = document.createElement("input");
	txt.setAttribute('id', 'calendarID');
	txt.setAttribute('value', 'username@gmail.com');
	document.body.appendChild(txt);

	var btn = document.createElement("button");
	btn.setAttribute('id', 'submit');
	var t1=document.createTextNode("Submit");
	btn.appendChild(t1);
	btn.addEventListener('click', trackButtonClick);
	document.body.appendChild(btn);
}
else
{
	var body = document.getElementById("b");
	var p=document.createElement("p")
	var t=document.createTextNode("Your google calendar ID:");
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
	
}
