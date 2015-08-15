function UserLogin(username, password) {
    this.username = username;
    this.password = password;
    this.toJSONString = function () {
        return JSON.stringify(this);
    };
}
;

function login(user) {
    jQuery.ajax({
        type: "GET",
        url: "http://localhost:8000/login",
        data: user.toJSONString(),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {

            if (data === true) {
                $("#loginPopup").popup("open");
                setTimeout(function () {
                    $("#loginPopup").popup("close");
                }, 1000);
            } else {
                alert('Login failed');
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred.');
        }
    });
}
;

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

        alert("tsek");
        var username = $('#username').val();
        var pass = $('#password').val();
        
        var user = new UserLogin(username, pass);
        login(user);

        $.mobile.changePage('#loggedIn');
    });
    
});