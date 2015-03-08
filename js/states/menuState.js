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

        var state = Engine.GameState.create(),
            game = null,

            title = Engine.UI.TextArea.create(500, 50, "The Zamboni Chronicles"),

            startGame = Engine.UI.TextButton.create(350, 400, 300, 80, "Start Game"),

            background = null,

            cloudImg = null,
            cloudWidth = Zamboni.Utils.GameSettings.fuzzyCloudWidth,
            cloudHeight = Zamboni.Utils.GameSettings.fuzzyCloudHeight,

            cloudManager = (function () {

                var getRan = function (min, max) {
                    return Math.random() * (max - min) + min;
                },

                    genCloud = function () {
                        var vx,

                            width = cloudWidth * getRan(0.4, 1),
                            height = cloudHeight * getRan(0.4, 1),

                            x = (vx > 0) ? getRan(-400, -1 * (width + 10)) : getRan(1010, 1200),
                            y = getRan(20 - height, 390 - height);

                        do {
                            vx = getRan(-50, 50);
                        } while (Math.abs(vx) < 15);

                        return [x, y, width, height, vx];
                    },

            //The clouds each have an x,y,width,height and vx
                    clouds = [
                        genCloud(),
                        genCloud()
                    ],

                    offscreenAmount = 20;

                return {

                    update: function (delta) {
                        var i;

                        for (i = 0; i < clouds.length; i += 1) {
                            clouds[i][0] += clouds[i][4] * delta;

                            if ((clouds[i][4] < 0 && clouds[i][0] + clouds[i][2] < offscreenAmount) || (clouds[i][4] > 0 && clouds[i][0] > 1000 + offscreenAmount)) {
                                clouds[i] = genCloud();
                            }
                        }
                    },

                    render: function (ctx) {
                        var i;
                        ctx.imageSmoothingEnabled = false;

                        for (i = 0; i < clouds.length; i += 1) {
                            ctx.drawImage(cloudImg, clouds[i][0], clouds[i][1], clouds[i][2], clouds[i][3]);
                        }

                        ctx.imageSmoothingEnabled = true;
                    }

                };
            }());


        title.setFamily(Zamboni.Utils.GameSettings.gameFont);
        title.setBaseline("top");
        title.setSize(60);
        title.setColour(Zamboni.Utils.ColourScheme.MIDNIGHT_BLUE);


        (function () {
            startGame.setColour(Zamboni.Utils.ColourScheme.TURQUOISE);
            startGame.setClickColour(Zamboni.Utils.ColourScheme.TURQUOISE);
            startGame.setHoverColour(Zamboni.Utils.ColourScheme.GREEN_SEA);
            startGame.setCornerRadius(10);

            var text = startGame.getText();
            text.setFamily(Zamboni.Utils.GameSettings.gameFont);
            text.setSize(25);

        }());

        background = null;



        state.onCreate = function (g) {
            game = g;

            background = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.MENU_BG_FUZZY);
            cloudImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.CLOUD_FUZZY);
        };

        state.render = function (ctx) {
            var i;

            ctx.drawImage(background, 0, 0, Zamboni.Utils.GameSettings.canvasWidth, Zamboni.Utils.GameSettings.canvasHeight);

            cloudManager.render(ctx);
            title.render(ctx);
            startGame.render(ctx);
        };

        state.update = function (delta) {
            startGame.update();
            cloudManager.update(delta);

            if (startGame.isClicked()) {
                var gsm = game.getGameStateManager();

                gsm.setState(Zamboni.States.GameState.create());
            }
        };


        return state;
    }

};
