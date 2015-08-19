$(document).on("pagebeforecreate", "#homePage", function () {
    if ($.getCookie('username')) {
        $.mobile.changePage('#loggedIn');
        return;
    }
    
    if ($.getCookie('username') !== "") {
        $.mobile.changePage('#loggedIn');
        return;
    }
    
    if ($.getCookie('username') !== null) {
        $.mobile.changePage('#loggedIn');
        return;
    }
});
