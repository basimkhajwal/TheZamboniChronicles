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

        var loadingText = Engine.UI.TextArea.create(Zamboni.Utils.GameSettings.canvasWidth / 2, 300, "Loading..");
        loadingText.setSize(30);
        loadingText.set
        loadingText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        loadingText.setColour(Zamboni.Utils.ColourScheme.SUN_FLOWER);

        state.onCreate = function (g) {
            game = g;


        };

        state.update = function (delta) {

        };

        state.render = function (ctx) {
            ctx.fillStyle = Zamboni.Utils.ColourScheme.ALIZARIN;
            ctx.fillRect(0, 0, 1000, 600);

            loadingText.render(ctx);
        };

        return state;

    }


};
