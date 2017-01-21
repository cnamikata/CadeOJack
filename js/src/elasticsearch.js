  "use strict";

  var PATH = "search";
  var database = firebase.database();

  function searchMe() {
    var search_value = document.getElementById("search_value").value;
    doSearch(buildQuery(search_value), showResults);
  }

  function buildQuery(search_value) {
    var query = {
      index: "firebase",
      type: "PR",
      _source : ['name','description','datetime_end','datetime_init','lat','lng','photo_path','street']
    };
    query.q = search_value;  
    return query;
  }

  function buildQueryName(name) {
    var query = {
      index: "firebase",
      type: "PR",
      _source : ['name']
    };    
    var body = query.body = {};
    body.query = {
      "match_phrase": {
        "name": name
      }
    }
    return query;
  }

  // conduct a search by writing it to the search/request path
  function doSearch(query, script) {
    var ref = database.ref().child(PATH);
    var key = ref.child('request').push(query).key;
    $('#query').text(JSON.stringify(query, null, 2));
    ref.child('response/'+key).on('value', script);
  }

  // when results are written to the database, read them and display
  // when results are written to the database, read them and display
  function showOnly(bla, snap) {
    var dat = snap.val();
    if( dat === null ) { return 0; } // wait until we get data
    snap.ref.off('value', showResults);
    snap.ref.remove();
    if(dat.hits!==undefined){
      return 1;
    }
    else{      
      return 0;
    }
    bla = 1;
  }

  // when results are written to the database, read them and display
  function showResults(snap) {
    var dat = snap.val();
    if( dat === null ) { return; } // wait until we get data
    snap.ref.off('value', showResults);
    snap.ref.remove();
    console.log(JSON.stringify(dat, null, 2));
    if(dat.hits!==undefined){
      console.log(dat.hits.length);
      filterData(dat.hits);
    }
    else{
      //There is no relevant data found, show al results
      filterNothing();
    }
  }

  database.ref().on('value', setRawData);

  function setRawData(snap) {    
    //console.log(JSON.stringify(snap.val(), null, 2));
  }
