// Load the data with Tabletop, the app is in the showInfo callback
var sheetsURL = '1R3016vFNMmeaI0volqhNX6l02CehTtGYOPjmDQagmjE';
Tabletop.init( { 
	key: sheetsURL, 
	callback: showInfo,
	debug: true, 
	parseNumbers: true, 
	simpleSheet: true
} );

function showInfo(data, tabletop){
//let's put all the data in one variable
	sheetData = data;
	console.log( "Here is your data", sheetData);

	mapFunctions();
	$('#openModal').remove();
}


function mapFunctions() {

var pointFun;
var sheetGeoJson = [];
// for all in sheet array, do some stuff
for ( var i = 0; i < sheetData.length; i++) {
	// create a new object 
	var pointFun = 
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [sheetData[i].LONG, sheetData[i].LAT]
			},
			"properties": {
				"name": sheetData[i].Facility_Name,
				"description": sheetData[i].Permit_Expiration_Date,
				"imageUrl": sheetData[i].image,
				"link": sheetData[i].link,
				"pollutantLoad": sheetData[i].Pollutant_Load.toFixed(2),
				"maxLoad": sheetData[i].MaxAllowableLoadkgyr.toFixed(2),
				"marker-color": getColor(sheetData[i].Pollutant_Load)
				/*,
				"marker-color": sheetData[i].markercolor,
				"marker-symbol": sheetData[i].markersymbol*/
		}
	};

	// push to sheetGeoJson array
	sheetGeoJson.push(pointFun);
	}

// Add empty feature layer to prepare for custom markers

L.mapbox.accessToken = "pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoieUZiWmwtVSJ9.0cPQywdbPVmvHiHJ6NwdXA";
var map = L.mapbox.map('map', 'mapbox.outdoors')
                  .setView([48, -114.014270], 8)
                  /*.featureLayer.setGeoJSON(sheetGeoJson)*/;
var pointLayer = L.mapbox.featureLayer().addTo(map);

var trailLayer = L.mapbox.featureLayer()
						 .loadURL('https://gist.githubusercontent.com/danswick/2bb577d1f1784d685bd1/raw/mke_wshd.geojson')
						 .addTo(map);

// Add custom popups to each point
pointLayer.on('layeradd', function(e) {
	var marker = e.layer,
		feature = marker.feature;

	// Create custom popup content
	var popupContent = '<h3>' + feature.properties.name + '</h3>' + 
						'<p>Permit Expiration Date ' + feature.properties.description + '</p>' +
						'<br>' +
						/*'<img class="popup-image" src="' + feature.properties.imageUrl + '" />';*/
						'<p><strong>Pollutant load</strong>:<br> ' + feature.properties.pollutantLoad + '</p>' + 
						'<p><strong>Max Allowable Load</strong>:<br> ' + feature.properties.maxLoad + '</p>';


	// bind popup to markers
	marker.bindPopup(popupContent, {
		closeButton: false,
		minWidth: 450
	});
});

// Add custom popups to each trail
/*trailLayer.on('layeradd', function(e) {
	var trail = e.layer,
		feature = trail.feature;

	// Create custom popup content
	var popupContent = '<h3>' + feature.properties.NAME + '</h3>' + 
						'<p>' + feature.properties.DESC_SEG + '</p>' +
						'<p>' + "Average slope: " + feature.properties.Avg_Slope + '</p>';


	// bind popup to lines
	trail.bindPopup(popupContent, {
		closeButton: false,
		minWidth: 450
	});

	// set style
	if (feature.properties.evaluating === 'yes') {
		trail.setStyle({
			color: '#B63833',
			weight: 3,
	 		opacity: 0.9,
	 		dashArray: '3'
		});
	} else {
		trail.setStyle({
		 	color: '#921E11',
		 	weight: 1,
		 	opacity: 0.6,
		 	dashArray: '5'
		});
	}
});*/

// Add features to the map
pointLayer.setGeoJSON(sheetGeoJson);

map.fitBounds(pointLayer.getBounds());
}

function getColor(d) {
      return d > 1000 ? '#8c2d04' :
          d > 500  ? '#cc4c02' :
          d > 200  ? '#ec7014' :
          d > 100  ? '#fe9929' :
          d > 50   ? '#fec44f' :
          d > 20   ? '#fee391' :
          d > 10   ? '#fff7bc' :
          '#ffffe5';
  } // choropleth ramp from here - https://www.mapbox.com/mapbox.js/example/v1.0.0/choropleth/
