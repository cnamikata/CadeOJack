  var fields_number = 8;

  function getDataHora(array, inicio){
    var ano = array.start_time.substring(0,4);  //ano
    var mes = array.start_time.substring(5,7); //mes
    var dia = array.start_time.substring(8,10); //dia
    var hora, minuto;
    if(inicio==1){
      hora = array.start_time.substring(11,13); //hora de inicio 
      minuto = array.start_time.substring(14,16);
    }
    else{
      hora = array.end_time.substring(11,13); //hora de inicio 
      minuto = array.end_time.substring(14,16);
    }
    var d = new Date(ano, mes-1, dia, hora, minuto);  
    return d.toUTCString();
  }

  function dataMiner(array){    
    // Data matrix initialize
    var data = new Array();
    var full_counter = 0;
    for (var i = 0; i < array.length ; i++) {
      if(array[i].place != undefined){
        if(array[i].place.location != undefined){  
          data[full_counter] = new Array(fields_number);
          // url da foto do evento
          data[full_counter][0] = array[i].picture.data.url;
          // nome do evento
          data[full_counter][1] = array[i].name;
          // endereço do evento = cidade + endereço
          data[full_counter][2] = array[i].place.location.city + ' - ' + array[i].place.location.street;    
          // início do evento
          data[full_counter][3] = getDataHora(array[i],1);          
           // fim do evento
          if(array[i].end_time != undefined){
            // fim do evento
            data[full_counter][4] = getDataHora(array[i],0);            
          }
          else data[full_counter][4] = '';
          //console.log(data[full_counter][4]);       
          //console.log(' lat:' + data[i][5] + ' lng:' + data[i][6]);
          data[full_counter][5] = new Array(6);
          data[full_counter][5][0] = array[i].place.location.latitude;
          data[full_counter][5][1] = array[i].place.location.longitude;
          data[full_counter][5][2] = array[i].place.location.country;
          data[full_counter][5][3] = array[i].place.location.state; 
          data[full_counter][5][4] = array[i].place.location.city;
          data[full_counter][5][5] = array[i].place.location.street;  
          data[full_counter][6] = array[i].description; 
          full_counter++;         
        }
        else {          
          //console.log(removed_nodes + ' null location');
        }
      }
      else{
        //console.log(removed_nodes + ' null place');  
      }
    }
    saveOnFirebase(data);
  }

  function getEventsFacebook() {
     FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        var accessToken = response.authResponse.accessToken;
        FB.api('/me',
          'GET',
          {access_token:accessToken , "fields":"events.limit(500).since(yesterday){name,start_time,end_time,place,interested_count,picture,description}"},
          function(response) {
            if(response.events.data.length > 0){
              console.log(response.events);
              dataMiner(response.events.data); 
            }
            else console.log("No event returned!");
          }
        );
      } 
    });    
  }

  function getWeek(intd){
    switch(intd){
      case 0: return 'Domingo';
      case 1: return 'Segunda-Feira'; 
      case 2: return 'Terça-Feira'; 
      case 3: return 'Quarta-Feira'; 
      case 4: return 'Quinta-Feira'; 
      case 5: return 'Sexta-Feira'; 
      case 6: return 'Sábado';  
    }
  }

  function getMonth(intm){
    switch(intm){
      case '01': return 'Janeiro'; 
      case '02': return 'Fevereiro'; 
      case '03': return 'Março'; 
      case '04': return 'Abril'; 
      case '05': return 'Maio'; 
      case '06': return 'Junho'; 
      case '07': return 'Julho';
      case '08': return 'Agosto'; 
      case '09': return 'Setembro'; 
      case '10': return 'Outubro'; 
      case '11': return 'Novembro'; 
      case '12': return 'Dezembro'; 
    }
  }

  function openAllClusters() {
      var markers = oms.markersNearAnyOtherMarker();
      $.each(markers, function (i, marker) {
          google.maps.event.trigger(markers[i], 'click');
      });
  }

  function getToday(startDay){
    var today_var = startDay;
    var year_var = today_var.getFullYear();
    var month_var = today_var.getMonth()+1;
    var day_var = today_var.getDate();
    var week_day_var = today_var.getDay();
    var today = [
      year = year_var,
      month = month_var,
      day = day_var,
      week_day = week_day_var
    ];
    return today;
  }  

  function login() {
    FB.login(function(response) {
    }, {scope: 'user_events'});
  }

  function logout() {
    FB.logout(function(response) {
    });
  }

  function statusChangeCallback(response) {
    console.log(response);
    if (response.status === 'connected') {      
      testAPI();
    } else if (response.status === 'not_authorized') {
      console.log(response.status);
    } else {
      console.log(response.status);
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '323544771362281',
      cookie     : true,  // enable cookies to allow the server to access 
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
    });
  }

  function testAPI2() {
    FB.login(function(){
        // Note: The call will only work if you accept the permission request
        FB.api('/me/feed', 'post', {message: 'Facebook API Test!'});
    }, {scope: 'publish_actions'});
  }
  

