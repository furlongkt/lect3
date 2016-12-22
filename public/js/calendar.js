$(document).ready( function() {
        $('#selectedMonth').change(function() {
          // set the window's location property to the value of the option the user has selected
          location.href = "/view/"+ $(this).val() + "/"+$('#selectedYear').val();
        });
        $('#selectedYear').change(function() {
          // set the window's location property to the value of the option the user has selected
          location.href = "/view/"+ $("#selectedMonth").val() + "/"+$(this).val();
        });
        $("a#next").click(function(e){
        	e.preventDefault();
		      location.href = "/view/"+ nextMonthLink(parseInt($('#selectedMonth').val()),parseInt($('#selectedYear').val()));
		});
		$("a#prev").click(function(e){
        	e.preventDefault();
		      location.href = "/view/"+ prevMonthLink(parseInt($('#selectedMonth').val()),parseInt($('#selectedYear').val()));
		});
    });

function nextMonthLink(month,year){
	month++;
	if(month>=12){
		month = 0;
		year++;
	}
	return month+"/"+year;
}

function prevMonthLink(month,year){
	month--;
	if(month<0){
		month = 11;
		year--;
	}
	return month+"/"+year;
}

function deleteEvent(id,title) {
	if(confirm("Are you sure you want to delete "+title +"?")){
		$.ajax({
	        type: 'DELETE',
	        url: '/event/'+id,
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