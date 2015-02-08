//The namespace design pattern
var Engine = Engine || {};

Engine.Ajax = (function () {
    "use strict";

    var self = {};

    self.get = function (url, onchange) {
        var request = new XMLHttpRequest();

        onchange = onchange || function () {};

        //The request handler
        request.onreadystatechange = function () {

            if ((request.readyState === 4) && (request.status === 200)) {
                onchange(request);
            } else {
                onchange(null);
            }
        };

        //Send the request
        request.open("GET", url, true);
        request.send();
    };


    return self;
}());
