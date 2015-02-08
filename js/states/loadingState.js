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
        loadingText.setSize(40);
        loadingText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        loadingText.setColour(Zamboni.Utils.ColourScheme.SUN_FLOWER);

        var changingText = Engine.UI.TextArea.create(Zamboni.Utils.GameSettings.canvasWidth / 2, 450, "Changing screen..");
        changingText.setSize(20);
        changingText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        changingText.setColour(Zamboni.Utils.ColourScheme.ORANGE);

        var loadingBar = Engine.UI.LoadingBar.create(320, 800, 30, 1000);
        loadingBar.setColour(Zamboni.Utils.ColourScheme.POMEGRANATE);

        state.onCreate = function (g) {
            game = g;

            //The image loading stuff
            var asset;
            var assets = Zamboni.Utils.Assets; //Save for quick reference

            for (asset in assets) {
                if (assets.hasOwnProperty(asset)) {
                    Engine.AssetManager.queueDownload(assets[asset]);
                }
            }

            //The level loading stuff
            var levels = Zamboni.Utils.GameSettings.levels;
            var level;

            for (level in levels) {
                if (levels.hasOwnProperty(level)) {
                    Engine.AssetManager.queueRequest("levels/" + levels[level]);
                }
            }

            //Download everything
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

                gsm.setState(Zamboni.States.MenuState.create());
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

            //Draw if we are changing
            if (startedChanging) {
                changingText.render(ctx);
            }
        };

        return state;

    }


};
