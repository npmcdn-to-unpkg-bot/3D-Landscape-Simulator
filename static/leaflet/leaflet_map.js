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
    feature_id = e.layer.feature.properties.NAME

    var user_wkt = "POINT(" + e.latlng.lng + " " + e.latlng.lat + ")";

    $("#load_button").trigger('click')

    create_post(feature_id)

});

// Could be used to get initial conditions out of file
/*
function load_initial_conditions(feature_id){
     $.ajax({
        type: "GET",
        url: "static/st_sim/initial_conditions/" + feature_id + ".csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    initial_conditions_data = [];

    alert(allTextLines)
    $.each(initial_conditions_data, function(n,elem){
            $.each(elem, function(n,value) {
                    $("#initial_conditions").append(value + ",")
                }
            );
            $("#initial_conditions").append("<br>")
        }
    )
}
*/
