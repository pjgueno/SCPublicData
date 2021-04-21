import 'whatwg-fetch'

let UBAdata = {
    
    getData: async function (URL) {
    
    var UBAStations = {};
    
    fetch("https://www.umweltbundesamt.de/api/air_data/v2/stations/json")
        .then((resp) => resp.json())
        .then((json) => {
        UBAStations = json.data; 
    });
        
           
    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
            
				console.log('successful retrieved data');
        
        
        
        var mapper = [];
        
        
        for (var key in json.data) {
        
          if (json.data.hasOwnProperty(key)) {
              
            var dataUBAfeature = { "type": "Feature", "properties": { "id": "", "code": "", "name": "", "value": ""}, "geometry": { "type": "Point", "coordinates": []}};
              
              
            dataEUfeature.geometry.coordinates[0] = parseFloat(UBAStations[key][7]);
            dataEUfeature.geometry.coordinates[1] = parseFloat(UBAStations[key][8]); 
            dataUBAfeature.properties.value = json.data[key][json.request.datetime_to].value;
            dataUBAfeature.properties.id = UBAStations[key][0];
            dataUBAfeature.properties.code = UBAStations[key][1];
            dataUBAfeature.properties.name = UBAStations[key][2];
              
            mapper.push(dataUBAfeature);
          }
        };
        
        console.log(mapper);
        
        return mapper;
        
 })
}
}

export default UBAdata
