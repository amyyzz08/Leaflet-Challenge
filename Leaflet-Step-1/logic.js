// Basic Visualisation
var myMap = L.map("map", {
    center: [37.732432, -122.488414],
    zoom: 7
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function quakeColor(magnitude){
     if (magnitude >= 5) {
        return "Red"
    } else if (magnitude >=4 && magnitude < 4.99) {
        return "DarkOrange"
    } else if (magnitude >=3 && magnitude < 3.99) {
        return "Orange"
    } else if (magnitude >= 2 && magnitude < 2.99) {
        return "Yellow"
    } else if (magnitude >= 1 && magnitude < 1.99) {
        return "GreenYellow"
    } else if (magnitude < 1) {
        return "Lime"
    }
};

// Retrieve the geojson data
d3.json(url).then(earthquake => {
        
    // Your data markers should reflect the magnitude of the earthquake in their size and colour. 
    // Earthquakes with higher magnitudes should appear larger and darker in colour.
    earthquake.features.forEach(feature => {

        L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            radius: feature.properties.mag * 10000,
            color: "black",
            weight: 1,
            fillColor: quakeColor(feature.properties.mag),
            fillOpacity: 0.75
        })
        .bindPopup("<h3>" + feature.properties.place + "</h3> <hr> Coordinates : " 
                        + [feature.geometry.coordinates[1],feature.geometry.coordinates[0]] + "<br> Magnitude : " 
                        + feature.properties.mag + "</br> Time : "
                        + feature.properties.time)
        .addTo(myMap)
    });
});
        
// Create a legend that will provide context for your map data.

var legend = L.control({ position: "bottomright"});

legend.onAdd = function() {
    var div = L.DomUtil.create('div','info legend');
    
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = ["Lime","GreenYellow","Yellow","Orange","DarkOrange","Red"];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=  
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>": "+");
    }
        return div;
};

legend.addTo(myMap);