var map = L.map('map').setView([39,-113], 5);

//var OpenStreetMap=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' }).addTo(map);

var counties = L.geoJson(sagebrush_counties, {
    clickable:true
}).addTo(map);

counties.on('click', function (e) {

    var bottom = e.layer._bounds._southWest.lat
    var top = e.layer._bounds._northEast.lat
    var left = e.layer._bounds._southWest.lng
    var right = e.layer._bounds._northEast.lng
    var feature_id = e.layer.feature.properties.NAME

    //alert("Top, Bottom, Left, Right: (" + top + "," + bottom  + "," + left + "," + right +")")

    var user_wkt = "POINT(" + e.latlng.lng + " " + e.latlng.lat + ")";
    //alert("Click event at: " + user_wkt )

    $("#load_button").trigger('click')

    load_initial_conditions(feature_id)

});

function load_initial_conditions(feature_id){
    $.ajax({
    url:'',
    type: "POST", // http method
    data: {feature_id: feature_id},
    success: function (data){
        alert(data)
      //parse your data here
      //you can split into lines using data.split('\n')
      //an use regex functions to effectively parse it
    }
  });
}
