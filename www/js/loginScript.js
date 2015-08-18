$(document).on("pagecreate", "#login", function () {
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
        var user = new UserLogin(username, pass);
        login(user);
    });
});

function UserLogin(username, password) {
    this.username = username;
    this.password = password;
}
;

function login(user) {
    jQuery.ajax({
        type: "POST",
        url: "http://localhost/",
        data: {method: "login", username: user.username, password: user.password},
        success: function (data, status, jqXHR) {

            if (data.success === true) {
                $('#loginSuccessDiv').html("<p style='color:green;text-align:center'>Welcome.</p>");
                setTimeout(function () {
                    $('#loginSuccessDiv').html("");
                    $.mobile.changePage('#loggedIn');
                    $.setCookie("username", user.username, 14);
                }, 2000);

            } else {
                $('#loginSuccessDiv').html("<p style='color:red;text-align:center'>Login failed.</p>");
                setTimeout(function () {
                    $('#loginSuccessDiv').html("").fadeOut();
                }, 3000);
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred.');
        }
    });
}
;