mapboxgl.accessToken = 'pk.eyJ1Ijoic29yb3VzaHlzZiIsImEiOiJjazg5ZXdkZHAwNjhiM2RxbjNsZWx6cjhyIn0.-yR705SRfIWdfIp8CpT1cA';

var map = new mapboxgl.Map({
    container: 'map', // container element id
    style: 'mapbox://styles/soroushysf/ck89ey5b100vk1ho3dwjky9qz',
    center: [-87.6298, 41.8781], // initial map center in [lon, lat]
    zoom: 12
});

map.on('load', function() {
    map.addLayer({
        'id': 'collisions',
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
    document.getElementById('slider').addEventListener('input', function(e) {
        var hour = parseInt(e.target.value);
        // update the map
        map.setFilter('collisions', ['==', ['number', ['get', 'Hour']], hour]);

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
        map.setFilter('collisions', ['all', filterDay]);
    });
});
