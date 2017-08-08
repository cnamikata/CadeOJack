var global_data;
var global_cluster;
var actual_markers;
var actual_pin;
var last_pin;
var infowindow;
var mask; 
var oms;

var thread_count = 0;
var markers = [];
var actual_data = [];

function getWeekDay(intd){
	switch(intd){
	  case 0: return 'Dom';
	  case 1: return 'Seg'; 
	  case 2: return 'Ter'; 
	  case 3: return 'Qua'; 
	  case 4: return 'Qui'; 
	  case 5: return 'Sex'; 
	  case 6: return 'Sáb';  
	}
}

function getMonth(intm){
	switch(intm){
	  case 0: return 'Janeiro'; 
	  case 1: return 'Fevereiro'; 
	  case 2: return 'Março'; 
	  case 3: return 'Abril'; 
	  case 4: return 'Maio'; 
	  case 5: return 'Junho'; 
	  case 6: return 'Julho';
	  case 7: return 'Agosto'; 
	  case 8: return 'Setembro'; 
	  case 9: return 'Outubro'; 
	  case 10: return 'Novembro'; 
	  case 11: return 'Dezembro'; 
	}
}

function addZero(i) { if (i < 10) { i = "0" + i; } return i; }

function getDataHora(array){
	var date = new Date(array);
	return (getWeekDay(date.getDay())+', '+date.getDate()+' de '+getMonth(date.getMonth())+' às '+date.getHours()+':'+addZero(date.getMinutes()));
}

function linkify(text) {
	var links = [];
	var counter = 0;
	var urlRegex =/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
	if(text!==undefined){
		text.replace(urlRegex, function(url) {
			links[counter]=url;
			counter++;
		});
	}
	return links;
}

function PushEventOnFirebase(event) {
	var data = new Array(13);
	// url da foto do evento
	data[0] = event.picture.data.url;
	// nome do evento
	data[1] = event.name;
	// início do evento
	data[2] = getDataHora(event.start_time);          
	// fim do evento
	if(event.end_time !== undefined){
		// fim do evento
		data[3] = getDataHora(event.end_time);            
	}
	else data[3] = '';
	data[4] = event.place.location.latitude;
	data[5] = event.place.location.longitude;
	data[6] = event.place.location.country;
	data[7] = event.place.location.state; 
	data[8] = event.place.location.city;
	data[9] = event.place.location.street;  
	data[10] = event.description; 
	data[12] = linkify(data[10]);
	data[11] = event.place.name; 

	if(data[0]===undefined)data[0]='';
	if(data[1]===undefined)data[1]='';
	if(data[4]===undefined)data[4]='';  
	if(data[5]===undefined)data[5]='';  
	if(data[6]===undefined)data[6]='Events';
	if(data[7]===undefined)data[7]='Data';
	if(data[8]===undefined)data[8]='Sao Paulo';
	if(data[9]===undefined)data[9]='';  
	if(data[10]===undefined)data[10]='';  
	if(data[11]===undefined)data[11]='';
	if(data[12]===undefined)data[12]='';

	var ref = firebase.database().ref();
	ref = ref.child("Events"); //Events
  	var nkey = firebase.database().ref().push().key; //Get the key
  	
	var strloc = String(data[4]) +','+ String(data[5]); //location (lat,lng)
	var postData = {
		photo_path: data[0],
		name: data[1],
		description: data[10],			
		location: strloc,			
		country: data[6],
		state: data[7],
		city: data[8],
		street: data[9],
		datetime_init: data[2],
		datetime_end: data[3],
		place_name: data[11],
		links: data[12]
	};
	var postLoc = {
		location: strloc,
		id: nkey
	};
	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/Data/' + nkey] = postData;
	updates['/GeoLoc/' + nkey] = postLoc;
	return firebase.database().ref().update(updates);
} 

function getEvents() {
	var fb = firebase.database().ref("Brazil");
	getEventsFirebase(fb, 'SP', function(data) {    	
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

