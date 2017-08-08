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


  function ScanFacebookResults(array){    
    for (var i = 0; i < array.length ; i++) {
      CheckDuplicates(array[i]);
    }
  }

  function getEventsFacebook() {
     FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        var accessToken = response.authResponse.accessToken;
        FB.api('/me',
          'GET',
          {access_token:accessToken , "fields":"events.limit(500).since(yesterday){name,start_time,end_time,place,interested_count,picture.type(large),description}"},
          function(response) {
            if(response.events.data.length > 0){
              ScanFacebookResults(response.events.data); 
            }
            else console.log("No event returned!");
          }
        );
      } 
    });   

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
  

