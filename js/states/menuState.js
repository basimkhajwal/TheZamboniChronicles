//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

Zamboni.States.MenuState = {

    /*
    *   The menu state for the Zamboni Chronicles game, after the LoadingState and provides some nice background animations
    */
    create: function () {
        "use strict";

        //The state to return
        var state = Engine.GameState.create(),

            //The top level game container
            game = null,

            //The text for the top bit
            title = Engine.UI.TextArea.create(500, 50, "The Zamboni Chronicles"),

            //The button to get off the menu screen
            startGame = Engine.UI.TextButton.create(350, 400, 300, 80, "Start Game"),

            //The image to draw for the background
            background = null,

            cloudManager = (function () {

                //Utility function for making a random number bounded in a range
                var getRan = function (min, max) {
                        return Math.random() * (max - min) + min;
                    },

                    //The cloud settings
                    cloudImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.CLOUD_FUZZY),
                    cloudWidth = Zamboni.Utils.GameSettings.fuzzyCloudWidth,
                    cloudHeight = Zamboni.Utils.GameSettings.fuzzyCloudHeight,

                    //Create new random cloud
                    genCloud = function () {
                        var vx,

                            //Random size
                            width = cloudWidth * getRan(0.4, 1),
                            height = cloudHeight * getRan(0.4, 1),

                            //The position
                            x,
                            y;

                        //Get a random velocity of atleast 15
                        do {
                            vx = getRan(-50, 50);
                        } while (Math.abs(vx) < 15);

                        //Set the position based on the x velocity
                        x = (vx > 0) ? getRan(-400, -1 * (width + 10)) : getRan(1010, 1200);
                        y = getRan(20 - height, 390 - height);

                        //Return the cloud as an array
                        return [x, y, width, height, vx];
                    },

                    //The clouds each have an x,y,width,height and vx
                    clouds = [
                        genCloud(),
                        genCloud(),
                        genCloud()
                    ],

                    //The amount the clouds are offscreen until they are reset
                    offscreenAmount = 20;

                return {

                    update: function (delta) {
                        var i;

                        //Go over each cloud
                        for (i = 0; i < clouds.length; i += 1) {
                            clouds[i][0] += clouds[i][4] * delta;

                            //Check if it is out of bounds, if so then create a new cloud
                            if ((clouds[i][4] < 0 && clouds[i][0] + clouds[i][2] < -offscreenAmount) || (clouds[i][4] > 0 && clouds[i][0] > 1000 + offscreenAmount)) {
                                clouds[i] = genCloud();
                            }
                        }
                    },

                    render: function (ctx) {
                        var i;

                        //Stop image smoothing so they appear pixelated
                        ctx.imageSmoothingEnabled = false;

                        //Iterate and draw each cloud
                        for (i = 0; i < clouds.length; i += 1) {
                            ctx.drawImage(cloudImg, clouds[i][0], clouds[i][1], clouds[i][2], clouds[i][3]);
                        }

                        ctx.imageSmoothingEnabled = true;
                    }

                };
            }());

        //Set all the settings for all the text/titles
        (function () {

            title.setFamily(Zamboni.Utils.GameSettings.gameFont);
            title.setBaseline("top");
            title.setSize(60);
            title.setColour(Zamboni.Utils.ColourScheme.MIDNIGHT_BLUE);

            startGame.setColour(Zamboni.Utils.ColourScheme.TURQUOISE);
            startGame.setClickColour(Zamboni.Utils.ColourScheme.TURQUOISE);
            startGame.setHoverColour(Zamboni.Utils.ColourScheme.GREEN_SEA);
            startGame.setCornerRadius(10);

            var text = startGame.getText();
            text.setFamily(Zamboni.Utils.GameSettings.gameFont);
            text.setSize(25);

        }());

        state.onCreate = function (g) {
            game = g;


            //Get the images for drawing
            background = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.MENU_BG_FUZZY);
        };

        state.render = function (ctx) {
            //The counter variable
            var i;

            //Clear the background
            ctx.drawImage(background, 0, 0, Zamboni.Utils.GameSettings.canvasWidth, Zamboni.Utils.GameSettings.canvasHeight);

            //Draw the clouds then all the text on top
            cloudManager.render(ctx);
            title.render(ctx);
            startGame.render(ctx);
        };

        state.update = function (delta) {
            //Update the button
            startGame.update();

            //Update cloud positions
            cloudManager.update(delta);

            //If button is clicked then switch state
            if (startGame.isClicked()) {
                var gsm = game.getGameStateManager();

                gsm.setState(Zamboni.States.GameState.create());
            }
        };

        //Return the state that we just created
        return state;
    }

};
