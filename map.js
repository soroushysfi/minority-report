mapboxgl.accessToken = 'pk.eyJ1Ijoic29yb3VzaHlzZiIsImEiOiJjazg5ZXdkZHAwNjhiM2RxbjNsZWx6cjhyIn0.-yR705SRfIWdfIp8CpT1cA';
let categories = [];
beatsData.forEach(beat => {
    categories.push(beat.crimes);
})
categories = categories.sort();
let dist = categories[categories.length - 1]/5;

var map = new mapboxgl.Map({
    container: 'map', // container element id
    style: 'mapbox://styles/soroushysf/ck89ey5b100vk1ho3dwjky9qz',
    center: [-87.7098, 41.8381], // initial map center in [lon, lat]
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
                '#F2F12D',
                dist,
                '#EED322',
                2*dist,
                '#E6B71E',
                3*dist,
                '#DA9C20',
                4*dist,
                '#CA8323',
                5*dist,
                '#B86B25',
                6*dist,
                '#A25626'
            ],
            'fill-opacity': 0.6
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
            'line-color': '#67000d',
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
            'icon-image': ['concat', ['get', 'icon'], '-15'],
            'icon-size': 3,
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
        },
        'paint': {
            'icon-color': "#c05e58"
        },
        source: {
            type: 'geojson',
            data: './chicago-crime-geo.geojson'
        },
    });
    map.setFilter('crimes', ['==', ['number', ['get', 'Hour']], 12]);

    document.getElementById('slider').addEventListener('input', function(e) {
        var hour = parseInt(e.target.value);
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
        map.setFilter('crimes', ['all', filterDay]);
    });
});
