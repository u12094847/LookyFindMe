$(document).on("pagecreate", "#findFriendsView", function () {

    $('#searchFriendBtn').click(function () {
        searchItem = $("#searchFriendInput").val();

        $('#foundFriendList').children().remove();

        jQuery.ajax({
            type: "POST",
            url: "http://192.168.163.1:8001/",
            data: {method: "searchFriend", username: searchItem},
            success: function (data, status, jqXHR) {
                if (data.success === true) {
                    if (data.data === null) {
                        $('#friendsFoundContainer').append('<p style="color:red;"> No friends found. </p>');
                    } else {
                        var obj = JSON.parse(data.data);
                        obj.forEach(function (item) {
                            $('#foundFriendList').append("<li><a href='#confirmDialog 'data-rel='popup' class='ui-btn' id=" + item + ">" + item + "</a></li>");
                        });
                    }
                } else {
                    $('#friendsFoundContainer').append('<p> No friends. </p>');
                }
            },
            error: function (jqXHR, status) {
                alert('An unexpected error has occurred. ' + status);
            }
        });
    });

    $('#foundFriendList').delegate('li', 'tap', function () {
        var username = $(this).find('a').attr('id');
        localStorage.friend = username;
        $('#requestFriendHeader').html("Send " + username + " a request?");
        $('#confirmDialog').popup("open");
    });

    $('#requestFriend').click(function (event) {
        event.preventDefault();

        var friend = localStorage.friend;
        var username = localStorage.username;

        jQuery.ajax({
            type: "POST",
            url: "http://192.168.163.1:8001/",
            data: {method: "addFriend", username: username, friend: friend},
            success: function (data, status, jqXHR) {

                if (data.success === true) {
                    $('#friendConfirmBox').html("<p style='color:green;text-align:center'>Added.</p>");
                    setTimeout(function () {
                        $.mobile.changePage('#loggedIn');
                    }, 1500);
                } else {
                    $('#friendConfirmBox').html("<p style='color:red;text-align:center'>Username exists</p>");
                    setTimeout(function () {
                        $('#friendConfirmBox').html("").fadeOut();
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

    $('#cancelFriendRequest').click(function (event) {
        event.preventDefault();
        localStorage.friend = null;
        $.mobile.navigate(this.attr("href"));
    });
});
