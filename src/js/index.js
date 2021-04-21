// import leaflet
import leaflet from 'leaflet';
import hash from 'leaflet-hash';
import 'leaflet/dist/leaflet.css';

// d3 libraries
import * as d3_Selection from 'd3-selection';
import * as d3_Transition from "d3-transition";
import {scaleTime, scaleLinear} from 'd3-scale';
import {geoPath, geoTransform} from 'd3-geo';
import {timeMinute} from 'd3-time';
import {timeFormatLocale, timeParse, timeFormat} from 'd3-time-format';
import {median} from 'd3-array';
import {interpolateRgb} from 'd3-interpolate';
import {csvParse} from 'd3-dsv';
import {line} from 'd3-shape';
import {csv} from 'd3-fetch';
import {extent,max,min} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';

import 'whatwg-fetch';

const d3 = Object.assign({}, d3_Selection);

import api from './feinstaub-api';
import labs from './labs.js';
import wind from './wind.js';
import * as config from './config.js';
import EUdata from './eudata.js';
//import UBAdata from './ubadata.js';
import AURAdata from './auradata.js';
import Luchtmeetnetdata from './Luchtmeetnetdata.js';

import '../css/style.css';
import * as places from './places.js';
import * as zooms from './zooms.js';
import * as translate from './translate.js';

// favicon config
import './static-files'


//Atmo Sud et Atmo Occitanie

//
//https://api.luchtmeetnet.nl/open_api/stations/NL10301
//https://api-docs.luchtmeetnet.nl/#701eea5c-3f0f-48cb-b7fa-9f53a4a8d10f
//

//Liste a cocher sources
//timestamp en metadata

//Liste de radios : current / 1h /24 h selon les sources

// declare data containers

//https://www.umweltbundesamt.de/daten/luft/luftdaten/doc#tag/measurements

//https://www.umweltbundesamt.de/api/air_data/v2/measures/json?date_from=2021-04-21&time_from=1&date_to=2021-04-21&time_to=15

let SC_PM = {"type": "FeatureCollection","name": "SCSensors","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []};

let  EUofficialData = {PM10:{"type": "FeatureCollection","name": "eustations_EEA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "eustations_EEA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let UBAofficialData = {PM10:{"type": "FeatureCollection","name": "stations_UBA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_UBA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoAURAData ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoAURADataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let LuchtmeetnetData = {PM10:{"type": "FeatureCollection","name": "Luchtmeetnet_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "Luchtmeetnet_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

// save browser lanuage for translation
const lang = translate.getFirstBrowserLanguage().substring(0, 2);

let openedGraph1 = [];
let timestamp_data = '';			// needs to be global to work over all 4 data streams
let timestamp_from = '';			// needs to be global to work over all 4 data streams
let clicked = null;

const locale = timeFormatLocale({
	"dateTime": "%Y.%m.%d %H:%M:%S",
	"date": "%d.%m.%Y",
	"time": "%H:%M:%S",
	"periods": ["AM", "PM"],
	"days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	"shortDays": ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
	"months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	"shortMonths": ["Jan.", "Feb.", "Mar.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."]
});

const scale_options = {
	"PM10": {
		valueDomain: [-1,0, 20, 40, 60, 100, 500],
		colorRange: ['#808080','#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
	},
	"PM25": {
		valueDomain: [-1,0, 10, 20, 40, 60, 100],
		colorRange: ['#808080','#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
	}
};

const titles = {
	"PM10": "PM10 &micro;g/m&sup3;",
	"PM25": "PM2.5 &micro;g/m&sup3;",
	"Official_AQI_US": "AQI US",
	"Temperature": "Temperature °C",
	"Humidity": "Humidity %",
	"Pressure": "Pressure hPa",
	"Noise": "Noise dBA",
};

const panelIDs = {
	"PM10": [2, 1],
	"PM25": [2, 1],
	"Temperature": [4, 3],
	"Humidity": [6, 5],
	"Pressure": [8, 7],
	"Noise": [0, 12]
};

const div = d3.select("#sidebar").append("div").attr("id", "table").style("display", "none");

const map = L.map('map', {zoomControl: true, minZoom: config.minZoom, maxZoom: config.maxZoom, doubleClickZoom: false});

var data_host = "";
data_host = "https://maps.sensor.community";
config.tiles = config.tiles_server + config.tiles_path;
console.log(config.tiles);


const tiles = L.tileLayer(config.tiles, {
	attribution: config.attribution,
	maxZoom: config.maxZoom,
	minZoom: config.minZoom,
	subdomains: config.tiles_subdomains
}).addTo(map);

new L.Hash(map);

// define query object
const query = {
	nooverlay: "false",
	nowind: "false",
	nolabs: "false",
	noeustations: "false",
	selection: config.selection
};
// iife function to read query parameter and fill query object
(function () {
	let telem;
	const search_values = location.search.replace('\?', '').split('&');
	for (let i = 0; i < search_values.length; i++) {
		telem = search_values[i].split('=');
		query[telem[0]] = '';
		if (typeof telem[1] != 'undefined') query[telem[0]] = telem[1];
	}
})();

// layers
if (query.nowind === "false") { config.layer_wind = 1 } else {config.layer_wind = 0;}
if (query.nolabs === "false") { config.layer_labs = 1 } else {config.layer_labs = 0;}
if (query.noeustations === "false") { config.layer_eustations = 1 } else {config.layer_eustations = 0;}

// show betterplace overlay
if (query.nooverlay === "false") d3.select("#betterplace").style("display", "inline-block");
d3.select("#loading").html(translate.tr(lang,d3.select("#loading").html()));
config.selection = (query.sensor !== undefined) ? query.sensor : config.selection;
d3.select("#custom-select").select("select").property("value", config.selection);

let user_selected_value = config.selection;
let coordsCenter = config.center;
let zoomLevel = config.zoom;

if (location.hash) {
	const hash_params = location.hash.split("/");
	coordsCenter = [hash_params[1], hash_params[2]];
	zoomLevel = hash_params[0].substring(1);
} else {
	const hostname_parts = location.hostname.split(".");
	if (hostname_parts.length === 4) {
		const place = hostname_parts[0].toLowerCase();
		if (typeof places[place] !== 'undefined' && places[place] !== null) {
			coordsCenter = places[place];
			zoomLevel = 11;
		}
		if (typeof zooms[place] !== 'undefined' && zooms[place] !== null) zoomLevel = zooms[place];
	}
}

       
const colorScalePM10 = scaleLinear()
    .domain(scale_options.PM10.valueDomain)
    .range(scale_options.PM10.colorRange)
    .interpolate(interpolateRgb);
       
       
 const colorScalePM25 = scaleLinear()
    .domain(scale_options.PM25.valueDomain)
    .range(scale_options.PM25.colorRange)
    .interpolate(interpolateRgb);


var EUStationsMap = L.geoJSON(EUofficialData.PM25,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.Value),
                        stroke:true,
                        weight:2,
                        stroke:true,
                        color :'red',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                          
                          if (feature.properties.Value == -1){feature.properties.Value = "N/A"};
                          
                        var popupContent = "<h2>EU STATIONS MAP</h2><p><b>Name</b> : "+feature.properties.Name+"</p><p><b>Value</b> : "+feature.properties.Value+" µg\/m&sup3; ("+ feature.properties.AreaClassification +")</p><button type='button' id='button" + feature.properties.samplePointID + "' value='" + feature.properties.samplePointID + "'>Show graph!</button><div id='graph"+ feature.properties.samplePointID +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }
                        }).addTo(map);



//var UBAStationsMap = L.geoJSON(EUofficialData.PM25,{
//                      pointToLayer: function (feature, latlng) {
//                       return L.circleMarker(latlng, {
//                        radius:5,
//                        fillColor: colorScaler(user_selected_value,feature.properties.Value),
//                        stroke:true,
//                        weight:2,
//                        stroke:true,
//                        color :'red',
//                        fillOpacity: 1})
//                      },
//                      onEachFeature: function (feature, layer) {
//                          
//                          if (feature.properties.Value == -1){feature.properties.Value = "N/A"};
//                          
//                        var popupContent = "<h2>UBA STATIONS MAP</h2><p><b>Name</b> : "+feature.properties.Name+"</p><p><b>Value</b> : "+feature.properties.Value+" µg\/m&sup3; ("+ feature.properties.type +")</p><button type='button' id='button" + feature.properties.samplePointID + "' value='" + feature.properties.samplePointID + "'>Show graph!</button><div id='graph"+ feature.properties.samplePointID +"'></div>";
//                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
//                      }
//
//
//                        }).addTo(map);


var AtmoAURAStationsMap = L.geoJSON(AtmoAURADataCurrent.PM25,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.valeur),
                        stroke:true,
                        weight:2,
                        stroke:true,
                        color :'blue',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                          
                          if (feature.properties.Value == -1){feature.properties.Value = "N/A"};
                          
                        var popupContent = "<h2>Atmo AURA MAP</h2><p><b>Name</b> : "+feature.properties.label+"</p><p><b>Value</b> : "+feature.properties.valeur+" µg\/m&sup3; ("+ feature.properties.typologie +")</p><button type='button' id='button" + feature.properties.site_id + "' value='" + feature.properties.site_id + "'>Show graph!</button><div id='graph"+ feature.properties.site_id +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }


                        }).addTo(map);

var SCSensorsMap = L.geoJSON(SC_PM,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.data),
                        stroke:true,
                        weight:2,
                        stroke:false,
                        color :'blue',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        var popupContent = "<h2>SENSORS MAP</h2><p><b>Sensor ID</b> : "+feature.properties.id+"</p><p><b>PM10</b> : "+feature.properties.data.PM10+" µg\/m&sup3;</p><p><b>PM25</b> : "+feature.properties.data.PM25+" µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }}).addTo(map);

window.onload = function () {

	// enable elements
	// d3.select('#legend_PM10').style("display", "block");
	d3.select('#explanation').html(translate.tr(lang, 'Show explanation'));
	d3.select('#map-info').html(translate.tr(lang, "<p>The hexagons represent the median of the current values of the sensors which are contained in the area, according to the option selected (PM10, PM2.5, temperature, relative humidity, pressure, AQI). You can refer to the scale on the left side of the map.</p> \
<p>By clicking on a hexagon, you can display a list of all the corresponding sensors as a table. The first column lists the sensor-IDs. In the first line, you can see the amount of sensor in the area and the median value.</p> \
<p>By clicking on the plus symbol next to a sensor ID, you can display two graphics: the individual measurements for the last 24 hours and the 24 hours floating mean for the last seven days. For technical reasons, the first of the 8 days displayed on the graphic has to stay empty.\
The values are refreshed every 5 minutes in order to fit with the measurement frequency of the Airrohr sensors.</p> \
<p>The Air Quality Index (AQI) is calculated according to the recommandations of the United States Environmental Protection Agency. Further information is available on the official page.(<a href='https://www.airnow.gov/aqi/aqi-basics/'>Link</a>). Hover over the AQI scale to display the levels of health concern.</p>"));
	d3.select('#betterplace').html("<a title='" + translate.tr(lang, "Donate for Sensor.Community (Hardware, Software) now on Betterplace.org") + " href='https://www.betterplace.org/de/projects/38071-fur-den-feinstaub-sensor-sds011-als-bastel-kit-spenden/' target='_blank' rel='noreferrer'>" + translate.tr(lang, "Donate for<br/>Sensor.Community<br/>now on<br/><span>Betterplace.org</span>") + "</a>");

	d3.select("#menu").on("click", toggleSidebar);
	d3.select("#explanation").on("click", toggleExplanation);

	//	Select
	const custom_select = d3.select("#custom-select");
	custom_select.select("select").property("value", config.selection);
	custom_select.select("select").selectAll("option").each(function () {
		d3.select(this).html(translate.tr(lang, d3.select(this).html()));
	});
	custom_select.append("div").attr("class", "select-selected").html("<span>"+translate.tr(lang,
		custom_select.select("select").select("option:checked").html())+"</span>").on("click", showAllSelect);
	custom_select.style("display", "inline-block");

	switchLegend(user_selected_value);

	map.setView(coordsCenter, zoomLevel);
	map.clicked = 0;
    
	//retrieve data from api
	retrieveData();
    //retrieveDataEU();
   // retrieveDataAtmoAURA();
    retrieveDataLuchtmeetnet();
    
    
    
    //    retrieveDataUBA();


	// refresh data
	setInterval(function () {
        SCSensorsMap.clearLayers();
		retrieveData();
        EUStationsMap.clearLayers();
       // retrieveDataEU();
        AtmoAURAStationsMap.clearLayers();
       // retrieveDataAtmoAURA();
        AtmoAURAStationsMap.clearLayers();
        retrieveDataLuchtmeetnet();
	}, 300000);

	map.on('moveend', function () {
	});

	map.on('click', function (e) {
		/* if the user clicks anywhere outside the opened select drop down, then close all select boxes */
		if (! d3.select("#custom-select").select(".select-items").empty()) {
			d3.select("#custom-select").select(".select-items").remove();
			d3.select("#custom-select").select(".select-selected").attr("class", "select-selected");
		} else {
			setTimeout(function () {
				map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
			}, 300);
		}
		clicked = null;
	});
    
	map.on('dblclick', function () {
		map.zoomIn();
		clicked += 1;
	});
    
	// Load lab and windlayer, init checkboxes
	if (config.layer_labs) {
		d3.select("#cb_labs").property("checked", true);
	} else {
		d3.select("#cb_labs").property("checked", false);
	}
	
	if (config.layer_wind) {
		d3.select("#cb_wind").property("checked", true);
	} else {
		d3.select("#cb_wind").property("checked", false);
	}

	labs.getData(data_host + "/local-labs/labs.json", map);
	wind.getData(data_host + "/data/v1/wind.json", map, switchWindLayer);
	
	d3.select("#label_local_labs").html(translate.tr(lang, "Local labs"));
	d3.select("#label_wind_layer").html(translate.tr(lang, "Wind layer"));

	switchLabLayer();
	switchWindLayer();
	d3.select("#cb_labs").on("change", switchLabLayer);
	d3.select("#cb_wind").on("change", switchWindLayer);

    map.on('popupopen', function(e){
        console.log("open popup");
        //console.log(e.popup.getElement());
        
        var popuptype = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[0].outerText;
        
        console.log(popuptype);
        
        if (popuptype == "SENSORS MAP"){        
            
            var sensorid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[4].value;
        
        console.log(d3.select('#button'+ sensorid ));
        
        var graph = false;
            
        d3.select('#button'+ sensorid ).on('click', function(){  
        var panel_str = "<iframe src='https://maps.sensor.community/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=2&var-node=" + sensorid + "' width='280' height='200' frameborder='0'></iframe>";
        var selector = "#graph"+sensorid;
            
        if (graph == false){
            d3.select(selector).html(panel_str);
            graph = true;
            d3.select('#button'+ sensorid ).html("Hide Graph!");
            
                           
        }else{
            d3.select(selector).html("");
            graph = false;
            d3.select('#button'+ sensorid ).html("Show Graph!");
        }
    
        });
    };
            
        if(popuptype == "EU STATIONS MAP") {
            
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;
            
            console.log(d3.select('#button'+ stationid ));
            
            var graph = false;
            
            console.log("https://discomap.eea.europa.eu/Map/UTDViewer/dataService/SamplingPoint?spo="+stationid);
            
            d3.select('#button'+ stationid ).on('click', function(){  
            console.log("CLICK");
                
            var selector = '#graph'+stationid;
            
            var urlEU = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/SamplingPoint?spo="+ stationid.replaceAll("xxx",".");
                
            console.log(urlEU);
            
            var parseDate = timeParse("%Y%m%d%H%M%S");
                
            if (graph == false){
                
           fetch(urlEU)
			.then((resp) => resp.text())
			.then((data) => {
           
				console.log('successful retrieved data');
                console.log(data);
            
               
        var dataGraphEU = csvParse(data).map(function(obj){
        var dataGraphObj = { "date": null , "value": 0};
        
        dataGraphObj.date = parseDate(obj.DATETIME_END);
        dataGraphObj.value = parseFloat(obj.VALUE_NUMERIC);
        return dataGraphObj;
        });
        
        
        console.log(dataGraphEU);
      
               
    dataGraphEU.sort(function(a,b){return (a.date)-(b.date)});             

    
    var valueline = line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })
    .defined(((d) => d.value != -1));
               
    
    console.log(valueline);
       
    var margin = {top: 20, right: 10, bottom: 30, left: 30},
    width = 270 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    var x = scaleTime().range([0, width]);
    var y = scaleLinear().range([height, 0]);      
               
    
               
    var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");       
               
  x.domain(extent(dataGraphEU, function(d) { return d.date; }));
  y.domain([0, max(dataGraphEU, function(d) {return d.value;})]);
               
               
    console.log(x.domain(extent(dataGraphEU, function(d) { return d.date; })));           
    console.log(y.domain([0, max(dataGraphEU, function(d) {return d.value; })]));   
               
               
     if (user_selected_value == "PM10"){
         
         if (max(dataGraphEU, (i) => i.value) >= 50){
                
                svg.append("line")
                .style("stroke", "red")
                .attr("x1", 0)  
                .attr("y1", y(50))  
                .attr("x2", width)  
                .attr("y2", y(50)) 
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("opacity", 1.0);
                
                
                };    
         
          var limits = scale_options.PM10.valueDomain;
          var colors = scale_options.PM10.colorRange;
               
        };
                  
               
     if (user_selected_value == "PM25"){
             
         
         if (max(dataGraphEU, (i) => i.value) >= 25){

                 svg.append("line")
                .style("stroke", "red")
                .attr("x1", 0)  
                .attr("y1", y(25))  
                .attr("x2", width)  
                .attr("y2", y(25)) 
               .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("opacity", 1.0);
                
                
            };  
               
            var limits = scale_options.PM25.valueDomain;
          var colors = scale_options.PM25.colorRange;
               
         
     };         
      
               
               
     svg.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", function (){
         if(user_selected_value == "PM10"){return y(500)};
   
         if(user_selected_value == "PM25"){return y(100)};      
     }) 
      .selectAll("stop")
        .data(
         function (){
         if(user_selected_value == "PM10"){return [{offset: "0%", color: "#00796b"},{offset: "4%", color: "#00796b"},{offset: "8%", color: "#f9a825"},{offset: "12%", color: "#e65100"},{offset: "20%", color: "#dd2c00"},{offset: "100%", color: "#8c0084"}]};
   
         if(user_selected_value == "PM25"){return [{offset: "0%", color: "#00796b"},{offset: "10%", color: "#00796b"},{offset: "20%", color: "#f9a825"},{offset: "40%", color: "#e65100"},{offset: "60%", color: "#dd2c00"},{offset: "100%", color: "#8c0084"}]};
             
     })
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });           
               
               
//               
//      const scale_options = {
//	"PM10": {
//		valueDomain: [0, 20, 40, 60, 100, 500],
//		colorRange: ['#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
//	},
//	"PM25": {
//		valueDomain: [0, 10, 20, 40, 60, 100],
//		colorRange: [,'#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
//	}
//};         
//               
                    
               
      svg.append("path")
     .data([dataGraphEU])
      .attr("class", "line")  
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)" )
//    .style("stroke", "black")
      .attr("d", valueline);
  
    svg.append("g")  
   .attr("transform", "translate(" + 0 + "," + height  + ")")
    .attr("class", "axis axis--x")
    .call(axisBottom(x).ticks(6));           
                           
               
      svg.append("g")
  .attr("class", "axis axis--y")
   .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .call(axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("PM μg/m³");           
               
     }); 
     
          graph = true;
        d3.select('#button'+ stationid ).html("Hide Graph!");       
   
            }else{  
             d3.select(selector).html(""); 
            graph = false;
            d3.select('#button'+ stationid ).html("Show Graph!");  
            };
 });
};  
        
        if(popuptype == "Atmo AURA MAP") {
           
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;
            console.log(stationid);
            console.log(d3.select('#button'+ stationid ));
            var graph = false;
        
            if (user_selected_value == "PM10"){    
            var filter = AtmoAURAData.PM10.features.filter(o => o.properties.site_id == stationid )
            };
            
            if (user_selected_value == "PM25"){
            var filter = AtmoAURAData.PM25.features.filter(o => o.properties.site_id == stationid )
            };
            
        var parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date)) - new Date(parseDate(b.properties.date));
        });
        console.log(filter);          
         
            console.log('#button'+ stationid);
            d3.select('#button'+ stationid).on('click', function(){  
            console.log("CLICK");
                                
            var selector = '#graph'+stationid;
           
            if (graph == false){
                
            var dataGraphAURA = filter.map(function(obj){
            var dataGraphObj = { "date": null , "value": 0};
            
            dataGraphObj.date = parseDate(obj.properties.date);
            dataGraphObj.value = parseFloat(obj.properties.valeur); 
            return dataGraphObj;
            });  
                
                
            console.log(dataGraphAURA);  
                
             var valueline = line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); })
            .defined(((d) => d.value != -1));
              
            var margin = {top: 20, right: 10, bottom: 30, left: 30},
    width = 270 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    var x = scaleTime().range([0, width]);
    var y = scaleLinear().range([height, 0]);     
                
               
               
    var svg = d3.select(selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");       
               
  x.domain(extent(dataGraphAURA, function(d) { return d.date; }));
  y.domain([0, max(dataGraphAURA, function(d) {return d.value;})]);
               
               
    console.log(x.domain(extent(dataGraphAURA, function(d) { return d.date; })));           
    console.log(y.domain([0, max(dataGraphAURA, function(d) {return d.value; })]));   
               
                
      if (user_selected_value == "PM10"){
         
         if (max(dataGraphAURA, (i) => i.value) >= 50){
                
                svg.append("line")
                .style("stroke", "red")
                .attr("x1", 0)  
                .attr("y1", y(50))  
                .attr("x2", width)  
                .attr("y2", y(50)) 
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("opacity", 1.0);
                
                
                };    
         
          var limits = scale_options.PM10.valueDomain;
          var colors = scale_options.PM10.colorRange;
               
        };
                  
               
     if (user_selected_value == "PM25"){
             
         
         if (max(dataGraphAURA, (i) => i.value) >= 25){

                 svg.append("line")
                .style("stroke", "red")
                .attr("x1", 0)  
                .attr("y1", y(25))  
                .attr("x2", width)  
                .attr("y2", y(25)) 
               .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("opacity", 1.0);
                
                
            };  
               
            var limits = scale_options.PM25.valueDomain;
          var colors = scale_options.PM25.colorRange;
               
         
     };                   
                
                
           
                svg.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", function (){
         if(user_selected_value == "PM10"){return y(500)};
   
         if(user_selected_value == "PM25"){return y(100)};      
     }) 
      .selectAll("stop")
        .data(
         function (){
         if(user_selected_value == "PM10"){return [{offset: "0%", color: "#00796b"},{offset: "4%", color: "#00796b"},{offset: "8%", color: "#f9a825"},{offset: "12%", color: "#e65100"},{offset: "20%", color: "#dd2c00"},{offset: "100%", color: "#8c0084"}]};
   
         if(user_selected_value == "PM25"){return [{offset: "0%", color: "#00796b"},{offset: "10%", color: "#00796b"},{offset: "20%", color: "#f9a825"},{offset: "40%", color: "#e65100"},{offset: "60%", color: "#dd2c00"},{offset: "100%", color: "#8c0084"}]};
             
     })
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });           
               
               
//               
//      const scale_options = {
//	"PM10": {
//		valueDomain: [0, 20, 40, 60, 100, 500],
//		colorRange: ['#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
//	},
//	"PM25": {
//		valueDomain: [0, 10, 20, 40, 60, 100],
//		colorRange: [,'#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
//	}
//};         
//               
                    
               
      svg.append("path")
     .data([dataGraphAURA])
      .attr("class", "line")  
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)" )
//    .style("stroke", "black")
      .attr("d", valueline);
  
    svg.append("g")  
   .attr("transform", "translate(" + 0 + "," + height  + ")")
    .attr("class", "axis axis--x")
    .call(axisBottom(x).ticks(3));           
                           
               
      svg.append("g")
  .attr("class", "axis axis--y")
   .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .call(axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("PM μg/m³");           
                     
        graph = true;
        d3.select('#button'+ stationid ).html("Hide Graph!");        
            }else{  
            d3.select(selector).html(""); 
            graph = false;
            d3.select('#button'+ stationid ).html("Show Graph!");  
            };
            });
        };
    })
};

function colorScaler(option,value){

    if (typeof value == 'object'){
        if(option == "PM10"){return colorScalePM10(value.PM10);};  
        if(option == "PM25"){return colorScalePM10(value.PM25);};   
     }else if (typeof value == 'number'){ 
        if(option == "PM10"){ return colorScalePM10(value);};
        if(option == "PM25"){return colorScalePM25(value);};     
     }else{console.log(typeof value)};
};

function retrieveData() {
    api.getData("https://data.sensor.community/static/v2/data.1h.json", 1).then(function (result) {
        if (result.timestamp > timestamp_data) {
            timestamp_data = result.timestamp;
            timestamp_from = result.timestamp_from;
        }


//            https://data.sensor.community/static/v2/data.dust.min.json
//            https://data.sensor.community/static/v2/data.1h.json 
//            https://data.sensor.community/static/v2/data.24h.json

const dateParser = timeParse("%Y-%m-%d %H:%M:%S");
const timestamp = dateParser(timestamp_data);
const localTime = new Date();
const timeOffset = localTime.getTimezoneOffset();
const newTime = timeMinute.offset(timestamp, -(timeOffset));
const dateFormater = locale.format("%H:%M:%S");

d3.select("#update").html(translate.tr(lang, "Last update") + ": " + dateFormater(newTime));
console.log("Timestamp " + timestamp_data + " from " + timestamp_from);

var mapper = result.cells.map(function(obj){
    var SCfeature = { "type": "Feature", "properties": { "id": 0, "data": {}, "indoor": 0}, "geometry": { "type": "Point", "coordinates": []}};

    SCfeature.geometry.coordinates[0] = obj.longitude;
    SCfeature.geometry.coordinates[1] = obj.latitude;
    SCfeature.properties.id = obj.id;
    SCfeature.properties.indoor = obj.indoor;
    SCfeature.properties.data = obj.data;

    return SCfeature;
    })

SC_PM.features = mapper;

console.log(SC_PM);


SCSensorsMap.clearLayers();
SCSensorsMap.addData(SC_PM).bringToBack();

d3.select("#loading_layer").style("display", "none");   
    });
}

function retrieveDataUBA() {

var dateString = UBAdateFormater(new Date());

var URLPM10 = "https://www.umweltbundesamt.de/api/air_data/v2/measures/json?component=0&scope=1&"+dateString;
var URLPM25 = "https://www.umweltbundesamt.de/api/air_data/v2/measures/json?component=1&scope=1&"+dateString;

console.log(URLPM10);
console.log(URLPM25);

    UBAdata.getData(URLPM10).then(function (result) {

    UBAofficialData.PM10.features = result;
    console.log(EUofficialData.PM10);

    if(user_selected_value == "PM10"){
    UBAStationsMap.clearLayers();
    UBAStationsMap.addData(UBAofficialData.PM10).bringToFront();
    }

        });

UBAdata.getData(URLPM25).then(function (result) {
    UBAofficialData.PM25.features = result;  
    console.log(EUofficialData.PM25);

    if(user_selected_value == "PM25"){
    UBAStationsMap.clearLayers();
    UBAStationsMap.addData(UBAofficialData.PM25).bringToFront();
    }

        });


}

function retrieveDataAtmoAURA() {

var URLPM10 = "http://api.atmo-aura.fr/api/v1/valeurs/horaire?api_token=1251e9082cde33bf43df042595c0583c&date_debut=-24hours&label_court_polluant=PM10&valeur_brute=true"
var URLPM25 = "http://api.atmo-aura.fr/api/v1/valeurs/horaire?api_token=1251e9082cde33bf43df042595c0583c&date_debut=-24hours&label_court_polluant=PM2.5&valeur_brute=true"

//    "http://api.atmo-aura.fr/api/v1/valeurs/horaire?api_token={api_token}&date_debut=-1hours&label_court_polluant={polluant}&valeur_brute=true"

console.log(URLPM10);
console.log(URLPM25);

AURAdata.getData(URLPM10)
    .then(function (result) {

//        console.log(result);        
    AtmoAURAData.PM10.features = result;
    console.log(AtmoAURAData.PM10);
    return getCurrent(AtmoAURAData.PM10.features);
    })
    .then(function (result){ 

    AtmoAURADataCurrent.PM10.features = result;


if(user_selected_value == "PM10"){
    AtmoAURAStationsMap.clearLayers();
    AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM10).bringToFront();
    }
});

AURAdata.getData(URLPM25).then(function (result) {

//       console.log(result);

    AtmoAURAData.PM25.features = result;  
    console.log(AtmoAURAData.PM25);

    return getCurrent(AtmoAURAData.PM25.features);

    })
    .then(function(result){


    AtmoAURADataCurrent.PM25.features = result;

     if(user_selected_value == "PM25"){
    AtmoAURAStationsMap.clearLayers();
    AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM25).bringToFront();
    }

}); 
}


function retrieveDataLuchtmeetnet() {
    
    
var dateStrings = LuchtmeetnetdateFormater(new Date());


var URLPM10 = "https://api.luchtmeetnet.nl/open_api/measurements?start="+ dateStrings[1] +"&end="+ dateStrings[0] + "&station_number=&formula=PM10"




var URLPM25 = "https://api.luchtmeetnet.nl/open_api/measurements?start="+ dateStrings[1] +"&end="+ dateStrings[0] + "&station_number=&formula=PM25"



console.log(URLPM10);
console.log(URLPM25);

Luchtmeetnetdata.getData(URLPM10)
    .then(function (result) {

//        console.log(result);        
    LuchtmeetnetData.PM10.features = result;
    console.log(LuchtmeetnetData.PM10);
    return getCurrent(LuchtmeetnetData.PM10.features);
    })
    .then(function (result){ 

    AtmoAURADataCurrent.PM10.features = result;


if(user_selected_value == "PM10"){
    AtmoAURAStationsMap.clearLayers();
    AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM10).bringToFront();
    }
});

Luchtmeetnetdata.getData(URLPM25).then(function (result) {

//       console.log(result);

    LuchtmeetnetData.PM25.features = result;  
    console.log(LuchtmeetnetData.PM25);

    return getCurrent(LuchtmeetnetData.PM25.features);

    })
    .then(function(result){


    AtmoAURADataCurrent.PM25.features = result;

     if(user_selected_value == "PM25"){
    AtmoAURAStationsMap.clearLayers();
    AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM25).bringToFront();
    }

}); 
}





















function retrieveDataEU() {

var dateString = EUdateFormater(new Date());
var URLPM10 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM10&dt="+dateString;
var URLPM25 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM25&dt="+dateString;   
//      
//         var URLPM10 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM10&dt="+dateString;
//    var URLPM25 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM25&dt="+dateString;  
//        

console.log(URLPM10);
console.log(URLPM25);

EUdata.getData(URLPM10).then(function (result) {

    EUofficialData.PM10.features = result;
    console.log(EUofficialData.PM10);

    if(user_selected_value == "PM10"){
    EUStationsMap.clearLayers();
    EUStationsMap.addData(EUofficialData.PM10).bringToFront();
    }

        });

EUdata.getData(URLPM25).then(function (result) {
    EUofficialData.PM25.features = result;  
    console.log(EUofficialData.PM25);

    if(user_selected_value == "PM25"){
    EUStationsMap.clearLayers();
    EUStationsMap.addData(EUofficialData.PM25).bringToFront();
    }

        });

console.log(user_selected_value);



}    
    

function LuchtmeetnetdateFormater(date) {
    
const dateFormater = timeFormat("%Y-%m-%dT%H:%M:%SZ");

    var result =[];
    result.push(dateFormater(date));
    
    result.push(dateFormater(date.setHours(date.getHours()-12)));

    console.log(date.getDate()-12);
    console.log(result);

return result;
}







function EUdateFormater(date) {

    date.setDate(date.getDate()); // can adjust the day by substracting

//    var result = date.getUTCFullYear().toString() + pad(date.getUTCMonth(),2,true) + pad(date.getUTCDate(),2,false) +pad(date.getUTCHours(),2, false)+pad(date.getUTCMinutes(),2,false) + pad(date.getUTCSeconds(),2,false);

    var result = date.getUTCFullYear().toString() + pad(date.getUTCMonth(),2,true) + pad(date.getUTCDate(),2,false) +pad(date.getHours()-2,2, false)+"00" + "00";  //last full hour
    
//    date.getUTCHours

return result;
}

function UBAdateFormater(date) {

    date.setDate(date.getDate()-1); // can adjust the day by substracting

    
   var result = "date_from="+date.getUTCFullYear().toString()+"-"+pad(date.getUTCMonth(),2,true)+"-"+pad(date.getUTCDate(),2,false)+"&time_from=12"+"&date_to="+date.getUTCFullYear().toString()+"-"+pad(date.getUTCMonth(),2,true)+"-"+pad(date.getUTCDate(),2,false)+"&time_to=12";

return result;
}

function pad(num,size,month) {

if (month == true){
   num += 1;
    num = num.toString();
    }else{
num = num.toString();
}
while (num.length < size) num = "0" + num;
return num;
}

function setQueryString() {
	let stateObj = {};
	let new_path = window.location.pathname + "?";
	if (query.nooverlay != "false") new_path += "nooverlay&";
	if (query.selection != config.selection) new_path += "selection="+query.selection+"&";
	if (! d3.select("#cb_wind").property("checked")) new_path += "nowind&";
	if (! d3.select("#cb_labs").property("checked")) new_path += "nolabs&";
	new_path = new_path.slice(0,-1) + location.hash;
	console.log(new_path);
	history.pushState(stateObj,document.title,new_path);
}

function switchLabLayer() {
	if (d3.select("#cb_labs").property("checked")) {
		map.getPane('markerPane').style.visibility = "visible";
	} else {
		map.getPane('markerPane').style.visibility = "hidden";
	}
	setQueryString();
}

function switchWindLayer() {
	if (d3.select("#cb_wind").property("checked")) {
		d3.selectAll(".velocity-overlay").style("visibility", "visible");
	} else {
		d3.selectAll(".velocity-overlay").style("visibility", "hidden");
	}
	setQueryString();
}

function switchLegend(val) {
	d3.select('#legendcontainer').selectAll("[id^=legend_]").style("display", "none");
	d3.select('#legend_' + val).style("display", "block");
}

/*  Menu and Dropdown */
function openSidebar() {
	document.getElementById("menu").innerHTML = "&#10006;";
	document.getElementById("sidebar").style.display = "block";
}

function closeSidebar() {
	document.getElementById("menu").innerHTML = "&#9776;";
	document.getElementById("sidebar").style.display = "none";
	d3.select("#results").remove();
}

function toggleSidebar() {
	if (document.getElementById("sidebar").style.display === "block") {
		closeSidebar();
	} else {
		openSidebar()
	}
}

function toggleExplanation() {
	const x = document.getElementById("map-info");
	if (x.style.display === "none") {
		x.style.display = "block";
		d3.select("#explanation").html(translate.tr(lang, "Hide explanation"));
	} else {
		x.style.display = "none";
		d3.select("#explanation").html(translate.tr(lang, "Show explanation"));
	}
}

function reloadMap(val) {
	closeSidebar();
	switchLegend(val);

    SCSensorsMap.clearLayers();
    SCSensorsMap.addData(SC_PM).bringToBack();
    
     if(val == "PM10"){
        EUStationsMap.clearLayers();
        EUStationsMap.addData(EUofficialData.PM10).bringToFront();
        AtmoAURAStationsMap.clearLayers();
        AtmoAURAStationsMap.addData(AtmoAURAData.PM10).bringToFront();
        };
    
     if(val == "PM25"){
        EUStationsMap.clearLayers();
        EUStationsMap.addData(EUofficialData.PM25).bringToFront();
        AtmoAURAStationsMap.clearLayers();
        AtmoAURAStationsMap.addData(AtmoAURAData.PM25).bringToFront();   
        }; 
}

function sensorNr(data) {
	let inner_pre = "#";

	openSidebar();

	let textefin = "<table id='results' style='width:380px;'><tr><th class ='title'>" + translate.tr(lang, 'Sensor') + "</th><th class = 'title'>" + translate.tr(lang, titles[user_selected_value]) + "</th></tr>";
	if (data.length > 1) {
		textefin += "<tr><td class='idsens'>Median " + data.length + " Sens.</td><td>" + (isNaN(parseInt(data_median(data))) ? "-" : parseInt(data_median(data))) + "</td></tr>";
	}
	let sensors = '';
	data.forEach(function (i) {
		sensors += "<tr><td class='idsens' id='id_" + i.o.id + (i.o.indoor? "_indoor":"") + "'>" + inner_pre + i.o.id + (i.o.indoor? " (indoor)":"") +"</td>";
		if (user_selected_value === "PM10") {
			sensors += "<td>" + i.o.data[user_selected_value] + "</td></tr>";
		}
		if (user_selected_value === "PM25") {
			sensors += "<td>" + i.o.data[user_selected_value] + "</td></tr>";
		}
		sensors += "<tr id='graph_" + i.o.id + "'></tr>";
	});
	textefin += sensors;

	textefin += "</table>";

	div.transition().duration(200).style("display", "block");

	div.html(textefin).style("padding", "10px");

	d3.selectAll(".idsens").on("click", function () {
		displayGraph(d3.select(this).attr("id"));
	});
}

function displayGraph(id) {

	let inner_pre = "";
	const panel_str = "<iframe src='https://maps.sensor.community/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=<PANELID>&var-node=<SENSOR>' width='290' height='200' frameborder='0'></iframe>";
	const sens = id.substr(3);
	const sens_id = sens.replace("_indoor", "");
	const sens_desc = sens.replace("_indoor", " (indoor)");

	if (!openedGraph1.includes(sens_id)) {
		openedGraph1.push(sens_id);

		const iddiv = "#graph_" + sens_id;

		d3.select(iddiv).append("td")
			.attr("id", "frame_" + sens_id)
			.attr("colspan", "2")
			.html((panelIDs[user_selected_value][0] > 0 ? panel_str.replace("<PANELID>", panelIDs[user_selected_value][0]).replace("<SENSOR>", sens_id) + "<br/>":"") + (panelIDs[user_selected_value][1] > 0 ? panel_str.replace("<PANELID>", panelIDs[user_selected_value][1]).replace("<SENSOR>", sens_id):""));


		d3.select("#id_" + sens).html(inner_pre + "#" + sens_desc);
		d3.select("#frame_" + sens_id).remove();
		removeInArray(openedGraph1, sens_id);
	
}
}

function removeInArray(array) {
	let what, a = arguments, L = a.length, ax;
	while (L > 1 && array.length) {
		what = a[--L];
		while ((ax = array.indexOf(what)) !== -1) {
			array.splice(ax, 1);
		}
	}
	return array;
}

function showAllSelect() {
	const custom_select = d3.select("#custom-select");
	if (custom_select.select(".select-items").empty()) {
		custom_select.append("div").attr("class", "select-items");
		custom_select.select("select").selectAll("option").each(function (d) {
			if (this.value !== user_selected_value) custom_select.select(".select-items").append("div").html("<span>"+d3.select(this).html()+"</span>").attr("id", "select-item-" + this.value).on("click", function () {
				switchTo(this);
			});
			custom_select.select("#select-item-Noise").select("span").attr("id","noise_option");
		});
		custom_select.select(".select-selected").attr("class", "select-selected select-arrow-active");
	}else{
        custom_select.select(".select-items").remove();
        custom_select.select(".select-selected").attr("class", "select-selected select-arrow-inactive"); 
    }	
}

function switchTo(element) {
	const custom_select = d3.select("#custom-select");
	custom_select.select("select").property("value", element.id.substring(12));
	custom_select.select(".select-selected").html("<span>"+custom_select.select("select").select("option:checked").html()+"</span>");
	user_selected_value = element.id.substring(12);

    custom_select.select(".select-selected").select("span").attr("id",null);

	custom_select.select(".select-selected").attr("class", "select-selected");
	reloadMap(user_selected_value);
	custom_select.select(".select-items").remove();
}

function getCurrent(data){
    var current = [];
    var parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");
    var listeSites = [];
    data.forEach(function(e){
        if(!listeSites.includes(e.properties.site_id)){        
                listeSites.push(e.properties.site_id)}     
        });
    
    listeSites.forEach(function(e){
        var filter = data.filter(o => o.properties.site_id == e)
        
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date)) - new Date(parseDate(b.properties.date));
        });
//        console.log(filter);
        
        current.push(filter[filter.length-1])
        
    });
    
 return current   
}
