# Sensor.Community public data aggregator
Visualize recent sensor data on a world map for [Sensor.Community](https://sensor.community) and for differents official measurements:
* EEA
* Luchtmeetnet
* Atmo AURA
* Atmo Sud
* Atmo Occitanie
* UmweltBundesamt
 
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