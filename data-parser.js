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
                "Injured": Math.floor(Math.random() * 3) ,
                "Killed":  Math.floor(Math.random() * 4),
                "Casualty":  Math.floor(Math.random() * 5),
                'arrest': row['Arrest'],
                'title': row['Primary Type'],
                'icon': (row['Primary Type'] in icons) ? icons[row['Primary Type']]: "information",
                "Hour": newDate.getHours(),
                "Day": weekDay[newDate.getDay()],
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row.Longitude, row.Latitude]
            }
        }
    });
    chicagoCrimeGEOJSON.features = filteredData.slice(0, 10000);

    let data = JSON.stringify(chicagoCrimeGEOJSON);
    fs.writeFileSync('chicago-crime-geo.geojson', data);

}
