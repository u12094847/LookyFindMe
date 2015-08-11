function userSubscribeDetails(name, surname, username, password) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
    this.toJSONString = function () {
        return JSON.stringify(this);
    };
}
;

function addSubscriber(user) {
    jQuery.ajax({
        type: "ADD",
        url: "http://localhost:49193/Contacts.svc/Add",
        data: user.toJsonString(),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            $("#subscribePopup").popup("open");
            setTimeout(function () {
                $("#subscribePopup").popup("close");
            }, 1000);
        },
        error: function (jqXHR, status) {
            alert('An unexpected error has occurred.');
        }
    });
}

$(document).on("pagecreate", "#subscribe", function () {

    $('#subscribeBtn').click(function () {
        var name = $('#name').val();
        var surname = $('#surname').val();
        var username = $('#usernameSub').val();
        var password = $('#passwordSub').val();

        var user = new userSubscribeDetails(name, surname, username, password);

        addSubscriber(user);
    });
});