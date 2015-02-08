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


    var self = {};

    self.parse = function (file) {
        var jsonObj = JSON.parse(file);
        return jsonObj.layers[0].data;
    };

    return self;
}());
