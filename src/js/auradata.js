import {csvParse} from 'd3-dsv';
import 'whatwg-fetch'

let AURAdata = {
    
    getData: async function (URL) {
         
    console.log(URL);
    
    var dataOut;
    
    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
            
        console.log('successful retrieved data');
        
        console.log(json)
                
        dataOut = json.data.map(function(obj){
        var dataAURAfeature = { "type": "Feature", "properties": {"mesure_id":"", "site_id": "", "label": "", "label_commune": "", "valeur": "", "lon":"" , "lat": "", "typologie": "","influence":"","date":"","label_court_polluant":""}, "geometry": { "type": "Point", "coordinates": []}};

        dataAURAfeature.properties.mesure_id = obj.mesure_id
        dataAURAfeature.properties.site_id = obj.site_id
        dataAURAfeature.properties.valeur = obj.valeur
        dataAURAfeature.properties.date = obj.date
        dataAURAfeature.properties.label_court_polluant = obj.label_court_polluant
        
        return dataAURAfeature;
        })
        
        var listeSites = [];
        
        dataOut.forEach(function(e){
            
            if(!listeSites.includes(e.properties.site_id)){
                
                listeSites.push(e.properties.site_id)
                
            }     
        });
        
        console.log(listeSites);
        
       var listeSitesTexte="";
        
         listeSites.forEach(function(e,i){
            
            if(i!=(listeSites.length-1)){
               
               listeSitesTexte += e +",";
               
               }else{
               
               listeSitesTexte += e;
         }
        });
     
           console.log(listeSitesTexte);

        return fetch("http://api.atmo-aura.fr/api/v1/sites?api_token=1251e9082cde33bf43df042595c0583c&format=geojson&sites=" + listeSitesTexte)
                   
                   
                   
                   
                   
//        
//
//         return fetch("http://api.atmo-aura.fr/api/v1/sites?api_token=1251e9082cde33bf43df042595c0583c&format=geojson&sites=ET00697,ET00720,FR07004,FR07022,FR07028,FR07031,FR07034,FR07042,FR07051,FR07052,FR07057,FR07058,FR07059,FR07061,FR15018,FR15038,FR15045,FR15046,FR15048,FR15049,FR15053,FR20013,FR20017,FR20019,FR20029,FR20031,FR20046,FR20047,FR20048,FR20062,FR20065,FR20077,FR27002,FR27007,FR27011,FR29423,FR29424,FR29426,FR29429,FR29439,FR29441,FR33101,FR33102,FR33105,FR33111,FR33113,FR33120,FR33121,FR33122,FR33201,FR33202,FR33203,FR33211,FR33212,FR33220,FR33232,FR33236,FR33244,FR33245,FR33302,FR33305,FR36001,FR36002,FR36019,FR36021,FR36032,FR47101")
//        
        
        
 })
.then((resp)=> resp.json())
.then((json) => {
        
        console.log(json);
        console.log(dataOut);
        
        dataOut.forEach(function(obj){
            
            var id = obj.properties.site_id;
            
//            console.log(id);
            
            var filtered = json.features.filter(e => e.properties.id == id);
           // console.log(filtered);
            
//            
            obj.properties.lon = filtered[0].geometry.coordinates[0]
            obj.properties.lat = filtered[0].geometry.coordinates[1]
            obj.geometry.coordinates[0] = filtered[0].geometry.coordinates[0]
            obj.geometry.coordinates[1] = filtered[0].geometry.coordinates[1]
            obj.properties.label = filtered[0].properties.label
            obj.properties.label_commune = filtered[0].properties.label_commune
            obj.properties.typologie = filtered[0].properties.typologie
            obj.properties.influence = filtered[0].properties.influence
        })
        return dataOut;
    })
}
}

export default AURAdata
