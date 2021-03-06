
  "use strict";
  var PATH = "search";
  var d = new Date();
  var time_init = 0;
  var time_end = 0;
  var counter = 0;
  var myVar = 0;
  var max_length = 0;
  var read_size = 150;
  var client = 0;

  var source = ['name','place_name','description','date','interested','datetime_end','datetime_init','location','photo_path','street', 'links'];
  var loc = ['location'];

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB0XKx2P8DayEo5rmnMZiSxUFGutVqL2Xk",
    authDomain: "weekanguru.firebaseapp.com",
    databaseURL: "https://weekanguru.firebaseio.com",
    storageBucket: "weekanguru.appspot.com",
    messagingSenderId: "746280967817"
  }; 

  firebase.initializeApp(config); 
  var firebase_db = firebase.database();

  function initElasticSearch(){
    client = new elasticsearch.Client({
      host: 'search-cadeojack-rte32fsvszltkupp4bwhfibi7i.us-east-1.es.amazonaws.com',
      log: 'trace'
    });

    client.ping({
      requestTimeout: 30000,
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
      }
    });
  }


  var SearchBounds_= function(nw, se) {
    console.log('   Search bounds : '+nw.toString()+' '+se.toString());
    client.search({
      index: "firebase_loc",
      type: "GeoLoc",
      _source : loc,
      body:{
        query:{
          "bool" : {
              "filter" : {
                  "geo_bounding_box" : {
                      "location" : {
                          "top_left" : {
                              "lat" : nw.lat(),
                              "lon" : nw.lng()
                          },
                          "bottom_right" : {
                              "lat" : se.lat(),
                              "lon" : se.lng()
                          }
                      }
                  }
              }
          }
        }
      }
    }).then(function (resp) {
        var hits = resp.hits;
        if(hits!==null) {
          getPin(hits);
          resolve(hits.hits);
        }
        //console.log(hits);
    }, function (err) {
        console.trace(err.message);
    });
    /*
    var promise = new Promise (
      function(resolve, reject) {
        doSearch(RectangleQuery_(nw,se), 
          function getData(value) {
            var dat = value.val();
            if(dat!==null) {
              getPin(dat);
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
    */

  }

  function getPinFromDate(array) {
    if(array.total===0);
    else{
      console.log(array);
      for(var a=0;a<array.hits.length;a++){
        actual_data.push(array.hits[a]);
        pinPoint(array.hits[a]);
      } 
    }
    makeCarousel();
  }

  function getPin(array) {
    if(array.total===0);
    else{
      console.log(array);
      for(var a=0;a<array.hits.length;a++){
        actual_data.push(array.hits[a]);
        pinPoint(array.hits[a]);
      } 
    }
    thread_count++;
    if(thread_count>=threads){
      console.log("Get to the end!!!!");
      makeCarousel();
      thread_count=0;
    }
  }

  function getById_(id) {
    var query = {
      size: 500,
      index: "firebase",
      type: "Data",
      _source : source
    };    
    var body = query.body = {};
    body.query = { "match_phrase": { "_id": id } }
    return query;
  }

  function DateQuery_(start, end) {
    var query = {
      size: 500,
      index: "firebase",
      type: "Data",
      _source : source
    };  
    var body = query.body = {};
    body.query = {
        "range" : {
            "date" : {
                "gte" : start,
                "lte" : end
            }
        }
    }
    return query;
  }

  function RectangleQuery_(nw,se) {
    var query = {
      size: 500,
      index: "firebase_loc",
      type: "GeoLoc",
      _source : loc
    };  
    var body = query.body = {};
    body.query = {
      "bool" : {
          "filter" : {
              "geo_bounding_box" : {
                  "location" : {
                      "top_left" : {
                          "lat" : nw.lat(),
                          "lon" : nw.lng()
                      },
                      "bottom_right" : {
                          "lat" : se.lat(),
                          "lon" : se.lng()
                      }
                  }
              }
          }
      }
    }
    //console.log(query);
    return query;
  }

  function CheckDuplicatesQuery_(name) {
    var query = {
      size: 1,
      index: "firebase",
      type: "Data",
      _source : source
    };    
    var body = query.body = {};
    body.query = {
      "match_phrase": {
        // this is the field name, _all is a meta indicating any field
        "name": name
      }
    }
    return query;
  }

  function CheckDuplicates(event){
    doSearch(CheckDuplicatesQuery_(event.name), function AddRecords(snap) {
      var dat = snap.val();
      if( dat === null ) { return; } // wait until we get data
      //snap.ref.off('value', showResults);
      snap.ref.remove();
      if(dat.hits===undefined){
        if (event.place===undefined) return;
        else if (event.place.location===undefined) return;
        else {
          console.log('Adiciona!');
          console.log(event);
          PushEventOnFirebase(event);
        }        
      }
      else{
        console.log('Ja existe!');
      }
    });    
  }

  var Search_= function() {
    var search_value = document.getElementById("search_value").value;
    var promise = new Promise (
      function(resolve, reject) {
        doSearch(getByTerm_(search_value), 
          function getData(value) {
            var dat = value.val();
            if( dat === null ) { return; } // wait until we get data
            value.ref.off('value', getData);
            value.ref.remove();
            if(dat.hits!==null && dat.hits!==undefined){
              console.log(dat.hits);
              buildAll(dat.hits);
              resolve(dat.hits);
            }
            else{
              reject(console.log("There is no data!"));
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
  
  function buildAll(data){
    clearCarousel();
    clearPinPoints(); //Clear pinpoints
    actual_data = []; //Clear all data
    big_carousel = [];
    init_pos = 0;
    end_pos = big_carousel_size;
    actual_index=0;
    for(var i = 0;i<data.length;i++){
        if(i===0){
          var latlong =  data[i]._source.location.split(",");
          var latitude = parseFloat(latlong[0]);
          var longitude = parseFloat(latlong[1]);
          var myLatLng = {lat: latitude, lng: longitude}; 
          map.setCenter(myLatLng);
          var current_zoom = map.getZoom()-3;
          if(current_zoom<11)current_zoom=11;
          map.setZoom(current_zoom);
        }
        pinPoint(data[i]);
        actual_data.push(data[i]);
        big_carousel.push(data[i]);
        build_carousel_item_(data[i]);
    }
    actual_pin = 0;
    last_pin = 0;
    jump(actual_pin,last_pin);
    SEARCH_=1;
  }

  function getByTerm_(search_value) {
    var query = {
      index: "firebase",
      type: "Data",
      _source : source
    };
    if(date_start!==""||date_end!==""){
      console.log("Oi craudio");
      var body = query.body = {};
      body.query = {
          "range" : {
              "date" : {
                  "gte" : date_start,
                  "lte" : date_end
              }
          }
      }
    }
    query.q = search_value;  
    return query;
  }

  // do a search by writing it to the search/request path
  function doSearch(query, script) {
    var ref = firebase_db.ref().child(PATH);
    var key = ref.child('request').push(query).key;
     $('#query').text(JSON.stringify(query, null, 2));
    ref.child('response/'+key).on('value', script);
  }