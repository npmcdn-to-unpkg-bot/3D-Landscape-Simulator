var map = L.map('map', {
        zoomControl: false
    }
).setView([39,-113], 5);

L.control.zoom({
     position:'topright'
}).addTo(map);

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

    extent=[top,bottom,right,left]
    landscape_viewer.updateTerrain(extent, true)  // also updates the vegetation to the user-specified conditions

    var user_wkt = "POINT(" + e.latlng.lng + " " + e.latlng.lat + ")";

    show_input_options(feature_id)

});
