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
		// Get the modal
		var modal = $('#myModal');

		// Get the button that opens the modal
		var btn = $("#myBtn");
		$('#create-form').submit(function(e){
			e.preventDefault();
		});

		// Get the <span> element that closes the modal
		var span = $(".close");

		//When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			console.log("Ran3!");
		    if (event.target == modal) {
		        modal.hide();
		    }
		}
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
function showModal(){
	console.log("Ran1!");
	$('#myModal').show();
}