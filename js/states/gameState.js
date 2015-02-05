//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

Zamboni.States.GameState = {


    create: function () {
        "use strict";

        var state = Engine.GameState.create();
        var game = null;

        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {

        };

        state.update = function (delta) {

        };

        return state;
    }

};
