//The namespace design pattern
var Engine = Engine || {};

Engine.Ajax = (function () {
    "use strict";

    var self = {};

    self.get = function (url, onsuccess) {
        var request = new XMLHttpRequest();

        //The request handler
        request.onreadystatechange = function () {

            if ((request.readyState === 4) && (request.status === 200)) {
                onsuccess(request);
            }
        };

        //Send the request
        request.open("GET", url, true);
        request.send();
    };


    return self;
}());
