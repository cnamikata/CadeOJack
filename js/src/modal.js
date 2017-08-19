var OPEN_MODAL = 0;
var COUNT_OPEN = 0;

var openMyModal_ = function(index) {
	var promise = new Promise (
	  function(resolve, reject) {
	    doSearch(getById_(index), 
	      function getData(value) {
	        var dat = value.val();
	        if( dat === null ) { return; } // wait until we get data
	        value.ref.off('value', getData);
	        value.ref.remove();
	        if(dat.hits!==null){
	          //console.log(dat.hits)
			  console.log(index+' DONOTOPEN->'+OPEN_MODAL);
	          document.getElementById("built_modal").appendChild(build_modal(dat.hits[0]._source));    
			  $('#built_modal').modal('open');
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

function openMyModal(index){
	console.log(index+' DONOTOPEN->'+OPEN_MODAL);
	if(OPEN_MODAL===1){
		var i = getIdByIndex(index);
		document.getElementById("built_modal").appendChild(build_modal(big_carousel[i]._source));    
		$('#built_modal').modal('open');
	}
	else{
		OPEN_MODAL=1;
	}
}

function getIdByIndex(index){
	for(var i =0;i<big_carousel.length;i++){
		if(index===big_carousel[i]._id) {
			return i;
			break;
		}
	}
}

function build_modal(array) {
	var modal_content = document.createElement('div');
	modal_content.className = "modal-content";	
	modal_content.id = "remove_tag";
		var modal_header = document.createElement('div');
		modal_header.className = "box_auto modal_header";
			var modal_txt = document.createElement('div');
			modal_txt.className = "modal_txt";
				var p_title = document.createElement('p');
				p_title.className = "title_modal";
				p_title.appendChild(document.createTextNode(array.name));
				var p_place = document.createElement('p');
				p_place.className = "text_modal";
				p_place.appendChild(document.createTextNode(array.place_name));
				var p_addr = document.createElement('p');
				p_addr.className = "text_modal";
				p_addr.appendChild(document.createTextNode(array.street));
				var p_init = document.createElement('p');
				p_init.className = "text_modal";
				p_init.appendChild(document.createTextNode(array.datetime_init+' até'));
				var p_end = document.createElement('p');
				p_end.className = "text_modal";
				p_end.appendChild(document.createTextNode(array.datetime_end));
				
				var p_link = document.createElement('p');
				p_link.className = "text_modal";
				p_link.appendChild(document.createTextNode('Links: \n'));
				var contain = document.createElement('div');
				
				if(array.links!==undefined){
					for(var l = 0; l<array.links.length;l++){
						var p_sites = document.createElement('a');
						p_sites.href = array.links[l];
						p_sites.innerHTML = array.links[l];
						var p_spc = document.createElement('p');
						p_spc.className = "text_modal";
						p_spc.appendChild(document.createTextNode('\n'));
						contain.appendChild(p_sites);
						contain.appendChild(p_spc);
					}
				}

				modal_txt.appendChild(p_title);	
				modal_txt.appendChild(p_place);
				modal_txt.appendChild(p_init);
				modal_txt.appendChild(p_end);
				modal_txt.appendChild(p_addr);
				modal_txt.appendChild(p_link);
				modal_txt.appendChild(contain);

			var modal_img = document.createElement('div');
			modal_img.className = "modal_img";
				var img = document.createElement('img');
				img.src = array.photo_path;
				modal_img.appendChild(img);
		modal_header.appendChild(modal_txt);
		modal_header.appendChild(modal_img);
		var modal_body = document.createElement('div');
		modal_body.className = "box_auto modal_body";
			var p_desc = document.createElement('p');
			p_desc.className = "describe_modal";
			p_desc.appendChild(document.createTextNode(array.description));
			modal_body.appendChild(p_desc);
	modal_content.appendChild(modal_header);
	modal_content.appendChild(modal_body);
	return modal_content;
}