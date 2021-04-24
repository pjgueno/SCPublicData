import 'whatwg-fetch'

let AURAdata = {
    
    getData: async function (URL) {
         
    console.log(URL);
    
    var dataOut;
    
    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
            
        console.log('successful retrieved data');
                        
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
                
       var listeSitesTexte="";
        
         listeSites.forEach(function(e,i){
            
            if(i!=(listeSites.length-1)){
               
               listeSitesTexte += e +",";
               
               }else{
               
               listeSitesTexte += e;
         }
        });
     
        return fetch("http://api.atmo-aura.fr/api/v1/sites?api_token=1251e9082cde33bf43df042595c0583c&format=geojson&sites=" + listeSitesTexte)
                   
        
 })
.then((resp)=> resp.json())
.then((json) => {
        
        
        dataOut.forEach(function(obj){
            
            var id = obj.properties.site_id;
                        
            var filtered = json.features.filter(e => e.properties.id == id);
            
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
