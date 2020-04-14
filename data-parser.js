const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');
let dataFile = [], filteredData = [];


fs.createReadStream('./Chicago_Crimes_2017.csv')
    .pipe(csv())
    .on('data', (row) => {
            dataFile.push(row);
    })
    .on('end', () => {
        parsingData(dataFile);
        console.log('CSV file successfully processed');
    });
function parsingData (dataFile) {
    let chicagoCrimeGEOJSON = {"type": "FeatureCollection", "features": []};
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const icons = {
        "BURGLARY": "pitch",
        "ROBBERY": "pitch",
        "THEFT": "baseball",
        "CRIMINAL DAMAGE": "cross",
        "NARCOTICS": "garden",
        "OTHER OFFENSE": "triangle",
        "DECEPTIVE PRACTICE": "square",
        "BATTERY": "star",
        "WEAPONS VIOLATION": "fire-station-JP",
        "ASSAULT": "police",
        "CRIMINAL TRESPASS": "roadblock",
        "PUBLIC PEACE VIOLATION": "parking",
        "CRIM SEXUAL ASSAULT": "toilet",
        "MOTOR VEHICLE THEFT": "scooter",
        "OFFENSE INVOLVING CHILDREN": "playground",
        "LIQUOR LAW VIOLATION": "alcohol-shop",
        "HOMICIDE": "danger"
    }

    let newDate = '';
    filteredData = dataFile.filter(row => row.Latitude != null).map( row =>
    {
        newDate = moment(row["Date"], "MM/DD/YYYY hh:mm:ss A").toDate();
        return{
            "type": "Feature",
            "properties": {
                'beat_num': row['Beat'],
                'arrest': row['Arrest'],
                'title': row['Primary Type'],
                'icon': ((row['Primary Type'] in icons) ? icons[row['Primary Type']]: "triangle")+'-'+String(row['Arrest']),
                "Hour": newDate.getHours(),
                "Day": weekDay[newDate.getDay()]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row.Longitude, row.Latitude]
            }
        }
    });
    // chicagoCrimeGEOJSON.features = filteredData.sort(() => Math.random() - 0.5).slice(0, 100000);
    chicagoCrimeGEOJSON.features = filteredData;

    let beats = [], beatsJson = [];
    chicagoCrimeGEOJSON.features.forEach(crime => {
       if(beats.indexOf(crime.properties.beat_num) === -1){
           beats.push(crime.properties.beat_num);
           beatsJson.push({beat_num: crime.properties.beat_num, crimes: 1});
       } else {
           beatsJson.forEach(beat => {
               if(beat.beat_num === crime.properties.beat_num) {
                   beat.crimes += 1;
               }
           })
       }
    });
    fs.readFile('Chicago_Boundaries.geojson', function(err, data) {
       let newData = JSON.parse(data);
        newData.features.forEach(row => {
            beatsJson.forEach(beat => {
                if(beat.beat_num === row.properties.beat_num){
                    row.properties.crime_num =  beat.crimes;
                }
            })
        })
        let beatsFile = 'beatsData = '+JSON.stringify(beatsJson);
        fs.writeFileSync('Chicago_Boundaries.geojson', JSON.stringify(newData));
        fs.writeFileSync('chicago-crime-geo.geojson', JSON.stringify(chicagoCrimeGEOJSON));
        fs.writeFileSync('chicago-beats.js', beatsFile);
    })
    // chicagoCrimeGEOJSON.features = filteredData;


}
