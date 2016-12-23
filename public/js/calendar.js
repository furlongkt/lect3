function deleteEvent(id,title) {
	if(confirm("Are you sure you want to delete "+title +"?")){
		$.ajax({
	        type: 'DELETE',
	        url: '/event/'+id,
	        contentType: 'application/json',
	        data: JSON.stringify({"id":id}),
	        success : function(res){
	            if(res.success){
	                alert(title+" has been successfully deleted.");
	                location.reload();
	            }else{
	                alert("Error: The event you are trying to delete could not be found.");
	            }
	        },
	        error: function(xhr){
	            alert("Error: The server is currently unavailble, please try again later.");
	        }
	    });
	}
    
}

function addEvent(event){
	delete event.id;
	$.ajax({
        type: 'POST',
        url: '/event',
        contentType: 'application/json',
        data: JSON.stringify(event),
        success : function(res){
            if(res.success){
                alert(event.title+" has been successfully created.");
                location.reload();
            }else{
            	document.getElementById('form-errors').style.display='block';
            	err = "";
            	res.errors.forEach((e)=>{
            		err = err + "\n<li>"+e.msg+"</li>";
            	});
                $("#form-errors").html("<i class=\"fa fa-times-circle\"></i><ul>"+err+"</ul>");
            }
        },
        error: function(xhr){
            alert("Error: The server is currently unavailble, please try again later.");
        }
    });
}

function updateEvent(event){
	delete event.id;
	$.ajax({
        type: 'PUT',
        url: '/event/'+event.id,
        contentType: 'application/json',
        data: JSON.stringify(event),
        success : function(res){
            if(res.success){
                alert(event.title+" has been successfully updated.");
                location.reload();
            }else{
            	err = "";
            	res.errors.forEach((e)=>{
            		err = err + "\n<li>"+e.msg+"</li>";
            	});
                $("#form-errors").html("<i class=\"fa fa-times-circle\"></i><ul>"+err+"</ul>");
            }
        },
        error: function(xhr){
            alert("Error: The server is currently unavailble, please try again later.");
        }
    });
}

function goBack() {
    window.history.back();
}

function eventFormSubmitted(){
	$("#form-errors").html("");
	var date = document.getElementById("form-date").value;
	console.log("Date: "+date);
	date =date.split('-');

	event={
		"id": document.getElementById("form-id").value,
		"month": (parseInt(date[1])-1)+"",
		"day": date[2],
		"year": date[0],
		"title": document.getElementById("form-title").value,
		"location": document.getElementById("form-location").value,
		"description": document.getElementById("form-description").value
	}
	if(event.id!=""){
		updateEvent(event);
	}else{
		addEvent(event);
	}
}