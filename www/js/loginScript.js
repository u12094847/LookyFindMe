$(document).on("pagecreate", "#login", function () {
    localStorage.username = null;

    if (localStorage.chkbx && localStorage.chkbx != '') {
        $('#remember_me').attr('checked', 'checked');
        $('#username').val(localStorage.usrname);
        $('#password').val(localStorage.pass);
    } else {
        $('#remember_me').removeAttr('checked');
        $('#username').val('');
        $('#password').val('');
    }

    $('#remember_me').click(function () {

        if ($('#remember_me').is(':checked')) {
            // save username and password
            localStorage.usrname = $('#username').val();
            localStorage.pass = $('#password').val();
            localStorage.chkbx = $('#remember_me').val();
        } else {
            localStorage.usrname = '';
            localStorage.pass = '';
            localStorage.chkbx = '';
        }
    });

    $("#loginBtn").on("click", function () {
        var username = $('#username').val().trim();
        var pass = $('#password').val().trim();
        if (username === "" || pass === "")
            return;
        var user = new UserLogin(username, pass);
        login(user);
    });
});

function UserLogin(username, password) {
    this.username = username;
    this.password = password;
}

function login(user) {
    jQuery.ajax({
        type: "POST",
        url: "http://192.168.163.1:8001/",
        data: {method: "login", username: user.username, password: user.password},
        success: function (data, status, jqXHR) {

            if (data.success === true) {
                $('#loginSuccessDiv').html("<p style='color:green;text-align:center'>Welcome.</p>");
                setTimeout(function () {
                    $('#loginSuccessDiv').html("");
                    localStorage.username = user.username;
                    $.mobile.changePage('#loggedIn');
                }, 2000);

            } else {
                $('#loginSuccessDiv').html("<p style='color:red;text-align:center'>Login failed.</p>");
                setTimeout(function () {
                    $('#loginSuccessDiv').html("").fadeOut();
                }, 3000);
            }
        },
        error: function (response, status, t) {
            alert('An unexpected error has occurred.' + response.responseText + " Status: " + status);
        }
    });
}
