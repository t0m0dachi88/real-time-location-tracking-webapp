const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>
    {
        const {latitude, longitude} = position.coords;
        socket.emit('send-location', {
    latitude: latitude + Math.random() * 0.001,//added them so that even ifts same location it changes the cordinates slightly so that we can test
    longitude: longitude + Math.random() * 0.001
});
    }, (error) => {        
        console.error('Error getting location:', error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 30000
    }
    )
}

const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers = {};

socket.on('receive-location', (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 10);
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on('user-disconnected', (id) => {
    console.log('A user disconnected');
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});