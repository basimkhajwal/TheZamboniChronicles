//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

Zamboni.States.LoadingState = {

    create: function () {
        "use strict";

        var game = null;
        var state = Engine.GameState.create();
        var loadingText = Engine.UI.TextArea.create(400, Zamboni.Utils.GameSettings.canvasWidth / 2, "Loading");

        state.onCreate = function (g) {
            game = g;


        };

        state.render = function (ctx) {

        }


        return state;

    }


};
