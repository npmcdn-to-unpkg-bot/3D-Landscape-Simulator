var map = L.map('map').setView([39,-113], 5);

var OpenStreetMap=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' }).addTo(map);

var counties = L.geoJson(sagebrush_counties, {
    clickable:true
}).addTo(map);

counties.on('click', function (e) {
    var bottom = e.layer._bounds._southWest.lat
    var top = e.layer._bounds._northEast.lat
    var left = e.layer._bounds._southWest.lng
    var right = e.layer._bounds._northEast.lng
    feature_id = e.layer.feature.properties.NAME

    extent=[bottom,top,left,right]

    var user_wkt = "POINT(" + e.latlng.lng + " " + e.latlng.lat + ")";

    load_initial_conditions(feature_id)

    $("#run_button").on("click", function(){
            run_st_sim(feature_id)
        }
    )
});
