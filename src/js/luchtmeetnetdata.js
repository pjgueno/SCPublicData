import {csvParse} from 'd3-dsv';
import {timeParse} from 'd3-time-format';
import 'whatwg-fetch'
import * as netherlands from './netherlands_stations.js';

function getCurrent(data){
    var current = [];
    var parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");
    var listeSites = [];
    data.forEach(function(e){
        if(!listeSites.includes(e.station_number)){        
                listeSites.push(e.station_number)}     
        });
    
    listeSites.forEach(function(e){
        var filter = data.filter(o => o.station_number == e)
        
        filter.sort(function(a,b){
          return new Date(parseDate(a.timestamp_measured)) - new Date(parseDate(b.timestamp_measured));
        });
        current.push(filter[0])
        
    });
    
 return [current,listeSites]
}



let Luchtmeetnetdata = {
    
    getData: async function (URL) {
        
    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
            
        console.log('successful retrieved data');
        
    var lastData = getCurrent(json.data);

//    var dataOut = netherlands.features.filter(o => lastData[1].includes(o.properties.id));
        
    var dataOut = netherlands.features.filter(function(o){
        if(lastData[1].includes(o.properties.id)){

        var object = lastData[0].find(e => e.station_number === o.properties.id);
        
        o.properties.formula = object.formula;
        o.properties.value = object.value;
        o.properties.timestamp_measured = object.timestamp_measured;
            
        return o     
        }
    });
    
   return dataOut;
        
 })
}
}

export default Luchtmeetnetdata
