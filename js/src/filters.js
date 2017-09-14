var TODAY = 0;
var TOMORROW = 0;
var CALENDAR = 0;
var $input = 0;
var picker = 0;
var date_start = 0;
var date_end = 0;

jQuery.extend( jQuery.fn.pickadate.defaults, {
    monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
    weekdaysFull: [ 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ],
    weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Fechar',
    format: 'dddd, d !de mmmm !de yyyy',
    formatSubmit: 'yyyy/mm/dd',
    min: new Date()
});

function initDatePicker(){
	$input = $('.datepicker').pickadate();
	// Use the picker object directly.
	picker = $input.pickadate('picker');
	picker.on('open', function() {
		TODAY=0;
   		TOMORROW=0;
   		document.getElementById('btntd').className = 'btn_today';
		document.getElementById('btntm').className = 'btn_tomorrow';
	});
	picker.on('close', function() {
		var date = picker.get('select', 'yyyy/mm/dd');
		if(date===''){
			console.log('No Selected');	
			CALENDAR = 0;
			document.getElementById('btncl').className = 'btn_calendar';
		}
   		//console.log(picker.get('select', 'yyyy/mm/dd'));
	});
	picker.on('set', function() {
		var hoy = getDate(0);
		var manhana = getDate(1);
		var dataset = picker.get('select', 'yyyy-mm-dd');
		if(dataset===hoy){
			document.getElementById('btntd').className = 'btn_today btn_today_active';
			document.getElementById('btntm').className = 'btn_tomorrow';
			today();
		}
		else if(dataset===manhana){
			document.getElementById('btntm').className = 'btn_today btn_tomorrow_active';
			document.getElementById('btntd').className = 'btn_today';
			tomorrow();
		}
		else{
			TODAY=0;
	   		TOMORROW=0;
	   		CALENDAR=1;
	   		document.getElementById('btntd').className = 'btn_today';
			document.getElementById('btntm').className = 'btn_tomorrow';
			filterByDate(dataset,dataset);
		}
	});
}

function loadCalendar(){
	picker.open();
	// If a “click” is involved, prevent the event bubbling.
	event.stopPropagation();
	// If we want to maintain focus on the input,
	// prevent the default action on “mousedown”.
	event.preventDefault();
}

function getDate(today_tomorrow) {
	var today = 0;
	if(today_tomorrow===0){
		today = new Date();
	}
	else if(today_tomorrow===1){
		today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	}
	var todayM = ("0" + (today.getMonth()+1)).slice(-2);
	var todayD = ("0" + today.getDate()).slice(-2);
	var date = today.getFullYear()+'-'+todayM+'-'+todayD;
	return date;
}

function filterAuxiliar(){
	var date1 = 0;
	var date2 = 0;
	if(TODAY===1&&TOMORROW===0){
		date1 = getDate(0);
		date2 = getDate(0);
		filterByDate(date1,date2);
	}
	else if(TODAY===0&&TOMORROW===1){
		date1 = getDate(1);
		date2 = getDate(1);
		filterByDate(date1,date2);
	}
	else if(TODAY===1&&TOMORROW===1){
		date1 = getDate(0);
		date2 = getDate(1);
		filterByDate(date1,date2);		
	}
	else if(TODAY===0&&TOMORROW===0){
     	thread_count=0;
        clearPinPoints(); //Clear pinpoints
        actual_data = []; //Clear all data
        end_pos = big_carousel_size;
        actual_index=0;
        SearchBounds_thread(bound_nw, bound_se);	
	}
}

function today(){
	CALENDAR = 0;
	document.getElementById('btncl').className = 'btn_calendar';
	if(TODAY===0)TODAY=1;
	else TODAY = 0;
	filterAuxiliar();
}

function tomorrow(){
	CALENDAR = 0;
	document.getElementById('btncl').className = 'btn_calendar';
	if(TOMORROW===0)TOMORROW=1;
	else TOMORROW = 0;
	filterAuxiliar();
}

function filterByDate(d_start, d_end){
	date_start = d_start;
	date_end = d_end;
	var promise = new Promise (
      function(resolve, reject) {
        doSearch(DateQuery_(date_start,date_end), 
          function getData(value) {
            var dat = value.val();
            if(dat!==null) {
              clearPinPoints(); //Clear pinpoints
			  actual_data = []; //Clear all data
			  end_pos = big_carousel_size;
			  actual_index =0;
              getPinFromDate(dat);
              resolve(dat.hits);
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
