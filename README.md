# Sensor.Community public data aggregator
Visualize recent sensor data on a world map for [Sensor.Community](https://sensor.community) and for differents official measurements:
* EEA
* RIVM
* Atmo
 
# Map application
The implementation makes use of various frameworks and is on [ECMA 6](https://developer.mozilla.org/de/docs/Web/JavaScript) language level. 

Used frameworks are:
* [leaflet](http://leafletjs.com/) (mapping framework)
* [d3](https://d3js.org/) (visualisation framework)
* [webpack](https://webpack.github.io/) is used for deployment

# How to run
### Installation
Requirements:
* [Node JS](https://nodejs.org/) 10.15.x or higher
* NPM should be version 6.9.x or higher

install all dependencies

```
npm install
```

### Develop
start development server (http://127.0.0.1:8080/)

```
npm start
```

### Publish
build all files needed to run on a webserver, files will be compiled into `dist/`):

```
npm run build
npm run ghpages
```

## URL-Parameter

### Sensor 
valid sensor parameters PM25, PM10, Pressure, Noise, Humidity & Official_AQI_US 
http://127.0.0.1:8080/?sensor=Noise

### Location 

valid parameters zoom level, lat and long 
http://127.0.0.1:8080/#9/48.8123/9.2487

### combine parameters

first start with sensor then location
http://127.0.0.1:8080/?sensor=Noise#9/48.8123/9.2487
