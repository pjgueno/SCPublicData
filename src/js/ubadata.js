import 'whatwg-fetch'
import {timeParse,timeFormat} from 'd3-time-format';


let UBAdata = {
    
    getData: async function (URL) {
    
//    var UBAStations = {};
        
//        fetch("https://www.umweltbundesamt.de/api/air_data/v2/stations/json")

    var parseDate = timeParse("%Y-%m-%d %H:%M:%S");
    var dateFormater = timeFormat("%Y-%m-%d %H:%M:%S");
 
   return fetch("https://maps.sensor.community/uba-api/air_data/v2/stations/json")
        .then((resp) => resp.json())
        .then((json) => json.data)
        .then((stations)=>{
            return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {  
				console.log('successful retrieved data');    
                var mapper = [];          
                for (var key in json.data) {
                    if (stations.hasOwnProperty(key)) {
                        var dataUBAfeature = { "type": "Feature", "properties": { "id":"", "code": "", "name": "", "value": "", "type1":"", "type2":"", "type3":"", "date":""}, "geometry": { "type": "Point", "coordinates": []}};

                        dataUBAfeature.geometry.coordinates[0] = parseFloat(stations[key][7]);
                        dataUBAfeature.geometry.coordinates[1] = parseFloat(stations[key][8]); 
                        var tabDate = Object.keys(json.data[key]).sort(function(a,b){
                          return new Date(parseDate(a)) - new Date(parseDate(b));
                        });
              
                        dataUBAfeature.properties.value = json.data[key][tabDate[tabDate.length -1]][2];
                        dataUBAfeature.properties.date = json.data[key][tabDate[tabDate.length -1]][3];     
                        dataUBAfeature.properties.id = stations[key][0];
                        dataUBAfeature.properties.code = stations[key][1];
                        dataUBAfeature.properties.name = stations[key][2];
                        dataUBAfeature.properties.type1 = stations[key][14];
                        dataUBAfeature.properties.type2 = stations[key][15];
                        dataUBAfeature.properties.type3 = stations[key][16];
                        mapper.push(dataUBAfeature);
                        }
                };
        
        console.log(mapper);
        return mapper;
        }); 
       
   });       
}    
}

export default UBAdata
