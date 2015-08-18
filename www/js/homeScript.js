$(document).on("pagebeforecreate", "#homePage", function () {
    if ($.getCookie('username') !== null) {
        $.mobile.changePage('#loggedIn');
    }
});
