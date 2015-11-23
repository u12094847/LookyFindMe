//Global mapConnection
var mapConn = null;
var friend = null;
var username = null;
var map = null;
var directionsService = null;
var directionsDisplay = null;

function initializeMap(message) {
    friend = message.username;
    username = localStorage.username;
    var friendLongitude = message.long;
    var friendLatitude = message.lat;

    var onSuccess = function (position) {

        var myLatitude = position.coords.latitude;
        var myLongitude = position.coords.longitude;

        initMap(myLatitude, myLongitude, friendLatitude, friendLongitude);
    };

    function onError(error) {
        document.getElementById('findFriendMapViewContainer').innerHTML = 'No Geolocation Support.';
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function initMap(myLatitude, myLongitude, friendLatitude, friendLongitude) {

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    var map = new google.maps.Map(document.getElementById('findFriendMapViewContainer'), {
        zoom: 7,
        center: {lat: myLatitude, lng: myLongitude}
    });

    directionsDisplay.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay, myLatitude, myLongitude, friendLatitude, friendLongitude);

    function showLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        message = {type: "coordinates", username: username, friend: friend, lat: latitude, long: longitude};
        var coordinatesObject = JSON.stringify(message);
        mapConn.send(coordinatesObject);
    }

    function errorHandler(err) {
        if (err.code == 1) {
            alert("Error: Access is denied!");
        }

        else if (err.code == 2) {
            alert("Error: Position is unavailable!");
        }
    }

    if (navigator.geolocation) {
        // timeout at 60 000 milliseconds (60 seconds)
        var options = {timeout: 10000};
        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    } else {
        console.log("Browser does not support geolocation");
    }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, myLatitude, myLongitude, friendLatitude, friendLongitude) {
    directionsService.route({
        origin: {lat: myLatitude, lng: myLongitude},
        destination: {lat: friendLatitude, lng: friendLongitude},
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function sendCoordinates(message) {
    function onSuccess(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        calculateAndDisplayRoute(directionsService, directionsDisplay, latitude, longitude, message.lat, message.long);
    }

    function onError(err) {
        if (err.code === 1) {
            console.log("Error: Access is denied!");
        }

        else if (err.code === 2) {
            console.log("Error: Position is unavailable!");
        }
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}


$(document).on("pageshow", "#findFriendMapView", function () {
    var username = localStorage.username;
    var friend = localStorage.friend;

    if (typeof conn !== "undefined") {
        console.log("connection is still open.");
        return;
    }

    if (typeof username !== "undefined" && typeof friend !== "undefined" && username !== null && friend !== null) {

        mapConn = new WebSocket('ws://192.168.163.1:8080');

        mapConn.onopen = function (e) {
            console.log("Connection established!");
        };

        mapConn.onmessage = function (e) {
            var message = JSON.parse(e.data);

            switch (message.type) {
                case 'sync':
                    syncRequest(message);
                    break;
                case 'coordinates':
                    sendCoordinates(message);
                    break;
                case 'initialize':
                    initializeMap(message);
                    break;
            }
        };

        mapConn.onclose = function (e) {
            console.log("Connection is closed!");
        };

        function sendMessage() {
            message = {type: "sync", username: username, friend: friend};
            var acceptObject = JSON.stringify(message);
            mapConn.send(acceptObject);
        }
        
        setTimeout(sendMessage, 1500);

    } else {
        console.log("Username or Friend is not set");
    }
});
