var map;

function initMap() {
  var gm = google.maps;  
  var geocoder = new google.maps.Geocoder;
  map = new gm.Map(document.getElementById('map'), {
    mapTypeId: gm.MapTypeId.ROADMAP,
    center: new gm.LatLng(-25.4284, -49.2733), zoom: 14,  // whatevs: fitBounds will override
  });

  /*google.maps.event.addListener(map, 'zoom_changed', function(){
	geocoder.geocode({'location': map.getCenter()}, function(results, status) 
	{
		if (status === google.maps.GeocoderStatus.OK) {
		  if (results[1]) {
		  	var length = results[1].address_components.length;
		  	
		  	if(length>6) console.log(results[1].address_components[length-2].short_name+'-'+results[1].address_components[length-3].short_name);
		   	else console.log(results[1].address_components[length-1].short_name+'-'+results[1].address_components[length-2].short_name);	

		   	//console.log(results[1].address_components);
		  } else {
		    window.alert('No results found');
		  }
		} else {
		  window.alert('Geocoder failed due to: ' + status);
		}
	});
  });*/  


}

