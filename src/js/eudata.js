import {csvParse} from 'd3-dsv';
import 'whatwg-fetch'

let EUdata = {
    
    getData: async function (URL) {
    
    return fetch(URL)
			.then((resp) => resp.text())
			.then((data) => {
            
				console.log('successful retrieved data');
                
        var mapper = csvParse(data).map(function(obj){
        var dataEUfeature = { "type": "Feature", "properties": { "Code": "", "Name": "", "Location": "", "Value": "", "Lon":"" , "Lat": "", "AreaClassification": "", "samplePointID":"", "StationClassification": "","dateBegin":"","dateEnd":"","type":""}, "geometry": { "type": "Point", "coordinates": []}};
        
        var translated = L.Projection.SphericalMercator.unproject(new L.Point(obj.LONGITUDE, obj.LATITUDE));

        dataEUfeature.geometry.coordinates[0] = parseFloat(translated.lng.toFixed(4));
        dataEUfeature.geometry.coordinates[1] = parseFloat(translated.lat.toFixed(4));
        dataEUfeature.properties.Lon = (translated.lng).toString();
        dataEUfeature.properties.Lat = (translated.lat).toString();
        dataEUfeature.properties.AreaClassification = obj.AREACLASSIFICATION;
        dataEUfeature.properties.StationClassification = obj.STATIONCLASSIFICATION;
        dataEUfeature.properties.Code = obj.STATIONCODE;
        dataEUfeature.properties.Name = obj.STATIONNAME;
        dataEUfeature.properties.Location = obj.MUNICIPALITY;
        dataEUfeature.properties.samplePointID = obj.SAMPLINGPOINT_LOCALID.replaceAll(".", "xxx").replaceAll(":","yyy");
        dataEUfeature.properties.Value = parseFloat(obj.VALUE_NUMERIC);
        dataEUfeature.properties.dateBegin = obj.DATETIME_BEGIN;
        dataEUfeature.properties.dateEnd = obj.DATETIME_END;
        dataEUfeature.properties.type = obj.PROPERTY;
        
        return dataEUfeature;
        })
        
        return mapper;
        
 })
}
}

export default EUdata
