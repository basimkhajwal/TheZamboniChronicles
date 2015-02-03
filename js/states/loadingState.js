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
        var startedChanging = false;
        var changing = false;

        var loadingText = Engine.UI.TextArea.create(Zamboni.Utils.GameSettings.canvasWidth / 2, 300, "Loading..");
        loadingText.setSize(30);
        loadingText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        loadingText.setColour(Zamboni.Utils.ColourScheme.SUN_FLOWER);

        var loadingBar = Engine.UI.LoadingBar.create(320, 800, 30, 1000);
        loadingBar.setColour(Zamboni.Utils.ColourScheme.POMEGRANATE);

        state.onCreate = function (g) {
            game = g;
            var i;

            for (i = 0; i < Zamboni.Utils.Assets.images.length; i += 1) {
                Engine.AssetManager.queueDownload(Zamboni.Utils.Assets.images[i]);
            }

            Engine.AssetManager.downloadAll();
        };

        state.update = function (delta) {
            loadingBar.setPercentage(Engine.AssetManager.getProgress());

            if (Engine.AssetManager.isDone() && !startedChanging) {
                startedChanging = true;

                window.setInterval(function () {
                    changing = true;
                }, 500);
            }

            if (changing) {
                var gsm = game.getGameStateManager();

                gsm.setState();
            }
        };

        state.render = function (ctx) {
            //Custom background colour
            ctx.fillStyle = Zamboni.Utils.ColourScheme.ALIZARIN;
            ctx.fillRect(0, 0, 1000, 600);

            //Draw the text
            loadingText.render(ctx);

            //Draw the loading bar
            loadingBar.render(ctx);
        };

        return state;

    }


};
