var global_ul;
var global_data;
var global_cluster;
var actual_data;
var actual_markers;
var infowindow; 
var oms;

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBAgkgRx8W7D4RENNy7whsZ4u3sY-t9BPE",
	authDomain: "agoraehora-e85e0.firebaseapp.com",
	databaseURL: "https://agoraehora-e85e0.firebaseio.com",
	storageBucket: "agoraehora-e85e0.appspot.com",
	messagingSenderId: "542359695910"
};

firebase.initializeApp(config);

function checkDuplicates(name){
	//Check if exists an event already created on the DB
	var bla = 0;
	var ret = doSearch(buildQueryName(name), showOnly(bla));
	console.log(ret);
	return true;
}

function saveOnFirebase(array) {
	for(var a = 0; a < array.length; a++){ 
	  var ref = firebase.database().ref();
	  if(array[a][5][2]==undefined)array[a][5][2]='Brazil';
	  if(array[a][5][3]==undefined)array[a][5][3]='PR';
	  if(array[a][5][4]==undefined)array[a][5][4]='Curitiba';
	  if(array[a][5][5]==undefined)array[a][5][5]='';      
	  if(array[a][0]==undefined)array[a][0]='';
	  if(array[a][1]==undefined)array[a][1]='';
	  if(array[a][6]==undefined)array[a][6]='';
	  ref = ref.child(array[a][5][2]);
	  ref = ref.child(array[a][5][3]);      
	  if(checkDuplicates(array[a][1])){
	 	/*ref.push({
		  photo_path: array[a][0],
		  name: array[a][1],
		  description: array[a][6],
		  lat: array[a][5][0],
		  lng: array[a][5][1],
		  country: array[a][5][2],
		  state: array[a][5][3],
		  city: array[a][5][4],
		  street: array[a][5][5],
		  datetime_init: array[a][3],
		  datetime_end: array[a][4]
		});*/
	  }
	}
} 

function filterByDate(array, date, major){
	var filtered = [];
	for(var i = 0; i < array.length; i++){ 
		var newdate = new Date(array[i].datetime_init);
		var mes = newdate.getMonth()+1;
		var dia = newdate.getDate();
		var ano = newdate.getFullYear();
		if(major==0){
			if(ano==date[0] && mes==date[1] && dia==date[2]){
			  filtered.push(array[i]);
			}
		}
		else{
			if(ano>date[0]) filtered.push(array[i]);
				else if(ano==date[0]){
				if(mes>date[1]) filtered.push(array[i]);
				else if(mes==date[1]){
				  if(dia>date[2]) filtered.push(array[i]);
				  else{}
				}
			}
		}  
	} 
	return filtered;
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < actual_markers.length; i++) {
	  actual_markers[i].setMap(map);
	}
}

function clearAll(){
	document.getElementById("places").removeChild(global_ul);
	setMapOnAll(null);
	actual_markers = [];
	global_cluster.clearMarkers();
}

function refreshData(){
	pinPoints(actual_data);
	document.getElementById("places").appendChild(makeUL(actual_data));    
}

/* All the filter functions ...........................................................*/

function filterData(array){
	clearAll();
	for(var a=0;a<array.length;a++){
    	array[a].datetime_end = array[a]._source.datetime_end;
		array[a].datetime_init = array[a]._source.datetime_init;
		array[a].description = array[a]._source.description;
		array[a].lat = array[a]._source.lat;
		array[a].lng = array[a]._source.lng;
		array[a].name = array[a]._source.name;
		array[a].photo_path = array[a]._source.photo_path;
		array[a].street = array[a]._source.street;
  	}	
	actual_data = array;
	refreshData();
}

function filterNothing(){
    clearAll();    
    actual_data = global_data;
    refreshData();
}

function filterTomorrow(){
	clearAll(); 
	var startDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	var tomorrow = getToday(startDay);    
	var data_filtered = filterByDate(global_data, tomorrow, 0);
	actual_data = data_filtered;
	refreshData();
}

function filterToday(){       
	clearAll(); 
	var startDay = new Date();
	var today = getToday(startDay);
	var data_filtered = filterByDate(global_data, today, 0);
	actual_data = data_filtered;
	refreshData(); 
}

function filterAfter(){
    clearAll(); 
    var startDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var tomorrow = getToday(startDay);
    var data_filtered = filterByDate(global_data, tomorrow, 1);
    actual_data = data_filtered;
    refreshData();   
}

/*......................................................................................*/

function getEvents() {
	var fb = firebase.database().ref("Brazil");
	getEventsFirebase(fb, 'PR', function(data) {    	
    	pinPoints(data);
    	document.getElementById("places").appendChild(makeUL(data));    
    	global_data = data;
    	actual_data = data;
	});
}

var getEventsFirebase = function(fb, location, callback) {
  var data = [];    
  fb.child(location).once('value', function(snapshot) {
    snapshot.forEach(function(child) {      
      data.push(child.val());
    });
    callback(data);
  });  
};

function pinPoints(array){ 	
	var new_markers = []; 
	infowindow = new google.maps.InfoWindow();   
	oms = new OverlappingMarkerSpiderfier(map,{markersWontMove: true, markersWontHide: true, keepSpiderfied: true});		
	for(var a = 0; a < array.length; a++){ 
		var myLatLng = {lat: array[a].lat, lng: array[a].lng}; 
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: 'img/topshit.png',
			title: array[a].name
		});     
		google.maps.event.addListener(map, 'zoom_changed', (function (marker) {
			return function () {
			  infowindow.close(map, marker);
			}
		})(marker));  
		google.maps.event.addListener(map, 'mousemove', (function (marker) {
			return function () {
			  infowindow.close(map, marker);
			}
		})(marker));  
		google.maps.event.addListener(marker, 'mouseover', (function (marker, a) {
			return function () {
			  var contentString = makeContentString(array[a]);
			  infowindow.setContent(contentString);
			  infowindow.open(map, marker);
			}
		})(marker, a));  
		new_markers.push(marker);      
		oms.addMarker(marker);
	} 
	actual_markers = new_markers;    
	global_cluster = new MarkerClusterer(map, actual_markers,
	  {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', zoomOnClick:true});    
	global_cluster.setMaxZoom(15);

	google.maps.event.addListener(global_cluster, 'clusterclick', function(cluster){
	  console.log(cluster);
	});

	google.maps.event.addListener(map, 'zoom_changed', function(){
	  if(map.getZoom()>15){
	    setTimeout(openAllClusters, 500);
	    console.log('Ativa o Zoom '+ map.getZoom());
	  }
	});  
}

function makeContentString(array){
	var div = document.createElement('div');
	var divrow = document.createElement("div");    
	var cols3 = document.createElement("div"); 
	var cols9 = document.createElement("div"); 
	var h5 = document.createElement('h5');
	var p = document.createElement('p');    
	var img = document.createElement("img");
	cols3.className = "col s1";
	cols9.className = "col s11";       
	divrow.className = "row";
	img.src = array.photo_path;    
	var bold = document.createElement('strong');    
	var pinit = document.createElement('h6');
	pinit.appendChild(document.createTextNode(array.datetime_init.substring(0,22)));    
	var pend = document.createElement('h6');
	pend.appendChild(document.createTextNode(array.datetime_end.substring(0,22)));
	var padd = document.createElement('h6');
	padd.appendChild(document.createTextNode(array.street));          
	h5.appendChild(document.createTextNode(array.name));
	p.appendChild(document.createTextNode(array.description));    
	cols3.appendChild(img);
	cols9.appendChild(h5);
	divrow.appendChild(cols3);
	divrow.appendChild(cols9);    
	bold.appendChild(pinit);
	bold.appendChild(pend);
	bold.appendChild(padd);
	div.appendChild(divrow);
	div.appendChild(bold);
	div.appendChild(p);
	return div;
}

function reply_click(id){
    console.log(id);
    console.log(actual_data[id].lat);    
    console.log(actual_data[id].lng);
    var myLatLng = {lat: actual_data[id].lat, lng: actual_data[id].lng};
    //actual_markers[id].setAnimation(google.maps.Animation.BOUNCE);
    map.setCenter(myLatLng);
    console.log(actual_data[id].name);
}

function makeUL(array) {
	var ul = document.createElement('ul');
	ul.className = "collection";
	for(var i = 0; i < array.length; i++) {
		var li = document.createElement('li');
		li.id = i;
		li.onclick = function(){reply_click(this.id)};
		li.className = "collection-item avatar";
		var img = document.createElement("img");
		img.src = array[i].photo_path;
		img.className = "circle";
		var span = document.createElement('span');
		span.className = "title";
		span.appendChild(document.createTextNode(array[i].name));      

		var padd = document.createElement('p');
		padd.appendChild(document.createTextNode(array[i].street)); 
		var pinit = document.createElement('p');
		pinit.appendChild(document.createTextNode(array[i].datetime_init.substring(0,22)));
		var pend = document.createElement('p');
		pend.appendChild(document.createTextNode(array[i].datetime_end.substring(0,22)));

		li.appendChild(img);
		li.appendChild(span);
		li.appendChild(padd);
		li.appendChild(pinit);
		li.appendChild(pend);
		ul.appendChild(li);
	}
	global_ul = ul;
	return ul;
}
