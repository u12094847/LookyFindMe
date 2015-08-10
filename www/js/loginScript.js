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
        $("#loginPopup").popup("open");
        
        setTimeout(function () {
            $("#loginPopup").popup("close");
        }, 2000);
        
        $.mobile.changePage('#loggedIn');
    });
});