$(document).on("pagecreate", "#loggedIn", function () {
    $('#recentContactList').hide();

    $('#findMeBtn').click(function () {

        $('#options').hide();

        var map;

        var mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_container'), mapOptions);

        var onSuccess = function (position) {

            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var alt = position.coords.altitude;
            var acc = position.coords.accuracy;
            var altAcc = position.coords.altitudeAccuracy;
            var heading = position.coords.heading;
            var speed = position.coords.speed;
            var timeStamp = position.timestamp;

            var geolocate = new google.maps.LatLng(lat, long);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: geolocate,
                content:
                        '<h1> This is you</h1>' +
                        '<h2>Latitude: ' + lat + '</h2>' +
                        '<h2>Longitude: ' + long + '</h2>'
            });

            map.setCenter(geolocate);
        };

        function onError(error) {
            //no device doesn't support geolocation
            document.getElementById('map_container').innerHTML = 'No Geolocation Support.';


            /*if (err.code == 0) {
             // Unknown error
             }
             if (err.code == 1) {
             // Access denied by user
             }
             if (err.code == 2) {
             // Position unavailable
             }
             if (err.code == 3) {
             // Timed out
             }*/
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    });

    $('#recentContactsBtn').click(function () {
        $('#recentContactList').slideDown('fast', function () {
            $('#recentContactList').show();
        });
    });

    $('#recentContactListView li a').click(function () {
        var id = $(this).attr('id');
    });
});
