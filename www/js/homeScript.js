$(document).on("pagebeforecreate", "#homePage", function () {
    
    var username = $.getCookie('username');  
    
    if (username === false) {
        return;
    }

    $.mobile.changePage('#loggedIn');
});
