//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

Zamboni.States.MenuState = {

    create: function () {

        var state = Engine.GameState.create();

        var game = null;

        state.onCreate = function (g) {
            game = g;
        };


        return state;
    }

};
