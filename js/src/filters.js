
function today(){

	console.log('today!');

}

function tomorrow(){



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