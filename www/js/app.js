//THIS CODE SHOULD BE PART OF A FILE WHICH IS LOADED BEFORE jQueryMobile

/**
 * Create couple of jQuery Deferred Objects to catch the 
 * firing of the two events associated with the loading of
 * the two frameworks.
 */
var gapReady = $.Deferred();
var jqmReady = $.Deferred();

//Catch "deviceready" event which is fired when PhoneGap is ready
document.addEventListener("deviceReady", deviceReady, false);

//Resolve gapReady in reponse to deviceReady event
function deviceReady()
{
    gapReady.resolve();
}

/**
 * Catch "mobileinit" event which is fired when a jQueryMobile is loaded.
 * Ensure that we respond to this event only once.
 */
$(document).one("mobileinit", function () {
    jqmReady.resolve();
});

/**
 * Run your App Logic only when both frameworks have loaded
 */
$.when(gapReady, jqmReady).then(myAppLogic);

function loadjsfile(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);

    if (typeof fileref !== "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

// App Logic
function myAppLogic()
{
    loadjsfile('js/loginScript.js');
    loadjsfile('js/subscribeScript.js');
    loadjsfile('js/exitScript.js');
    loadjsfile('js/homeScript.js');
    loadjsfile('js/loggedInScript.js');
    loadjsfile('js/findFriendsViewScript.js');
    loadjsfile('js/mapViewScript.js');

}

