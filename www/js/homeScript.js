$(document).on("pagecreate", "#homePage", function () {
    if ($.getCookie('username') !== null) {
        $.mobile.changePage('#loggedIn');
    }
});
