var conn = new WebSocket('ws://192.168.163.1:8080');

conn.onopen = function (e) {
    console.log("Connection established!");
};

conn.onmessage = function (e) {
    var message = JSON.parse(e.data);

    switch (message.type) {
        case 'request':
            receiveRequest(message);
            break;
        case 'accept':
            acceptRequest(message);
            break;
        case 'sync':
            syncRequest(message);
            break;
        case 'coordinates':
            coordinatesRequest(message);
            break;
    }
};

conn.onclose = function (e) {
    console.log("Connection is closed!");
};

function coordinatesRequest(message) {

    var myUsername = localStorage.username;
    var friend = message.username;

    if (myUsername.toLowerCase() === message.friend.toLowerCase()) {

        if (navigator.geolocation) {
            function onSuccess(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                message = {type: "coordinates", username: myUsername, friend: friend, lat: latitude, long: longitude};
                var coordinatesObject = JSON.stringify(message);
                conn.send(coordinatesObject);
            }

            function onError(err) {
                if (err.code === 1) {
                    console.log("Error: Access is denied!");
                }

                else if (err.code === 2) {
                    console.log("Error: Position is unavailable!");
                }
            }

            var options = {timeout: 31000, enableHighAccuracy: true, maximumAge: 90000};
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        }
    }

}

function receiveRequest(message) {
    var friend = message.friend.toLowerCase();
    var username = message.username.toLowerCase();

    var myUsername = localStorage.username;

    if (friend === myUsername.toLowerCase()) {
        message = {type: "accept", username: myUsername, friend: username};
        var acceptObject = JSON.stringify(message);
        conn.send(acceptObject);
    } else {
        console.log(friend + " and " + myUsername + " did not match.");
    }
}

function acceptRequest(message) {
    var username = message.username.toLowerCase();
    var friend = message.friend.toLowerCase();

    var myUsername = localStorage.username.toLowerCase();

    if (friend === myUsername) {

        localStorage.username = friend;
        localStorage.friend = username;

        conn = conn.close();
        $.mobile.changePage('#findFriendMapView');
    } else {
        console.log(friend + " and " + myUsername + " do not match.");
    }
}

function syncRequest(message) {
    var myUsername = localStorage.username;
    var friend = message.username;

    if (myUsername.toLowerCase() === message.friend.toLowerCase()) {
        if (navigator.geolocation) {
            var onSuccess = function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;

                message = {type: "initialize", username: myUsername, friend: friend, lat: lat, long: long};
                var coordinatesObject = JSON.stringify(message);
                conn.send(coordinatesObject);
            };

            function onError(error) {
                console.log("No geo-location support");
            }

            var options = {timeout: 31000, enableHighAccuracy: true, maximumAge: 90000};
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        }
    }
}


$(document).on("pageshow", "#loggedIn", function () {
    var username = localStorage.username;

    if (username === false) {
        $.mobile.changePage('#homePage');
        return;
    }

    $('#recentContactListView').children().remove();
    $('#recentPendingListView').children().remove();
    $('#recentRequestsListView').children().remove();

    loadLists(username);

    $("#recentContactListView").listview('refresh');
    $("#recentPendingListView").listview('refresh');
    $("#recentRequestsListView").listview('refresh');

});

$(document).on("pagecreate", "#loggedIn", function () {
    var username = localStorage.username;

    if (username === false) {
        $.mobile.changePage('#homePage');
        return;
    }

    $('#backBtnForFindMe').hide();

    $('#backBtnForFindMe').click(function () {
        $('#map_container').html("");
        $('#map_container').hide();
        $('#backBtnForFindMe').hide();
        $('#options').show();
        $.mobile.changePage('#loggedIn');
    });

    $('#findMeBtn').click(function () {

        $('#backBtnForFindMe').show();
        $('#options').hide();
        $('#map_container').show();

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

        var options = {timeout: 31000, enableHighAccuracy: true, maximumAge: 90000};
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    });

    $('#logoutBtn').click(function () {
        localStorage.username = null;
        $.mobile.changePage('#homePage');
    });

    $('#recentRequestsListView').delegate('li', 'tap', function () {
        var friend = localStorage.friend.trim();
        var username = localStorage.username;
        var type = "request";

        message = {type: type, username: username, friend: friend};
        var requestObject = JSON.stringify(message);

        conn.send(requestObject);

        localStorage.friend = null;
        $.mobile.changePage('#loggedIn');
    });

    $('#addFriend').click(function (event) {
        event.defaultPrevent;

        var friend = localStorage.friend.trim();
        var username = localStorage.username.trim();

        jQuery.ajax({
            type: "POST",
            url: "http://192.168.163.1:8001/",
            data: {method: "acceptFriend", username: username, friend: friend},
            success: function (data, status, jqXHR) {
                if (data.success === true) {
                    $('#acceptedFriendConfirmBox').html("<p style='color:green;text-align:center'>Friend Added.</p>");
                    setTimeout(function () {
                        $('#recentContactListView').children().remove();
                        $('#recentPendingListView').children().remove();
                        $('#recentRequestsListView').children().remove();

                        loadLists(username);

                        $("#recentContactListView").listview('refresh');
                        $("#recentPendingListView").listview('refresh');
                        $("#recentRequestsListView").listview('refresh');
                        $('#acceptedFriendConfirmBox').html("").fadeOut();
                    }, 3000);
                } else {
                    $('#acceptedFriendConfirmBox').html("<p style='color:red;text-align:center'>Friend could not be added. </p>");
                    setTimeout(function () {
                        $('#acceptedFriendConfirmBox').html("").fadeOut();
                    }, 3000);
                }

            },
            error: function (jqXHR, status) {
                alert('An unexpected error has occurred.');
            }
        });

        localStorage.friend = null;
        $.mobile.changePage('#loggedIn');
    });

    $('#cancelFriend').click(function (event) {
        event.preventDefault();
        localStorage.friend = null;
        $.mobile.navigate($(this).attr("href"));
    });

    $('#recentContactListView').delegate('li', 'tap', function () {
        var username = $(this).find('a').attr('id');
        localStorage.friend = username;

        var friend = localStorage.friend.trim();
        var username = localStorage.username;
        var type = "request";

        message = {type: type, username: username, friend: friend};
        var requestObject = JSON.stringify(message);

        conn.send(requestObject);

        localStorage.friend = null;
        $.mobile.changePage('#loggedIn');
    });


    $('#findFriend').click(function (event) {
        event.preventDefault();

        var friend = localStorage.friend.trim();
        var username = localStorage.username;
        var type = "request";

        message = {type: type, username: username, friend: friend};
        var requestObject = JSON.stringify(message);

        conn.send(requestObject);

        localStorage.friend = null;
        $.mobile.changePage('#loggedIn');
    });

    $('#acceptacceptFriendRequestToFindMe').click(function (event) {
        event.preventDefault();
        $('#acceptacceptFriendRequestToFindMe').remove();
        $('#declineacceptFriendRequestToFindMe').remove();

        $('#acceptFriendRequestToFindMeContainer').append("<a id='viewMap' href='#loggedIn' data-role='button' data-rel='back' data-theme'b' class='ui-btn ui-btn-corner-all ui-shadow ui-btn-up-b' data-transition='pop' data-direction='reverse'><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text' style='color:green;font-weight:bold'>View Map</span></span></a>");
        $('#acceptFriendRequestToFindMeContainer').append("<a id='DisableFindMe' href='#loggedIn' data-role='button' data-rel='back' data-theme'b' class='ui-btn ui-btn-corner-all ui-shadow ui-btn-up-b' data-transition='pop' data-direction='reverse'><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text' style='color:green;font-weight:bold'>Disable</span></span></a>");
    });

    $('#declineacceptFriendRequestToFindMe').click(function (event) {
        event.preventDefault();
        $.mobile.navigate($(this).attr("href"));
    });

    $('#viewMap').click(function (event) {
        event.preventDefault();
    });

    $('#DisableFindMe').click(function (event) {
        event.preventDefault();

        $('#viewMap').remove();
        $('#DisableFindMe').remove();

        $('#acceptFriendRequestToFindMeContainer').append("<a id='acceptacceptFriendRequestToFindMe' href='#loggedIn' data-role='button' data-rel='back' data-theme'b' class='ui-btn ui-btn-corner-all ui-shadow ui-btn-up-b' data-transition='pop' data-direction='reverse'><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text' style='color:green;font-weight:bold'>Accept</span></span></a>");
        $('#acceptFriendRequestToFindMeContainer').append("<a id='declineacceptFriendRequestToFindMe' href='#loggedIn' data-role='button' data-rel='back' data-theme'b' class='ui-btn ui-btn-corner-all ui-shadow ui-btn-up-b' data-transition='pop' data-direction='reverse'><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text' style='color:green;font-weight:bold'>Decline</span></span></a>");

        $.mobile.navigate($(this).attr("href"));
    });

    $('#cancelFindFriend').click(function (event) {
        event.preventDefault();
        localStorage.friend = null;
        $.mobile.navigate($(this).attr("href"));
    });

    $('#unFriend').click(function (event) {
        event.preventDefault();

        var friend = localStorage.friend;
        var username = localStorage.username;

        jQuery.ajax({
            type: "POST",
            url: "http://192.168.163.1:8001/",
            data: {method: "unFriend", username: username, friend: friend},
            success: function (data, status, jqXHR) {
                if (data.success === true) {
                    $('#acceptedFriendConfirmBox').html("<p style='color:green;text-align:center'>Unfriended.</p>");
                    setTimeout(function () {
                        $('#recentContactListView').children().remove();
                        $('#recentPendingListView').children().remove();
                        $('#recentRequestsListView').children().remove();

                        loadLists(username);

                        $("#recentContactListView").listview('refresh');
                        $("#recentPendingListView").listview('refresh');
                        $("#recentRequestsListView").listview('refresh');
                        $('#acceptedFriendConfirmBox').html("").fadeOut();
                    }, 3000);
                } else {
                    $('#acceptedFriendConfirmBox').html("<p style='color:redF;text-align:center'>Could not be unfriended.</p>");
                    setTimeout(function () {
                    }, 3000);
                }
            },
            error: function (jqXHR, status) {
                alert('An unexpected error has occurred.');
            }
        });
        localStorage.friend = null;
        $.mobile.navigate($(this).attr("href"));
    });
});


function loadLists(username) {
    jQuery.ajax({
        type: "POST",
        url: "http://192.168.163.1:8001/",
        data: {method: "getfriends", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#options').append('<p style="color:red;"> No friends. </p>');
                } else {
                    if (data.data.trim()) {
                        var obj = JSON.parse(data.data);
                        obj.forEach(function (item) {
                            $('#recentContactListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                        });
                    }
                }
            } else {
                $('#options').append('<p> No friends. </p>');
            }
        },
        error: function (response, status, t) {
            alert('An unexpected error has occurred.' + response.responseText + " Status: " + status);
        }
    });

    jQuery.ajax({
        type: "POST",
        url: "http://192.168.163.1:8001/",
        data: {method: "getPending", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#options').append('<p style="color:red;"> No pending friends. </p>');
                } else {
                    if (!$.isEmptyObject(data.data)) {
                        var obj = JSON.parse(data.data);
                        obj.forEach(function (item) {
                            $('#recentPendingListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                        });
                    }
                }
            } else {
                $('#options').append('<p> No pending friends. </p>');
            }
        },
        error: function (response, status, t) {
            alert('An unexpected error has occurred.' + response.responseText + " Status: " + status);
        }
    });


    jQuery.ajax({
        type: "POST",
        url: "http://192.168.163.1:8001/",
        data: {method: "getRequests", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#options').append('<p style="color:red;"> No requests. </p>');
                } else {
                    if (!$.isEmptyObject(data.data)) {
                        var obj = JSON.parse(data.data);
                        obj.forEach(function (item) {
                            $('#recentRequestsListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                        });
                    }
                }
            } else {
                $('#options').append('<p> No requests. </p>');
            }
        },
        error: function (response, status, t) {
            alert('An unexpected error has occurred.' + response.responseText + " Status: " + status);
        }
    });
}
