$(document).on("pagecreate", "#loggedIn", function () {

    var username = $.getCookie("username");

    jQuery.ajax({
        type: "POST",
        url: "http://localhost:8001/",
        data: {method: "getfriends", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#viewAllContacts').append('<p style="color:red;"> No friends. </p>');
                } else {
                    var obj = JSON.parse(data.data);
                    obj.forEach(function (item) {
                        $('#recentContactListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                    });
                }
            } else {
                $('#viewAllContacts').append('<p> No friends. </p>');
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred. ' + status);
        }
    });

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
            document.getElementById('map_container').innerHTML = 'No Geolocation Support.';

        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    });
});
