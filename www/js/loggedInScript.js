$(document).on("pageshow", "#loggedIn", function () {
    var username = $.getCookie("username");

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
    var username = $.getCookie("username");

    if (username === false) {
        $.mobile.changePage('#homePage');
        return;
    }

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

    $('#logoutBtn').click(function () {
        $.setCookie("username", null, -1);
        $.mobile.changePage('#homePage');
    });

    $('#recentRequestsListView').delegate('li', 'tap', function () {
        var username = $(this).find('a').attr('id');
        $.setCookie("friend", username, 1);
        $('#addFriendHeader').html("Add " + username + "?");
        $('#confirmDialogAddFriend').popup("open");
    });

    $('#addFriend').click(function (event) {
        event.preventDefault();

        var friend = $.getCookie('friend').trim();
        var username = $.getCookie('username').trim();

        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8001/",
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

        $.setCookie('friend', null, -1);
        $.mobile.changePage('#loggedIn');
    });

    $('#cancelFriend').click(function (event) {
        event.preventDefault();
        $.setCookie('friend', null, -1);
        $.mobile.navigate($(this).attr("href"));
    });

    $('#recentContactListView').delegate('li', 'tap', function () {
        var username = $(this).find('a').attr('id');
        $.setCookie("friend", username, 1);
        $('#findFriendHeader').html("Find " + username + "?");
        $('#confirmFindFriend').popup("open");
    });


    $('#findFriend').click(function (event) {
        event.preventDefault();

        var friend = $.getCookie('friend').trim();
        var coordinates = null;

        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8001/",
            data: {method: "findFriend", coordinates: coordinates, friend: friend},
            success: function (data, status, jqXHR) {

                if (data.success === true) {

                } else {

                }

            },
            error: function (jqXHR, status) {
                alert('An unexpected error has occurred.');
            }
        });

        $.setCookie('friend', null, -1);
        $.mobile.changePage('#loggedIn');
    });

    $('#cancelFindFriend').click(function (event) {
        event.preventDefault();
        $.setCookie('friend', null, -1);
        $.mobile.navigate($(this).attr("href"));
    });

    $('#unFriend').click(function (event) {
        event.preventDefault();

        var friend = $.getCookie('friend');
        var username = $.getCookie('username');

        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8001/",
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
        $.setCookie('friend', null, -1);
        $.mobile.navigate($(this).attr("href"));
    });
});


function loadLists(username) {
    jQuery.ajax({
        type: "POST",
        url: "http://localhost:8001/",
        data: {method: "getfriends", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#options').append('<p style="color:red;"> No friends. </p>');
                } else {
                    var obj = JSON.parse(data.data);
                    obj.forEach(function (item) {
                        $('#recentContactListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                    });
                }
            } else {
                $('#options').append('<p> No friends. </p>');
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred. ' + status);
        }
    });

    jQuery.ajax({
        type: "POST",
        url: "http://localhost:8001/",
        data: {method: "getPending", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#options').append('<p style="color:red;"> No pending friends. </p>');
                } else {
                    var obj = JSON.parse(data.data);
                    obj.forEach(function (item) {
                        $('#recentPendingListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                    });
                }
            } else {
                $('#options').append('<p> No pending friends. </p>');
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred. ' + status);
        }
    });


    jQuery.ajax({
        type: "POST",
        url: "http://localhost:8001/",
        data: {method: "getRequests", username: username},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                if (data.data === null) {
                    $('#options').append('<p style="color:red;"> No requests. </p>');
                } else {
                    var obj = JSON.parse(data.data);
                    obj.forEach(function (item) {
                        $('#recentRequestsListView').append("<li><a href='#' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                    });
                }
            } else {
                $('#options').append('<p> No requests. </p>');
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred. ' + status);
        }
    });
}
;