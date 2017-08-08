var funqueue = [];
var myVar = setInterval(myTimer, 100);
var s_value;
var SEARCH_ = 0;

var wrapFunction = function(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
}
function myTimer(){
  if(funqueue.length>0)(funqueue.shift())();
  s_value = document.getElementById("search_value").value;
  if(s_value===''){
  	SEARCH_=0;
  }
}
