
function init(){
	init_carousel();
	initMap();
}

function loadCalendar(){
	var $input = $('.datepicker').pickadate();
	// Use the picker object directly.
	var picker = $input.pickadate('picker');
	picker.open();
	// If a “click” is involved, prevent the event bubbling.
	event.stopPropagation();
	// If we want to maintain focus on the input,
	// prevent the default action on “mousedown”.
	event.preventDefault();
}

