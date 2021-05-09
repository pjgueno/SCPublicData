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
//import labs from './labs.js';
import wind from './wind.js';
import * as config from './config.js';
import EUdata from './eudata.js';
import UBAdata from './ubadata.js';
import AURAdata from './auradata.js';
import PACAdata from './pacadata.js';
import Occitaniedata from './occitaniedata.js';
import Luchtmeetnetdata from './Luchtmeetnetdata.js';

import '../css/style.css';
import * as places from './places.js';
import * as zooms from './zooms.js';
import * as translate from './translate.js';

// favicon config
import './static-files';

//Atmo Sud et Atmo Occitanie

//
//https://api.luchtmeetnet.nl/open_api/stations/NL10301
//https://api-docs.luchtmeetnet.nl/#701eea5c-3f0f-48cb-b7fa-9f53a4a8d10f
//

//Liste a cocher sources
//timestamp en metadata

//Liste de radios : current / 1h /24 h selon les sources

// declare data containers


//UBA CORS

//https://www.umweltbundesamt.de/daten/luft/luftdaten/doc#tag/measurements

//https://www.umweltbundesamt.de/api/air_data/v2/measures/json?date_from=2021-04-21&time_from=1&date_to=2021-04-21&time_to=15

//https://aqs.epa.gov/aqsweb/documents/data_api.html


//Lien vers les API officielles


//REVOIR SI APPEL EN UTC?
//Date.UTC()


//https://www.umweltbundesamt.de/api/air_data/v2/measures/chart?date_from=2021-04-23&time_from=24&date_to=2021-05-01&time_to=23&data[0][co]=1&data[0][sc]=3&data[0][da]=2021-05-01&data[0][st]=1777


//    https://www.umweltbundesamt.de/api/air_data/v2/components/json
    
//    https://www.umweltbundesamt.de/api/air_data/v2/scopes/json


// https://www.umweltbundesamt.de/api/air_data/v2/measures/chart?date_from=2021-04-23&time_from=24&date_to=2021-05-01&time_to=23&data[0][co]=1&data[0][sc]=2&data[0][st]=1777



//define the data "tables"


let SC_PM = {"type": "FeatureCollection","name": "SCSensors","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []};

let  EUofficialData = {PM10:{"type": "FeatureCollection","name": "eustations_EEA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "eustations_EEA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let UBAofficialData = {PM10:{"type": "FeatureCollection","name": "stations_UBA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_UBA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoAURAData ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoAURADataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};


let AtmoPACAData ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoPACADataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoOccitanieData ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoOccitanieDataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};



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
};

const div = d3.select("#sidebar").append("div").attr("id", "table").style("display", "none");

const map = L.map('map', {zoomControl: true, minZoom: config.minZoom, maxZoom: config.maxZoom, doubleClickZoom: false});

var data_host = "";
data_host = "https://maps.sensor.community";
config.tiles = config.tiles_server + config.tiles_path;

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
//	nolabs: "false",
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
//if (query.nolabs === "false") { config.layer_labs = 1 } else {config.layer_labs = 0;}
if (query.noeustations === "false") { config.layer_eustations = 1 } else {config.layer_eustations = 0;}

// show betterplace overlay
if (query.nooverlay === "false") d3.select("#betterplace").style("display", "inline-block");
//d3.select("#loading").html(translate.tr(lang,d3.select("#loading").html()));
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


// json object to log which data are downloaded and dislayed

var timer0 = new Date

var logger = {
"sc":{"display":false,"data":"nodata","time":timer0},
"eea":{"display":false,"data":"nodata","time":timer0},
"uba":{"display":false,"data":"nodata","time":timer0},
"aura":{"display":false,"data":"nodata","time":timer0},
"paca":{"display":false,"data":"nodata","time":timer0},
"occi":{"display":false,"data":"nodata","time":timer0},
"lucht":{"display":false,"data":"nodata","time":timer0}
};


// Intitialisation of the Leaflet Layers for each dataset


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
                          
                        var popupContent = "<h2>EU STATIONS MAP</h2><p><b>Name</b> : "+feature.properties.Name+"</p><p><b>Value</b> : "+feature.properties.Value+" µg\/m&sup3; ("+ feature.properties.type +")</p><button type='button' id='button" + feature.properties.samplePointID + "' value='" + feature.properties.samplePointID + "'>Show graph!</button><div id='graph"+ feature.properties.samplePointID +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }
                        }).addTo(map);



var UBAStationsMap = L.geoJSON(UBAofficialData.PM25,{
    
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.value),
                        stroke:true,
                        weight:2,
                        stroke:true,
                        color :'black',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                                                    
                          if (feature.properties.Value == -1){feature.properties.Value = "N/A"};
                          
                        var popupContent = "<h2>UBA STATIONS MAP</h2><p><b>Name</b> : "+feature.properties.name+"</p><p><b>Value</b> : "+feature.properties.value+" µg\/m&sup3; ("+ feature.properties.type1 +")</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }


                        }).addTo(map);




//
var AtmoPACAStationsMap = L.geoJSON(AtmoPACADataCurrent.PM25,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.valeur),
                        stroke:true,
                        weight:2,
                        stroke:true,
                        color :'black',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                          
                          if (feature.properties.valeur == -1){feature.properties.valeur = "N/A"};
                          
                        var popupContent = "<h2>Atmo PACA MAP</h2><p><b>Name</b> : "+feature.properties.nom_station+"</p><p><b>Value</b> : "+feature.properties.valeur+" µg\/m&sup3; ("+ feature.properties.influence +")</p><button type='button' id='button" + feature.properties.code_station + "' value='" + feature.properties.code_station + "'>Show graph!</button><div id='graph"+ feature.properties.code_station +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }


                        }).addTo(map);

var AtmoOccitanieStationsMap = L.geoJSON(AtmoOccitanieDataCurrent.PM25,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.valeur),
                        stroke:true,
                        weight:2,
                        stroke:true,
                        color :'violet',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                          
                          if (feature.properties.valeur == -1){feature.properties.valeur = "N/A"};
                          
                        var popupContent = "<h2>Atmo Occitanie MAP</h2><p><b>Name</b> : "+feature.properties.nom_station+"</p><p><b>Value</b> : "+feature.properties.valeur+" µg\/m&sup3; ("+ feature.properties.influence +")</p><button type='button' id='button" + feature.properties.code_station + "' value='" + feature.properties.code_station + "'>Show graph!</button><div id='graph"+ feature.properties.code_station +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }


                        }).addTo(map);

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
                          
                          if (feature.properties.valeur == -1){feature.properties.valeur = "N/A"};
                          
                        var popupContent = "<h2>Atmo AURA MAP</h2><p><b>Name</b> : "+feature.properties.label+"</p><p><b>Value</b> : "+feature.properties.valeur+" µg\/m&sup3; ("+ feature.properties.typologie +")</p><button type='button' id='button" + feature.properties.site_id + "' value='" + feature.properties.site_id + "'>Show graph!</button><div id='graph"+ feature.properties.site_id +"'></div>";
                        layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
                      }


                        }).addTo(map);

var LuchtmeetnetStationsMap = L.geoJSON(LuchtmeetnetData.PM25,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorScaler(user_selected_value,feature.properties.value),
                        stroke:true,
                        weight:2,
                        stroke:true,
                        color :'yellow',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                          
                          if (feature.properties.value == -1){feature.properties.value = "N/A"};
                          
                        var popupContent = "<h2>Luchtmeetnet MAP</h2><p><b>Name</b> : "+feature.properties.location+"</p><p><b>Value</b> : "+feature.properties.value+" µg\/m&sup3; ("+ feature.properties.timestamp_measured +")</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
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
	d3.select('#map-info').html(translate.tr(lang, 
                                             
    "<p>This maps aggregates public data about air quality from official providers</p> \
    <p>Click on the point to display informations about the official stations or about Sensor.Community's sensors</p> \
    <p>You can then display the graphiv for the past few days</p> \
    <p></p>"));
    
    
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
//retrieveData();
//    retrieveDataEU();
    //retrieveDataLuchtmeetnet();
   // retrieveDataUBA();
   // retrieveDataAtmoAURA();
   // retrieveDataAtmoPACA();
    //retrieveDataAtmoOccitanie();


    
//    REVOIR ICI AVEC DES IF
    
	// refresh data
	setInterval(function () {
//    SCSensorsMap.clearLayers();
//	retrieveData();
        
        
        
//        EUStationsMap.clearLayers();
//       retrieveDataEU();
//        LuchtmeetnetStationsMap.clearLayers();
//        retrieveDataLuchtmeetnet();
       // UBAStationsMap.clearLayers();
       // retrieveDataUBA();
//        AtmoAURAStationsMap.clearLayers();
//        retrieveDataAtmoAURA();
//        AtmoPACAStationsMap.clearLayers();
//        retrieveDataAtmoPACA()
//        AtmoOccitanieStationsMap.clearLayers();
//        retrieveDataAtmoOccitanie();
	}, 900000);

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
//	if (config.layer_labs) {
//		d3.select("#cb_labs").property("checked", true);
//	} else {
//		d3.select("#cb_labs").property("checked", false);
//	}
	
	if (config.layer_wind) {
		d3.select("#cb_wind").property("checked", true);
	} else {
		d3.select("#cb_wind").property("checked", false);
	}

//	labs.getData(data_host + "/local-labs/labs.json", map);
	wind.getData(data_host + "/data/v1/wind.json", map, switchWindLayer);
	
//	d3.select("#label_local_labs").html(translate.tr(lang, "Local labs"));
	d3.select("#label_wind_layer").html(translate.tr(lang, "Wind layer"));

//	switchLabLayer();
	switchWindLayer();
//	d3.select("#cb_labs").on("change", switchLabLayer);
	d3.select("#cb_wind").on("change", switchWindLayer);
    
    
    
//    Events for the checkboxes
    
    
    d3.select("#sc").on("change", function (){switcher("sc",SCSensorsMap)});
//    d3.select("#eea").on("change", switchEEA);
    d3.select("#uba").on("change", function (){switcher("uba",UBAStationsMap)});
//    d3.select("#aura").on("change", switchAURA);
//    d3.select("#paca").on("change", switchPACA);
//    d3.select("#occi").on("change", switchOccitanie);
//    d3.select("#lucht").on("change", switchLuchtmeetnet);
    
    
//    Events for the radios

    
    d3.selectAll('input[type="radio"][name="sc"]').on("change", function (){switcher2("sc",this.value,SCSensorsMap)});
//    d3.selectAll('input[type="radio"][name="eea"]').on("change", function (){switcher2("eea",this.value,SCSensorsMap)});
    d3.selectAll('input[type="radio"][name="uba"]').on("change", function (){switcher2("uba",this.value,UBAStationsMap)});
//    d3.selectAll('input[type="radio"][name="aura"]').on("change", function (){switcher2("aura",this.value,SCSensorsMap)});
//    d3.selectAll('input[type="radio"][name="paca"]').on("change", function (){switcher2("paca",this.value,SCSensorsMap)});
//    d3.selectAll('input[type="radio"][name="occi"]').on("change", function (){switcher2("occi",this.value,SCSensorsMap)});
//    d3.selectAll('input[type="radio"][name="lucht"]').on("change", function (){switcher2("lucht",this.value,SCSensorsMap)});
    
    
    
    
    
    
    

    map.on('popupopen', function(e){
        console.log("open popup");
        //console.log(e.popup.getElement());
        
        var popuptype = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[0].innerText;
        
        console.log(popuptype);
        
        if (popuptype == "SENSORS MAP"){        
            
            var sensorid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[4].value;
                
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
                        
            var graph = false;
            
            console.log("https://discomap.eea.europa.eu/Map/UTDViewer/dataService/SamplingPoint?spo="+stationid);
            
            d3.select('#button'+ stationid ).on('click', function(){                  
            var selector = '#graph'+stationid;
            
            var urlEU = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/SamplingPoint?spo="+ stationid.replaceAll("xxx",".").replaceAll("yyy",":");
                
            
            var parseDate = timeParse("%Y%m%d%H%M%S");
                
            if (graph == false){
                
           fetch(urlEU)
			.then((resp) => resp.text())
			.then((data) => {
           
				console.log('successful retrieved data');               
               
//        FILTER LAST 2 DAYS
               
        var dataGraphEU = csvParse(data).filter(obj=>Math.abs(Date.now() - parseDate(obj.DATETIME_END).getTime()) <= (2*24*3600*1000)).map(function(obj){
        var dataGraphObj = { "date": null , "value": 0};
        dataGraphObj.date = parseDate(obj.DATETIME_END);
        dataGraphObj.value = parseFloat(obj.VALUE_NUMERIC);
        return dataGraphObj;
        });
        

        console.log(dataGraphEU);
      
               
    dataGraphEU.sort(function(a,b){return (a.date)-(b.date)});       
    graphicBuilder(dataGraphEU,selector);               
               
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
               
        if(popuptype == "Luchtmeetnet MAP") {
            
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;
                        
            var graph = false;
            
            console.log("https://api.luchtmeetnet.nl/open_api/stations/"+stationid+"/measurements?page=1&order=timestamp_measured&order_direction=desc&formula=");
            
            d3.select('#button'+ stationid ).on('click', function(){                  
            var selector = '#graph'+stationid;
               
            if (user_selected_value == "PM10"){
            
                 var urlLuchtmeetnet = "https://api.luchtmeetnet.nl/open_api/stations/"+stationid+"/measurements?page=1&order=timestamp_measured&order_direction=desc&formula=PM10";

            };


            if (user_selected_value == "PM25"){

                 var urlLuchtmeetnet = "https://api.luchtmeetnet.nl/open_api/stations/"+stationid+"/measurements?page=1&order=timestamp_measured&order_direction=desc&formula=PM25";

            };         
            
            var parseDate = timeParse("%Y-%m-%dT%H:%M:%S+00:00");
                
            if (graph == false){
                
           fetch(urlLuchtmeetnet)
			.then((resp) => resp.json())
			.then((data) => {
           
				console.log('successful retrieved data');
                           
        var dataGraphLuchtmeetnet = data.data.map(function(obj){
        var dataGraphObj = { "date": null , "value": 0};
        
        dataGraphObj.date = parseDate(obj.timestamp_measured);
        dataGraphObj.value = parseFloat(obj.value);
        return dataGraphObj;
        });
      
               
    dataGraphLuchtmeetnet.sort(function(a,b){return (a.date)-(b.date)});             
    graphicBuilder(dataGraphLuchtmeetnet,selector);               
     }); 
     
          graph = true;
        d3.select('#button'+ stationid).html("Hide Graph!");       
   
            }else{  
             d3.select(selector).html(""); 
            graph = false;
            d3.select('#button'+ stationid).html("Show Graph!");  
            };
 });
};  
        
        if(popuptype == "Atmo AURA MAP") {
           
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;

            console.log(stationid);
            
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
         
            console.log('#button'+ stationid);
            d3.select('#button'+ stationid).on('click', function(){  
                                
            var selector = '#graph'+stationid;
           
            if (graph == false){
                
            var dataGraphAURA = filter.map(function(obj){
            var dataGraphObj = { "date": null , "value": 0};
            
            dataGraphObj.date = parseDate(obj.properties.date);
            dataGraphObj.value = parseFloat(obj.properties.valeur); 
            return dataGraphObj;
            });  
                
            graphicBuilder(dataGraphAURA,selector);
        
        graph = true;
        d3.select('#button'+ stationid).html("Hide Graph!");        
            }else{  
            d3.select(selector).html(""); 
            graph = false;
            d3.select('#button'+ stationid).html("Show Graph!");  
            };
            });
        };
        
        if(popuptype == "Atmo PACA MAP") {
           
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;

            var graph = false;
        
            if (user_selected_value == "PM10"){    
            var filter = AtmoPACAData.PM10.features.filter(o => o.properties.code_station == stationid )
            };
            
            if (user_selected_value == "PM25"){
            var filter = AtmoPACAData.PM25.features.filter(o => o.properties.code_station == stationid )
            };
            
        var parseDate = timeParse("%Y/%m/%d %H:%M");
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
         
            console.log('#button'+ stationid);
            d3.select('#button'+ stationid).on('click', function(){  
                                
            var selector = '#graph'+stationid;
           
            if (graph == false){
                
            var dataGraphPACA = filter.map(function(obj){
            var dataGraphObj = { "date": null , "value": 0};
            
            dataGraphObj.date = parseDate(obj.properties.date_fin);
            dataGraphObj.value = parseFloat(obj.properties.valeur); 
            return dataGraphObj;
            });  
                
            graphicBuilder(dataGraphPACA,selector);
        
        graph = true;
        d3.select('#button'+ stationid).html("Hide Graph!");        
            }else{  
            d3.select(selector).html(""); 
            graph = false;
            d3.select('#button'+ stationid).html("Show Graph!");  
            };
            });
        };
        
        if(popuptype == "Atmo Occitanie MAP") {
           
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;

            var graph = false;
        
            if (user_selected_value == "PM10"){    
            var filter = AtmoOccitanieData.PM10.features.filter(o => o.properties.code_station == stationid )
            };
            
            if (user_selected_value == "PM25"){
            var filter = AtmoOccitanieData.PM25.features.filter(o => o.properties.code_station == stationid )
            };
            
        var parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
         
            console.log('#button'+ stationid);
            d3.select('#button'+ stationid).on('click', function(){  
                                
            var selector = '#graph'+stationid;
           
            if (graph == false){
                
            var dataGraphOccitanie = filter.map(function(obj){
            var dataGraphObj = { "date": null , "value": 0};
            
            dataGraphObj.date = parseDate(obj.properties.date_fin);
            dataGraphObj.value = parseFloat(obj.properties.valeur); 
            return dataGraphObj;
            });  
                
            graphicBuilder(dataGraphOccitanie,selector);
        
        graph = true;
        d3.select('#button'+ stationid).html("Hide Graph!");        
            }else{  
            d3.select(selector).html(""); 
            graph = false;
            d3.select('#button'+ stationid).html("Show Graph!");  
            };
            });
        };
        
         if(popuptype == "UBA STATIONS MAP") {
           
            var stationid = d3.select(e.popup.getElement())._groups[0][0].children[0].children[0].children[3].value;
             
            console.log(stationid);

            var graph = false;
        
            d3.select('#button'+ stationid ).on('click', function(){                  
            var selector = '#graph'+stationid;
                
            var dateString = UBAdateFormater(new Date(),new Date(),1);
               
            if (user_selected_value == "PM10"){
            
                 var urlUBA = "https://maps.sensor.community/uba-api/air_data/v2/measures/chart?"+ dateString +"&data[0][co]=1&data[0][sc]=2&data[0][st]="+stationid;
                
                
             //   changer le SCOPE!!!!

            };


            if (user_selected_value == "PM25"){

                 var urlUBA = "https://maps.sensor.community/uba-api/air_data/v2/measures/chart?"+ dateString +"&data[0][co]=9&data[0][sc]=2&data[0][st]="+stationid;

            };         
            
                
            console.log(urlUBA);
                
                
              var parseDate = timeParse("%Y-%m-%d %H:%M:%S");
                
            if (graph == false){
                
           fetch(urlUBA)
			.then((resp) => resp.json())
			.then((data) => {
          
				console.log('successful retrieved data');
               
               
        var keynr = data.request.data[0].co.concat(data.request.data[0].sc).concat(data.request.data[0].st);
        
               console.log(keynr);
               
        var dataGraphOri = data.data.values[keynr][3];
        var dataKeys = Object.keys(dataGraphOri);
            
        console.log(dataGraphOri); 
        
        var dataGraphUBA= [];
               
               
        dataKeys.forEach(function(k){
            
            var dataGraphObj = { "date": null , "value": 0};
            dataGraphObj.date = parseDate(k);
            dataGraphObj.value = parseInt(dataGraphOri[k]);
            
            dataGraphUBA.push(dataGraphObj);
        });

               
        console.log(dataGraphUBA);
           
      dataGraphUBA.sort(function(a,b){return (a.date)-(b.date)});                 graphicBuilder(dataGraphUBA,selector);               
//     }); 
//     
          graph = true;
        d3.select('#button'+ stationid).html("Hide Graph!");       
//   
           });
           }else{  
//             d3.select(selector).html(""); 
//            graph = false;
//            d3.select('#button'+ stationid).html("Show Graph!");  
          };
 });
             
             
             
        };
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    })
};

function colorScaler(option,value){
    
    

    if (typeof value == 'object'){
        
        if (value != null){
        if(option == "PM10"){return colorScalePM10(value.PM10);};  
        if(option == "PM25"){return colorScalePM10(value.PM25);};     
        }else{
            return 'grey';
        }
        
     }else if (typeof value == 'number'){ 
        if(option == "PM10"){ return colorScalePM10(value);};
        if(option == "PM25"){return colorScalePM25(value);};     
     }else{console.log(typeof value)};
};

function retrieveData(option) {
    
    var urlapi = "";
    
    switch (option) {
      case "current":
        urlapi = "https://data.sensor.community/static/v2/data.dust.min.json";
        break;
      case "hourly":
        urlapi = "https://data.sensor.community/static/v2/data.1h.json";
        break;
      case "daily":
        urlapi = "https://data.sensor.community/static/v2/data.24h.json";
        break;
    };
    
    
    
    api.getData(urlapi, 1).then(function (result) {
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
        
if(logger.sc.display == true){
    
    SCSensorsMap.clearLayers();
    SCSensorsMap.addData(SC_PM).bringToBack();
    
};


        
//d3.select("#loading_layer").style("display", "none");   
    });    
}

function retrieveDataUBA(option) {

 

//var URLPM10 = "https://www.umweltbundesamt.de/api/air_data/v2/measures/json?date_from=2021-04-21&time_from=1&date_to=2021-04-21&time_to=15&component=1";
    
//PM2.5 does not work  
//var URLPM25 = "https://www.umweltbundesamt.de/api/air_data/v2/measures/json?date_from=2021-04-21&time_from=1&date_to=2021-04-21&time_to=15&component=9";
    
//    https://www.umweltbundesamt.de/api/air_data/v2/components/json
    
//    https://www.umweltbundesamt.de/api/air_data/v2/scopes/json
    
    
//    REVOIR HEURE UTC OU HEURE LOCALE?
    
    
    switch (option) {
      case "hourly":
        var dateString = UBAdateFormater(new Date(),new Date(),0);
        var URLPM10 = "https://maps.sensor.community/uba-api/air_data/v2/measures/json?" + dateString + "&component=1&scope=2";
        break;
      case "daily":
        var dateString = UBAdateFormater(new Date(),new Date(),1);
        var URLPM10 = "https://maps.sensor.community/uba-api/air_data/v2/measures/json?" + dateString + "&component=1&scope=1";
        break;
    };
    

console.log(URLPM10);


UBAdata.getData(URLPM10).then(function (result) {
    
    
    console.log(result)
    
    
    UBAofficialData.PM10.features = result;
    
    console.log(UBAofficialData.PM10.features);

    if(user_selected_value == "PM10"){
    UBAStationsMap.clearLayers();
    UBAStationsMap.addData(UBAofficialData.PM10).bringToFront();
    }

        });
}

function retrieveDataAtmoAURA() {

var URLPM10 = "http://api.atmo-aura.fr/api/v1/valeurs/horaire?api_token=1251e9082cde33bf43df042595c0583c&date_debut=-24hours&label_court_polluant=PM10&valeur_brute=true"
var URLPM25 = "http://api.atmo-aura.fr/api/v1/valeurs/horaire?api_token=1251e9082cde33bf43df042595c0583c&date_debut=-24hours&label_court_polluant=PM2.5&valeur_brute=true"

//    "http://api.atmo-aura.fr/api/v1/valeurs/horaire?api_token={api_token}&date_debut=-1hours&label_court_polluant={polluant}&valeur_brute=true"

AURAdata.getData(URLPM10)
    .then(function (result) {

//        console.log(result);        
    AtmoAURAData.PM10.features = result;
    return getCurrentAURA(AtmoAURAData.PM10.features);
    })
    .then(function (result){ 

    AtmoAURADataCurrent.PM10.features = result;


if(user_selected_value == "PM10"){
    AtmoAURAStationsMap.clearLayers();
    AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM10).bringToFront();
    }
});

AURAdata.getData(URLPM25).then(function (result) {

    AtmoAURAData.PM25.features = result;  
    return getCurrentAURA(AtmoAURAData.PM25.features);

    })
    .then(function(result){
    
    AtmoAURADataCurrent.PM25.features = result;

     if(user_selected_value == "PM25"){
    AtmoAURAStationsMap.clearLayers();
    AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM25).bringToFront();
    }

}); 
}

function retrieveDataAtmoPACA() {

var URL = "https://geoservices.atmosud.org/geoserver/mes_sudpaca_horaire_poll_princ/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mes_sudpaca_horaire_poll_princ:mes_sudpaca_horaire_3j&outputFormat=application/json&srsName=EPSG:4326"

PACAdata.getData(URL)
    .then(function (result) {

//    console.log(result);
    
    AtmoPACAData.PM10.features = result.PM10;
    AtmoPACAData.PM25.features = result.PM25;
    return getCurrentPACA(AtmoPACAData);
    })
    .then(function (result){
    
    console.log(result)
    
    AtmoPACADataCurrent.PM10.features = result.PM10;
    AtmoPACADataCurrent.PM25.features = result.PM25;
    
if(user_selected_value == "PM10"){
    AtmoPACAStationsMap.clearLayers();
    AtmoPACAStationsMap.addData(AtmoPACADataCurrent.PM10).bringToFront();
    };

     if(user_selected_value == "PM25"){
    AtmoPACAStationsMap.clearLayers();
    AtmoPACAStationsMap.addData(AtmoPACADataCurrent.PM25).bringToFront();
    };

}); 
}

function retrieveDataAtmoOccitanie() {

var URL = "https://opendata.arcgis.com/datasets/4a648b54876f485e92f22e2ad5a5da32_0.geojson"

Occitaniedata.getData(URL)
    .then(function (result) {

//    console.log(result);
    
    AtmoOccitanieData.PM10.features = result.PM10;
    AtmoOccitanieData.PM25.features = result.PM25;
    return getCurrentOccitanie(AtmoOccitanieData);
    })
    .then(function (result){
    
    console.log(result)
    
    AtmoOccitanieDataCurrent.PM10.features = result.PM10;
    AtmoOccitanieDataCurrent.PM25.features = result.PM25;
    
if(user_selected_value == "PM10"){
    AtmoOccitanieStationsMap.clearLayers();
    AtmoOccitanieStationsMap.addData(AtmoOccitanieDataCurrent.PM10).bringToFront();
    };

     if(user_selected_value == "PM25"){
    AtmoOccitanieStationsMap.clearLayers();
    AtmoOccitanieStationsMap.addData(AtmoOccitanieDataCurrent.PM25).bringToFront();
    };

}); 
}

function retrieveDataLuchtmeetnet() {
    
var dateStrings = LuchtmeetnetdateFormater(new Date());

var URLPM10 = "https://api.luchtmeetnet.nl/open_api/measurements?start="+ dateStrings[1] +"&end="+ dateStrings[0] + "&station_number=&formula=PM10";

var URLPM25 = "https://api.luchtmeetnet.nl/open_api/measurements?start="+ dateStrings[1] +"&end="+ dateStrings[0] + "&station_number=&formula=PM25";

Luchtmeetnetdata.getData(URLPM10)
    .then(function (result) {

   LuchtmeetnetData.PM10.features = result;

if(user_selected_value == "PM10"){
    LuchtmeetnetStationsMap.clearLayers();
    LuchtmeetnetStationsMap.addData(LuchtmeetnetData.PM10).bringToFront();
    }
});

Luchtmeetnetdata.getData(URLPM25).then(function (result) {
 LuchtmeetnetData.PM25.features = result;  
     if(user_selected_value == "PM25"){
    LuchtmeetnetStationsMap.clearLayers();
    LuchtmeetnetStationsMap.addData(LuchtmeetnetData.PM25).bringToFront();
    }

}); 
}

function retrieveDataEU(option) {

var dateString = EUdateFormater(new Date());
var URLPM10 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM10&dt="+dateString;
var URLPM25 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM25&dt="+dateString;   
//      
//         var URLPM10 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM10&dt="+dateString;
//    var URLPM25 = "https://discomap.eea.europa.eu/Map/UTDViewer/dataService/Hourly?polu=PM25&dt="+dateString;  
//        

EUdata.getData(URLPM10).then(function (result) {

    EUofficialData.PM10.features = result;

    if(user_selected_value == "PM10" && logger.eea.display == true){
    
    EUStationsMap.clearLayers();
    EUStationsMap.addData(EUofficialData.PM10).bringToFront();
    }

        });

EUdata.getData(URLPM25).then(function (result) {
    EUofficialData.PM25.features = result;  

    if(user_selected_value == "PM25" && logger.eea.display == true){
    EUStationsMap.clearLayers();
    EUStationsMap.addData(EUofficialData.PM25).bringToFront();
    }

        });
}    







function LuchtmeetnetdateFormater(date) {
    
const dateFormater = timeFormat("%Y-%m-%dT%H:%M:%SZ");

    var result =[];
    result.push(dateFormater(date));
    
    result.push(dateFormater(date.setHours(date.getHours()-12)));

return result;
}

function EUdateFormater(date) {

    date.setDate(date.getDate()); // can adjust the day by substracting

//    var result = date.getUTCFullYear().toString() + pad(date.getUTCMonth(),2,true) + pad(date.getUTCDate(),2,false) +pad(date.getUTCHours(),2, false)+pad(date.getUTCMinutes(),2,false) + pad(date.getUTCSeconds(),2,false);

    var result = date.getUTCFullYear().toString() + pad(date.getUTCMonth(),2,true) + pad(date.getUTCDate(),2,false) +pad(date.getHours()-2,2, false)+"00" + "00";  //last full hour
    
//    date.getUTCHours
//    date.getHours
    
//    moins 2 heures

return result;
}

function UBAdateFormater(date,date2,option) {

    date.setDate(date.getDate()); // can adjust the day by substracting
    date2.setDate(date2.getDate()-4);
        
    
    if (option == 0){
    
   var result = "date_from="+date.getUTCFullYear().toString()+"-"+pad(date.getUTCMonth(),2,true)+"-"+pad(date.getUTCDate(),2,false)+"&time_from="+(date.getUTCHours()-6)+ "&date_to="+date.getUTCFullYear().toString()+"-"+pad(date.getUTCMonth(),2,true)+"-"+pad(date.getUTCDate(),2,false)+"&time_to="+ date.getUTCHours();
    };
    
    if (option == 1){
    
   var result = "date_from="+date2.getUTCFullYear().toString()+"-"+pad(date2.getUTCMonth(),2,true)+"-"+pad(date2.getUTCDate(),2,false)+"&time_from="+(date.getUTCHours())+ "&date_to="+date.getUTCFullYear().toString()+"-"+pad(date.getUTCMonth(),2,true)+"-"+pad(date.getUTCDate(),2,false)+"&time_to="+ date.getUTCHours();
    };
       
    
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
//	if (! d3.select("#cb_labs").property("checked")) new_path += "nolabs&";
	new_path = new_path.slice(0,-1) + location.hash;
	console.log(new_path);
	history.pushState(stateObj,document.title,new_path);
}

//function switchLabLayer() {
//	if (d3.select("#cb_labs").property("checked")) {
//		map.getPane('markerPane').style.visibility = "visible";
//	} else {
//		map.getPane('markerPane').style.visibility = "hidden";
//	}
//	setQueryString();
//}

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
        UBAStationsMap.clearLayers();
        UBAStationsMap.addData(UBAofficialData.PM10).bringToFront(); 
        LuchtmeetnetStationsMap.clearLayers();
        LuchtmeetnetStationsMap.addData(EUofficialData.PM10).bringToFront();
        AtmoAURAStationsMap.clearLayers();
        AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM10).bringToFront();
        AtmoPACAStationsMap.clearLayers();
        AtmoPACAStationsMap.addData(AtmoPACADataCurrent.PM10).bringToFront();
        UBAStationsMap.clearLayers();
        UBAStationsMap.addData(UBAofficialData.PM10).bringToFront();
        };
    
     if(val == "PM25"){
        EUStationsMap.clearLayers();
        EUStationsMap.addData(EUofficialData.PM25).bringToFront();
        LuchtmeetnetStationsMap.clearLayers();
        LuchtmeetnetStationsMap.addData(EUofficialData.PM25).bringToFront();
        AtmoAURAStationsMap.clearLayers();
        AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM25).bringToFront();
        AtmoPACAStationsMap.clearLayers();
        AtmoPACAStationsMap.addData(AtmoPACADataCurrent.PM25).bringToFront();
        AtmoOccitanieStationsMap.clearLayers();
        AtmoOccitanieStationsMap.addData(AtmoOccitanieDataCurrent.PM25).bringToFront(); 
        UBAStationsMap.clearLayers();
        UBAStationsMap.addData(UBAofficialData.PM25).bringToFront();   
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
    
    
    if (user_selected_value == "PM10"){d3.selectAll('input[name="uba"]')._groups[0].forEach(function(e){e.disabled = false})};
    
    if (user_selected_value == "PM25"){d3.selectAll('input[name="uba"]')._groups[0].forEach(function(e){e.disabled = true})};
      
}

function getCurrentAURA(data){
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
//        current.push(filter[0])
        
    });
    
 return current   
}

function getCurrentPACA(data){
    
    var dataOut = {"PM10":[],"PM25":[]};
    
//    "2021/04/21 00:59"
    
    var parseDate = timeParse("%Y/%m/%d %H:%M");
    var listeSitesPM10 = [];
    var listeSitesPM25 = [];
    
    
    data.PM10.features.forEach(function(e){
        if(!listeSitesPM10.includes(e.properties.code_station)){        
                listeSitesPM10.push(e.properties.code_station)}     
        });
    
    listeSitesPM10.forEach(function(e){
        var filter = data.PM10.features.filter(o => o.properties.code_station == e)
        
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
//      current.push(filter[filter.length-1])
        dataOut.PM10.push(filter[filter.length-1])        
    });
    

        data.PM25.features.forEach(function(e){
        if(!listeSitesPM25.includes(e.properties.code_station)){        
                listeSitesPM25.push(e.properties.code_station)}     
        });
    
    listeSitesPM25.forEach(function(e){
        var filter = data.PM25.features.filter(o => o.properties.code_station == e)
        
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
//      current.push(filter[filter.length-1])
        dataOut.PM25.push(filter[filter.length-1])        
    });
     
    
 return dataOut   
}

function getCurrentOccitanie(data){
    
    var dataOut = {"PM10":[],"PM25":[]};
    
//    "2021/04/21 00:59"
    
    var parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");
    var listeSitesPM10 = [];
    var listeSitesPM25 = [];
    
    
    data.PM10.features.forEach(function(e){
        if(!listeSitesPM10.includes(e.properties.code_station)){        
                listeSitesPM10.push(e.properties.code_station)}     
        });
    
    listeSitesPM10.forEach(function(e){
        var filter = data.PM10.features.filter(o => o.properties.code_station == e)
        
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
//      current.push(filter[filter.length-1])
      //  dataOut.PM10.push(filter[0])     
        dataOut.PM10.push(filter[filter.length-1]);
        
//        console.log(filter[filter.length-1]);
//        console.log(filter[0]);
        
//        REVOIR PREMIER OU DERNIER
        
    });
    

        data.PM25.features.forEach(function(e){
        if(!listeSitesPM25.includes(e.properties.code_station)){        
                listeSitesPM25.push(e.properties.code_station)}     
        });
    
    listeSitesPM25.forEach(function(e){
        var filter = data.PM25.features.filter(o => o.properties.code_station == e)
        
        filter.sort(function(a,b){
          return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
//      current.push(filter[filter.length-1])
        dataOut.PM25.push(filter[filter.length-1]);      
    });
     
    
 return dataOut   
}

function graphicBuilder(data,selector){
    
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
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");       
               
    x.domain(extent(data, function(d) { return d.date; }));
    y.domain([0, max(data, function(d) {return d.value;})]);
               
      if (user_selected_value == "PM10"){
         
         if (max(data, (i) => i.value) >= 50){
                
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
             
         
         if (max(data, (i) => i.value) >= 25){

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
    
    //FORCE UPDATE THE GRADIENT

    d3.selectAll("#line-gradient").remove();

           
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
     .data([data])
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
    
}




function graphicBuilderWindow(data,selector){

    
 var valueline = line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })
    .defined(((d) => d.value != -1));
              
    var margin = {top: 20, right: 10, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var x = scaleTime().range([0, width]);
    var y = scaleLinear().range([height, 0]);     
   
    
var newWindow = window.open('');    

var svg = d3.select(newWindow.document.body).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");       
               
    x.domain(extent(data, function(d) { return d.date; }));
    y.domain([0, max(data, function(d) {return d.value;})]);
               
      if (user_selected_value == "PM10"){
         
         if (max(data, (i) => i.value) >= 50){
                
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
             
         
         if (max(data, (i) => i.value) >= 25){

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
                
    //FORCE UPDATE THE GRADIENT

    d3.selectAll("#line-gradient").remove();          
           
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
     .data([data])
      .attr("class", "line")  
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)" )
  //.style("stroke", "black")
      .attr("d", valueline);
  
    svg2.append("g")  
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
       
}

//d3.select("#"+htmlid)

function switcher(key,geojson){
    
    console.log("SWITCH");
    console.log(key);   
    
                console.log(logger[key].data);
            console.log(geojson);
    
    
       	if (d3.select("#"+key).property("checked")) {        
            logger[key].display = true;
        
            if (logger[key].data == "nodata" && d3.selectAll('input[type="radio"][name="'+key+'"]:checked').node() != null){
            var option = d3.selectAll('input[type="radio"][name="'+key+'"]:checked').node().value
            logger[key].data = option;
                switch (key) {
                  case "sc":
                    retrieveData(option);
                    break;
                  case "eea":

                    break;
                  case "uba":
                    retrieveDataUBA(option);
                    break;
                  case "aura":

                    break;
                  case "paca":

                    break;
                  case "occi":

                    break;
                  case "lucht":

                    break;
                }            
            }else {
                switch (key) {
                  case "sc":
                    geojson.addData(SC_PM).bringToBack();
                    break;
                  case "eea":

                    break;
                  case "uba":   
//                    ONLY PM10    
                    geojson.addData(UBAofficialData.PM10).bringToFront();
                    break;
                  case "aura":

                    break;
                  case "paca":

                    break;
                  case "occi":

                    break;
                  case "lucht":

                    break;
                };    
            } 
	} else {
            geojson.clearLayers();
            logger[key].display = false;
	}      
}


function switcher2(key,option,geojson){
    
    console.log("SWITCH2");
    console.log(key); 
    console.log(option);
    
    logger[key].data = option;
    
    switch (key) {
              case "sc":
                retrieveData(option);
                break;
              case "eea":
                
                break;
              case "uba":
                retrieveDataUBA(option);
                break;
              case "aura":
                
                break;
              case "paca":
                
                break;
              case "occi":
                
                break;
              case "lucht":
                
                break;
            };   
}











//
//
//
//
//function switchSC(){
//   	if (d3.select("#sc").property("checked")) {        
//   
//        if (logger.sc.display == false && logger.sc.data == "nodata"){
//
////        if (SCSensorsMap.getLayers().length == 0 ){
//            
////            VIDER LES FEATURES ? ET TESTER?
//            
//                            SCSensorsMap.addData(SC_PM).bringToBack();
//
//            
//            var selector = d3.selectAll('input[type="radio"][name="sc"]:checked').node().value;
//            console.log(selector);
//        
//        
//        
//        
//        
//        
//        
//        }else{
////            reloadMap(user_selected_value)  
//
//        } 
//	} else {
//            SCSensorsMap.clearLayers();
//            logger.sc.display == false;
//	}    
//}
//
//
//
//
//
//
//
//
//function switchEEA(){
//   	if (d3.select("#eea").property("checked")) {
//        
//	} else {
//        
//	}   
//}
//
//function switchUBA(){
//   	if (d3.select("#uba").property("checked")) {
//        
//	} else {
//        
//	}     
//    
//}
//
//function switchAURA(){
//   	if (d3.select("#aura").property("checked")) {
//        
//	} else {
//        
//	}     
//    
//}
//
//function switchPACA(){
//    if (d3.select("#paca").property("checked")) {
//        
//	} else {
//        
//	}     
//    
//}
//
//function switchOccitanie(){
//    if (d3.select("#occi").property("checked")) {
//        
//	} else {
//        
//	}     
//    
//}
//
//function switchLuchtmeetnet(){
//   	if (d3.select("#lucht").property("checked")) {
//        
//	} else {
//        
//	}  
//    
//}