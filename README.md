# Real-Time Device Tracking App

## Overview

This project is a real-time multi-user device tracking application built using Node.js, Express, Socket.IO, and Leaflet. It allows multiple users to share their live geographic location and visualize all connected users on an interactive map in real time.

The system is built using WebSockets for continuous bidirectional communication between the server and clients.

---

## Tech Stack

* Node.js
* Express.js
* Socket.IO
* Leaflet.js
* OpenStreetMap
* Browser Geolocation API

---

## Project Structure

```
REAL-TIME-DATA-TRACKING-APP/
├── node_modules/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── views/
│   └── index.ejs
├── .gitignore
├── app.js
├── LICENSE
├── package-lock.json
└── package.json
```

---

## How It Works

1. User opens the application in the browser
2. Browser requests permission for geolocation
3. Device continuously sends latitude and longitude to the server
4. Server broadcasts location data to all connected clients using Socket.IO
5. All clients update markers on the map in real time
6. When a user disconnects, their marker is removed

---

## Backend (app.js)

### Express Server

The backend uses Express to serve static files and render the main page.

```js
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
```

### HTTP + Socket.IO Server

Socket.IO is attached to an HTTP server for real-time communication.

```js
const server = http.createServer(app);
const io = socketIo(server);
```

### Connection Handling

Each connected user is assigned a unique socket ID.

```js
io.on('connection', (socket) => {
    console.log('user connected');
```

### Location Broadcast

When a user sends location data, it is broadcast to all clients.

```js
socket.on('send-location', (data) => {
    io.emit('receive-location', { id: socket.id, ...data });
});
```

### Disconnection Handling

When a user disconnects, all clients remove their marker.

```js
socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
});
```

---

## Frontend (script.js)

### Socket Connection

```js
const socket = io();
```

### Geolocation Tracking

The browser continuously tracks device location.

```js
navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit('send-location', { latitude, longitude });
});
```

### Map Initialization

Leaflet is used to render the map.

```js
const map = L.map('map').setView([0, 0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);
```

### Marker Management

Each user is tracked using a unique marker.

```js
const markers = {};
```

### Updating Locations

Markers are updated in real time.

```js
socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
```

### Remove Disconnected Users

```js
socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
```

---

## Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run the application

Using Node.js:

```bash
node app.js
```

Or using nodemon (recommended for development):

```bash
npx nodemon app.js
```

### 3. Open in browser

```
http://localhost:3000
```

---

## Screenshots

Add your project screenshot here after uploading it to the repository.

Example:

```md
## Live Preview

![Real-Time Tracking App](./public/assets/demo.png)
```

---

## Features

* Real-time device tracking
* Multi-user support
* Live map updates
* Automatic user join and leave handling
* Lightweight WebSocket-based communication

---



## License

This project is licensed under the MIT License.

---

## Author

Built as a learning project to understand real-time systems, WebSockets, and geolocation-based applications.Further i will try to make a system like uber
