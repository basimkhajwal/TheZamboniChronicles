//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

Zamboni.States.MenuState = {

    create: function () {
        "use strict";

        var state = Engine.GameState.create();
        var game = null;

        var title = Engine.UI.TextArea.create(500, 50, "The Zamboni Chronicles");
        title.setFamily(Zamboni.Utils.GameSettings.gameFont);
        title.setBaseline("top");
        title.setSize(60);
        title.setColour(Zamboni.Utils.ColourScheme.MIDNIGHT_BLUE);
        title.setVariant("small-caps");

        var startGame = Engine.UI.TextButton.create(350, 400, 300, 80, "Start Game");
        (function () {
            startGame.setColour(Zamboni.Utils.ColourScheme.TURQUOISE);
            startGame.setClickColour(Zamboni.Utils.ColourScheme.TURQUOISE);
            startGame.setHoverColour(Zamboni.Utils.ColourScheme.GREEN_SEA);
            startGame.setCornerRadius(10);

            var text = startGame.getText();
            text.setFamily(Zamboni.Utils.GameSettings.gameFont);
            text.setSize(25);

        }());

        var background = null;
        var cloud = null;

        var cloudWidth = Zamboni.Utils.GameSettings.fuzzyCloudWidth * Zamboni.Utils.GameSettings.pixelScaleFactor;
        var cloudHeight = Zamboni.Utils.GameSettings.fuzzyCloudHeight * Zamboni.Utils.GameSettings.pixelScaleFactor;

        state.onCreate = function (g) {
            game = g;

            background = Engine.AssetManager.getAsset(Zamboni.Utils.Assets.MENU_BG_FUZZY);
            cloud = Engine.AssetManager.getAsset(Zamboni.Utils.Assets.CLOUD_FUZZY);
        };

        state.render = function (ctx) {
            ctx.drawImage(background, 0, 0, Zamboni.Utils.GameSettings.canvasWidth, Zamboni.Utils.GameSettings.canvasHeight);

            ctx.drawImage(cloud, 10, 10, cloudWidth, cloudHeight);

            title.render(ctx);
            startGame.render(ctx);
        };

        state.update = function (delta) {
            startGame.update();
        };


        return state;
    }

};
