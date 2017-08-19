var CLEAR_ONCE = 0;
var item_position = 1;
var big_carousel_size =10;
var big_carousel = [];
var init_pos = 0;
var end_pos = 0;

var actual_index = 0;

function init_carousel(){
	$(document).ready(function(){
		$('.owl-carousel').owlCarousel({
		    center:true,
		    margin:5,
		    loop:true,
		    responsive:{
		        0:{ items:2 },
		        600:{ items:2 },
		        1000:{ items:4 }
		    }
		});
		$('.datepicker').pickadate({
			containerHidden: '#hidden-input-outlet',
		    selectMonths: true, // Creates a dropdown to control month
		    selectYears: 15 // Creates a dropdown of 15 years to control year
	  	});
		$(document).ready(function(){
		  $('.modal').modal({
		      dismissible: true, // Modal can be dismissed by clicking outside of the modal
		      opacity: 0.4, // Opacity of modal background
		      inDuration: 10, // Transition in duration
		      outDuration: 10, // Transition out duration
		      startingTop: '4%', // Starting top style attribute
		      endingTop: '10%', // Ending top style attribute
		      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
		        //console.log('openned');
		      },
		      complete: function(modal) { 
		      	var elem = document.getElementById("remove_tag");
		      	if(elem !== null) elem.parentNode.removeChild(elem);
		      	OPEN_MODAL=0;
		      } // Callback for Modal close
		    }
		  );
		});
	});
	senseCarousel();
}

function senseCarousel(){
	var start_car = 0;
	var end_car = 0;
	var dif_car = 0;
	var owl = $('.owl-carousel');
	owl.owlCarousel();
	owl.on('drag.owl.carousel', function(event) {
		start_car = event.item.index;
		//console.log('Start_Car '+ start_car);
		OPEN_MODAL = 0;
	})
	owl.on('translated.owl.carousel', function(event) {
		OPEN_MODAL = 1;
	})
	owl.on('dragged.owl.carousel', function(event) {
		end_car = event.item.index;
		//console.log('End_Car '+ end_car);
		if(end_car>start_car){
			dif_car = end_car - start_car;
			console.log("Move Left by " + dif_car);
			actual_index+=dif_car;
			if(actual_index>=big_carousel.length)actual_index=0;
			jump(actual_index,actual_pin);
		}
		else{
			dif_car = start_car-end_car;
			console.log("Move Right " + dif_car);
			actual_index-=dif_car;
			if(actual_index<0)actual_index=big_carousel.length-1;
			jump(actual_index,actual_pin);
		}
		console.log("Actual Index " + actual_index);
		if(actual_data.length>=big_carousel_size) {
			if(SEARCH_===0) {
				addNext();
			}
		}
	})
}

function addNext(){
	if(end_pos >= actual_data.length);
	else{
		getItemCarousel_(actual_data[end_pos]._id, 1);
		end_pos++;
	}
}

var getItem_= function(id) {
	var promise = new Promise (
	  function(resolve, reject) {
	    doSearch(getById_(id), 
	      function getData(value) {
	        var dat = value.val();
	        if( dat === null ) { return; } // wait until we get data
	        value.ref.off('value', getData);
	        value.ref.remove();
	        if(dat.hits!==null && dat.hits[0]!==undefined){
				if(CLEAR_ONCE===0) { clearCarousel(); CLEAR_ONCE=1; }
				//console.log(big_carousel.length);
	            if(big_carousel.length<big_carousel_size){
	            	big_carousel.push (dat.hits[0]);
	            	build_carousel_item (dat.hits[0]);	
	        	}
	            resolve(dat.hits);
	        }
	        else{
	          reject(Error("There is no data!"));
	        }          
	      }
	    );
	  }
	);
	promise.then(function(result) {
	  //filterData(result);
	}).catch(function(err) {
	  console.log(err); 
	});  
}

var getItemCarousel_ = function(id, push) {
	var promise = new Promise (
	  function(resolve, reject) {
	    doSearch(getById_(id), 
	      function getData(value) {
	        var dat = value.val();
	        if( dat === null ) { return; } // wait until we get data
	        value.ref.off('value', getData);
	        value.ref.remove();
	        if(dat.hits!==null){
	          //if(push===1) 
	          big_carousel.push(dat.hits[0]); // at the end
	          build_carousel_item(dat.hits[0]);
	          //else if(push===0) big_carousel.unshift(dat.hits[0]); //at the beginning
	          resolve(dat.hits);
	        }
	        else{
	          reject(Error("There is no data!"));
	        }          
	      }
	    );
	  }
	);
	promise.then(function(result) {
	  //filterData(result);
	}).catch(function(err) {
	  console.log(err); 
	});  
}	

function makeCarousel(){
	var loop = big_carousel_size;
	if(actual_data.length<big_carousel_size) loop = actual_data.length;
	console.log('Make it to '+ actual_data.length);
	CLEAR_ONCE=0;
	for(var i=0;i<loop;i++){
		//console.log(actual_data[i]._id);
		getItem_(actual_data[i]._id);
	}
	jump(0,0);
}

function clearCarousel(){
	var size = 0;
	if(big_carousel.length===0)size = actual_data.length;
	else size = big_carousel.length;
	//console.log('clear for ' + size);
	for(var i = 0 ; i<size*2; i++){
		$('.owl-carousel').trigger('remove.owl.carousel',i);
	}
	big_carousel = [];
}

function build_carousel(index){
	var i = 2;
	var e = 4;
	for(var a=i+index;a<=e+index;a++){
		//console.log(big_carousel[i]._id);
		build_carousel_item(big_carousel[a]);
	}
}

function showme(){
	//Waits until the last search to clear carousel
	console.log(actual_data.length);
	console.log(actual_markers);
	for(var i = 0 ; i<big_carousel.length ; i++){
		//console.log(big_carousel[i]);
	}
}

function build_carousel_item (data) {
	if(data===undefined)return;
	var event_info = document.createElement('div');
	event_info.className = "box event_info";
	event_info.id = data._id;		
	event_info.onclick = function(){
		openMyModal(this.id);
	};	
		var box_photo = document.createElement('div');
		box_photo.className = "box photo";
			var img = document.createElement('img');
			img.src = data._source.photo_path;
			box_photo.appendChild(img);
		var box_info = document.createElement('div');
		box_info.className = "box info";
			var p_title = document.createElement('p');
			p_title.className = "title";
			p_title.appendChild(document.createTextNode(data._source.name));
			var p_place = document.createElement('p');
			p_place.className = "text_orange";
			p_place.appendChild(document.createTextNode(data._source.place_name));
			var p_addr = document.createElement('p');
			p_addr.className = "text";
			p_addr.appendChild(document.createTextNode(data._source.street));				
			var p_init= document.createElement('p');
			p_init.className = "text";
			p_init.appendChild(document.createTextNode(data._source.datetime_init+' até'));
			var p_end = document.createElement('p');
			p_end.className = "text";
			p_end.appendChild(document.createTextNode(data._source.datetime_end));
			var p_site = document.createElement('p');
			p_site.className = "text";
			p_site.appendChild(document.createTextNode('Site'));
			var p_desc = document.createElement('p');
			p_desc.className = "describe";
			p_desc.appendChild(document.createTextNode(data._source.description));
			box_info.appendChild(p_title);	
			box_info.appendChild(p_place);
			box_info.appendChild(p_init);
			box_info.appendChild(p_end);
			box_info.appendChild(p_addr);
			//box_info.appendChild(p_site);
			box_info.appendChild(p_desc);
	event_info.appendChild(box_photo);
	event_info.appendChild(box_info);
	$('.owl-carousel').owlCarousel('add', event_info).owlCarousel('update');
	//$('.owl-carousel').trigger('to.owl.carousel', 1);
}

function build_carousel_item_(data) {
	if(data===undefined)return;
	var event_info = document.createElement('div');
	event_info.className = "box event_info";
	event_info.id = data._id;		
	event_info.onclick = function(){
		openMyModal_(this.id);
	};	
		var box_photo = document.createElement('div');
		box_photo.className = "box photo";
			var img = document.createElement('img');
			img.src = data._source.photo_path;
			box_photo.appendChild(img);
		var box_info = document.createElement('div');
		box_info.className = "box info";
			var p_title = document.createElement('p');
			p_title.className = "title";
			p_title.appendChild(document.createTextNode(data._source.name));
			var p_place = document.createElement('p');
			p_place.className = "text_orange";
			p_place.appendChild(document.createTextNode(data._source.place_name));
			var p_addr = document.createElement('p');
			p_addr.className = "text";
			p_addr.appendChild(document.createTextNode(data._source.street));				
			var p_init= document.createElement('p');
			p_init.className = "text";
			p_init.appendChild(document.createTextNode(data._source.datetime_init+' até'));
			var p_end = document.createElement('p');
			p_end.className = "text";
			p_end.appendChild(document.createTextNode(data._source.datetime_end));
			var p_site = document.createElement('p');
			p_site.className = "text";
			p_site.appendChild(document.createTextNode('Site'));
			var p_desc = document.createElement('p');
			p_desc.className = "describe";
			p_desc.appendChild(document.createTextNode(data._source.description));
			box_info.appendChild(p_title);	
			box_info.appendChild(p_place);
			box_info.appendChild(p_init);
			box_info.appendChild(p_end);
			box_info.appendChild(p_addr);
			//box_info.appendChild(p_site);
			box_info.appendChild(p_desc);
	event_info.appendChild(box_photo);
	event_info.appendChild(box_info);
	$('.owl-carousel').owlCarousel('add', event_info).owlCarousel('update');
	$('.owl-carousel').trigger('to.owl.carousel', 1);
}