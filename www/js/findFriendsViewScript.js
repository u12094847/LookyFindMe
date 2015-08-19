$(document).on("pagecreate", "#findFriendsView", function () {

    $('#searchFriendBtn').click(function () {
        searchItem = $("#searchFriendInput").val();

        $('#foundFriendList').children().remove();

        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8001/",
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
        $.setCookie("friend", username, 1);
        $('#addFriendHeader').html("Add " + username + "?");
        $('#confirmDialog').popup("open");
    });

    $('#addFriend').click(function (event) {
        event.preventDefault();

        var friend = $.getCookie('friend').trim();
        var username = $.getCookie('username').trim();
        
        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8001/",
            data: {method: "addFriend", username: "Mamelo", friend: "jimmy"},
            success: function (data, status, jqXHR) {

                if (data.success === true) {
                    $('#friendConfirmBox').html("<p style='color:green;text-align:center'>Added.</p>");
                    setTimeout(function () {
                        $('#friendConfirmBox').html("").fadeOut();
                    }, 3000);
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

        $.setCookie('friend', null, -1);
        $.mobile.navigate($(this).attr("href"));
    });

    $('#addFriendHeader').click(function (event) {
        event.preventDefault();
        $.setCookie('friend', null, -1);
        $.mobile.navigate(this.attr("href"));
    });


});
