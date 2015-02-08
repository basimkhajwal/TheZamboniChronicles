//The needed modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Any sub-modules
Engine.UI = Engine.UI || {};

Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Zamboni.World = Zamboni.World || {};


Zamboni.World.LevelParser = (function () {
    "use strict";

    var get = function (url, onsuccess) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {

            if ((request.readyState === 4) && (request.status === 200)) {
                onsuccess(request);
            }
        };

        request.open("GET", url, true);
        request.send();
    };


    var self = {};

    self.parse = function (file) {

        get(file, function (req) {
            console.log(req.responseText);
        });


    };

    return self;
}());
