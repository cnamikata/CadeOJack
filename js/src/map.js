var map;
var bound_nw;
var bound_se;
var build_once = 0;
var threads = 5;

function initMap() {
	var gm = google.maps;  
	var geocoder = new google.maps.Geocoder;

	map = new gm.Map(document.getElementById('map'), {
		mapTypeId: gm.MapTypeId.ROADMAP,
		center: new gm.LatLng(-23.5489, -46.6388), 
    zoom: 16,  // whatevs: fitBounds will override
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
    }
	});

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

	/* Get Map Bounds */
	google.maps.event.addListener(map, 'bounds_changed', function(){
	    var bounds = map.getBounds();
		  var aNorth  =   bounds.getNorthEast().lat();   
    	var aEast   =   bounds.getNorthEast().lng();
    	var aSouth  =   bounds.getSouthWest().lat();   
    	var aWest   =   bounds.getSouthWest().lng();
    	var nw = new google.maps.LatLng(aNorth, aWest);
    	var se = new google.maps.LatLng(aSouth, aEast);	    
	    /*var marker = new google.maps.Marker({
  			position: nw,
  			map: map,
  			icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  		});*/
  		bound_nw = nw;
  		bound_se = se;
      var search_value = document.getElementById("search_value").value;
      console.log(search_value);
      if(search_value==="" && TODAY===0 && TOMORROW===0 && CALENDAR===0) {
        thread_count=0;
        clearPinPoints(); //Clear pinpoints
        actual_data = []; //Clear all data
        end_pos = big_carousel_size;
        actual_index=0;
        SearchBounds_thread(bound_nw, bound_se);
      }
	});  
}

function pinPoint(item){  
  var latlong =  item._source.location.split(",");
  var latitude = parseFloat(latlong[0]);
  var longitude = parseFloat(latlong[1]);
  var myLatLng = {lat: latitude, lng: longitude}; 
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    optimized: false,
    icon: 'img/topshit.png',
    title: item._source.name
  });     
  google.maps.event.addListener(marker, 'click', (function (marker, a) {
    return function(){
      openMyModal_(item._id);
    }     
  })(marker, 0));  
  markers.push(marker);    
}

function SearchBounds_thread(bound_nw, bound_se){
  var increase_lng = (bound_nw.lng()-bound_se.lng())/threads;
  var line_path = [];
  var nw = new google.maps.LatLng(bound_nw.lat(), bound_se.lng()+increase_lng);
  var se = bound_se;
  var nw_;
  var se_;
  /* Sequencia  4 3 2 1 0
                4 2 0 1 3 para manter sempre no meio e expandindo */
  nw_ = new google.maps.LatLng(bound_nw.lat(), nw.lng()+2*increase_lng);
  se_ = new google.maps.LatLng(bound_se.lat(), se.lng()+2*increase_lng); 
  funqueue.push(wrapFunction(SearchBounds_, this, [nw_,se_])); 

  nw_ = new google.maps.LatLng(bound_nw.lat(), nw.lng()+1*increase_lng);
  se_ = new google.maps.LatLng(bound_se.lat(), se.lng()+1*increase_lng); 
  funqueue.push(wrapFunction(SearchBounds_, this, [nw_,se_])); 

  nw_ = new google.maps.LatLng(bound_nw.lat(), nw.lng()+3*increase_lng);
  se_ = new google.maps.LatLng(bound_se.lat(), se.lng()+3*increase_lng); 
  funqueue.push(wrapFunction(SearchBounds_, this, [nw_,se_])); 

  nw_ = new google.maps.LatLng(bound_nw.lat(), nw.lng()+0*increase_lng);
  se_ = new google.maps.LatLng(bound_se.lat(), se.lng()+0*increase_lng); 
  funqueue.push(wrapFunction(SearchBounds_, this, [nw_,se_])); 

  nw_ = new google.maps.LatLng(bound_nw.lat(), nw.lng()+4*increase_lng);
  se_ = new google.maps.LatLng(bound_se.lat(), se.lng()+4*increase_lng); 
  funqueue.push(wrapFunction(SearchBounds_, this, [nw_,se_])); 
}

function clearPinPoints(){
  //Waits until the last search to clear carousel
  if(markers!==undefined){
    for (var i = 0; i < markers.length; i++){
      markers[i].setMap(null);
    }
    markers = [];
  }
  //global_cluster.clearMarkers();
}

function clearAll(){
  //Waits until the last search to clear carousel
  if(markers!==undefined){
    removeElements(actual_data.length);
    for (var i = 0; i < markers.length; i++) 
    {
      markers[i].setMap(null);
    }
    markers = [];
    actual_data = [];
    carrousel_counter=0;
  }
  //global_cluster.clearMarkers();
}

function refreshData(){
  pinPoints(actual_data);
  document.getElementById("built_carousel").appendChild(build_carousel(actual_data));    
}

function jump(apin, lpin){
  //console.log("Jump Kanguru! " + actual_pin + " " + last_pin);
  markers[lpin].setAnimation(null); 
  markers[apin].setAnimation(google.maps.Animation.BOUNCE); 
  var search_value = document.getElementById("search_value").value;
  if(search_value!=="") {
    map.setCenter(markers[apin].position);
  }
}

function pinPoints(array){  
  var new_markers = []; 
  //oms = new OverlappingMarkerSpiderfier(map,{markersWontMove: true, markersWontHide: true, keepSpiderfied: true});    
  for(var a = 0; a < array.length; a++){
    var latlong =  array[a].location.split(",");
    var latitude = parseFloat(latlong[0]);
    var longitude = parseFloat(latlong[1]);
    var myLatLng = {lat: latitude, lng: longitude}; 
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      optimized: false,
      icon: 'img/topshit.png',
      title: array[a].name
    });     

    google.maps.event.addListener(marker, 'click', (function (marker, a) {
      return function(){
        openMyModal(a);
      }     
    })(marker, a));  

    new_markers.push(marker);      
    //Overlaping Marker Spider 
    //oms.addMarker(marker);
  }
  markers = new_markers;   
}


// USEFUL CODE..................................................................

/* Put the cluster in the map
global_cluster = new MarkerClusterer(map, actual_markers,
  {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', zoomOnClick:true});    
global_cluster.setMaxZoom(15);
google.maps.event.addListener(global_cluster, 'clusterclick', function(cluster){
  console.log(cluster); 
  });
*/

/* Get position of user in the map
// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.setCenter(pos);
  }, function() {
    console.log('ok!');
  });
} else {
  console.log('error!');
}*/

/*for(var i=0 ; i<divide_factor*2 ; i+=2){
  line_path[i]=nw;
  line_path[i+1]=se;    
  funqueue.push(wrapFunction(SearchBounds_, this, [line_path[i],line_path[i+1],i])); 
  var line = new google.maps.Polyline({
    path: line_path,
    geodesic: false,
    strokeColor: '#FF0000',
    strokeOpacity: 0.5,
    strokeWeight: 0.5
  });
  line.setMap(map); 
  nw = new google.maps.LatLng(bound_nw.lat(), nw.lng()+increase_lng);
  se = new google.maps.LatLng(bound_se.lat(), se.lng()+increase_lng); 
}*/


/* Zoom has changed event
google.maps.event.addListener(map, 'zoom_changed', function() {
  geocoder.geocode({'location': map.getCenter()}, function(results, status) {
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
});
*/  

