function userSubscribeDetails(name, surname, username, password) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
};

function addSubscriber(user) {
    jQuery.ajax({
        type: "POST",
        url: "http://localhost:8001/",
        data: {method: "subscribe", username: user.username, password: user.password, name: user.name, surname: user.surname},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                $.setCookie("username", user.username, 14);
                $.mobile.changePage('#loggedIn');
            } else {
                $.mobile.changePage('#homePage');
            }
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred.');
            $.mobile.changePage('#homePage');
        }
    });
}

$(document).on("pagecreate", "#subscribe", function () {
    
    $.setCookie('username', null, -1);

    $('#subscribeBtn').click(function () {
        var name = $('#name').val();
        var surname = $('#surname').val();
        var username = $('#usernameSub').val();
        var password = $('#passwordSub').val();

        var user = new userSubscribeDetails(name, surname, username, password);

        addSubscriber(user);
    });
});