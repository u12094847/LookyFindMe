function userSubscribeDetails(name, surname, username, password) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
}

function addSubscriber(user) {
    jQuery.ajax({
        type: "POST",
        url: "http://192.168.163.1:8001/",
        data: {method: "subscribe", username: user.username, password: user.password, name: user.name, surname: user.surname},
        success: function (data, status, jqXHR) {
            if (data.success === true) {
                localStorage.username = user.username;
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

    localStorage.username = null;

    $('#subscribeBtn').click(function () {
        var name = $('#name').val();
        var surname = $('#surname').val();
        var username = $('#usernameSub').val();
        var password = $('#passwordSub').val();

        var user = new userSubscribeDetails(name, surname, username, password);

        addSubscriber(user);
    });
});
