mapboxgl.accessToken = 'pk.eyJ1Ijoic29yb3VzaHlzZiIsImEiOiJjazg5ZXdkZHAwNjhiM2RxbjNsZWx6cjhyIn0.-yR705SRfIWdfIp8CpT1cA';
let categories = [];
beatsData.forEach(beat => {
    categories.push(beat.crimes);
})
categories = categories.sort();
let dist = Math.round(categories[categories.length - 1]/5);
let legendList = [
    {label: `0`+' - '+dist, color:"#ffffd4" },
    {label: dist+1+' - '+2*dist, color:"#fee391" },
    {label: 2*dist+1+' - '+3*dist, color:"#fec44f" },
    {label: 3*dist+1+' - '+4*dist, color:"#fe9929" },
    {label: 4*dist+1+' - '+5*dist, color:"#ec7014" },
    {label: 5*dist+1+' - '+6*dist, color:"#cc4c02" },
    {label: 6*dist+1+' - '+ 7*dist, color:"#8c2d04" }
];

let containerLeft = document.getElementById('left');
let containerRight = document.getElementById('right');

legendList.forEach((legend, i) => {

    {
        let boxContainer = document.createElement("DIV");
        let box = document.createElement("DIV");
        let label = document.createElement("SPAN");

        label.innerHTML = legend.label;
        box.className = "box";
        box.style.backgroundColor = legend.color;
        label.style["font-size"] = "small";

        boxContainer.appendChild(box);
        boxContainer.appendChild(label);
        if(i <= 3) {
            containerLeft.appendChild(boxContainer);
        } else {
            containerRight.appendChild(boxContainer);
        }


    }
})
var map = new mapboxgl.Map({
    container: 'map', // container element id
    style: 'mapbox://styles/soroushysf/ck89ey5b100vk1ho3dwjky9qz',
    center: [-87.6498, 41.8381], // initial map center in [lon, lat]
    zoom: 10
});

map.on('load', function() {
    map.addLayer({
        'id': 'police_beat_choropleth',
        'type': 'fill',
        'layout': {},
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'crime_num'],
                0,
                '#ffffd4',
                dist,
                '#fee391',
                2*dist,
                '#fec44f',
                3*dist,
                '#fe9929',
                4*dist,
                '#ec7014',
                5*dist,
                '#cc4c02',
                6*dist,
                '#8c2d04'
            ],
            'fill-opacity': 0.75
        },
        source: {
            type: 'geojson',
            data: './Chicago_Boundaries.geojson'
        }
    });
    map.addLayer({
        'id': 'police_beat',
        'type': 'line',
        'layout': {},
        'paint': {
            'line-color': '#8b0000',
        },
        source: {
            type: 'geojson',
            data: './Chicago_Boundaries.geojson'
        }
    });
    map.addLayer({
        'id': 'crimes',
        'type': 'symbol',
        'layout': {
            'icon-image': ['get', 'icon'],
            'icon-size': 1,
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
            'icon-allow-overlap': true
        },
        'paint': {
            'icon-color': "#c05e58"
        },
        source: {
            type: 'geojson',
            data: './chicago-crime-geo.geojson'
        },
    });
    let hour_g = 12, filterHour = ['==', ['number', ['get', 'Hour']], 12];
    map.setFilter('crimes', filterHour);

    document.getElementById('slider').addEventListener('input', function(e) {
        var hour = parseInt(e.target.value);
        hour_g = hour;
        // update the map
        map.setFilter('crimes', ['==', ['number', ['get', 'Hour']], hour]);

        // converting 0-23 hour to AMPM format
        var ampm = hour >= 12 ? 'PM' : 'AM';
        var hour12 = hour % 12 ? hour % 12 : 12;

        // update text in the UI
        document.getElementById('active-hour').innerText = hour12 + ampm;
    });
    document.getElementById('filters').addEventListener('change', function(e) {
        var day = e.target.value;
        // update the map filter
        if (day === 'all') {
            filterDay = ['!=', ['string', ['get', 'Day']], 'placeholder'];
        } else if (day === 'weekday') {
            filterDay = ['match', ['get', 'Day'], ['Sat', 'Sun'], false, true];
        } else if (day === 'weekend') {
            filterDay = ['match', ['get', 'Day'], ['Sat', 'Sun'], true, false];
        } else {
            console.log('error');
        }
        filterHour = ['==', ['number', ['get', 'Hour']], hour_g];
        map.setFilter('crimes', ['all', filterDay, filterHour]);
    });
    // map.setFilter('crimes', ['match', ['get', 'icon'], ['baseball-true'], true, false]);

    let pElements = document.getElementsByClassName("filter-button");
    let pFunction = function(e) {
        const filterText = e.toElement.children[0].textContent;
        const filterIcons = ['match', ['get', 'icon'], [filterText+'-true', filterText+'-false'], true, false];
        filterHour = ['==', ['number', ['get', 'Hour']], hour_g]
        map.setFilter('crimes', ['all', filterHour, filterIcons]);
    };
    for (let i = 0; i < pElements.length; i++) {
        pElements[i].addEventListener('click', pFunction, false);
    }
});

