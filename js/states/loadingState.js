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

        var loadingText = Engine.UI.TextArea.create(Zamboni.Utils.GameSettings.canvasWidth / 2, 200, "Loading..");
        loadingText.setSize(50);
        loadingText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        loadingText.setColour("#F00");

        state.onCreate = function (g) {
            game = g;


        };

        state.update = function (delta) {

        };

        state.render = function (ctx) {
            ctx.fillStyle = "#EEE";
            ctx.fillRect(0, 0, 1000, 600);

            loadingText.render(ctx);
        };

        return state;

    }


};
