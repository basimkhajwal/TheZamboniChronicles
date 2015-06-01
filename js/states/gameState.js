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

        var state = Engine.GameState.create(),
            game = null,

            //Iterator variable
            i,

            //Whether or not the game is paused
            paused = false,

            //Stop flittering when changing pause states
            pauseChange = 0,

            //The game world
            world = Zamboni.World.GameWorld.create(),

            //GUI
            coinText = Engine.UI.TextArea.create(35, 13, ""),
            coinImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_1),
            lifeImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LIFE),

            //How big to draw the hearts that represent that players lives
            lifeImgSize = 30,

            //Padding between life images
            lifeImgPadding = 10,

            //The text to show when paused
            pauseText = Engine.UI.TextArea.create(500, 300, "Game Paused"),

            //The button class for toggling pause states
            pauseButton = {
                state: 0, //0 = UP, 1 = DOWN, 2 = HOVER

                //The rendering images
                img: [
                    Zamboni.Utils.GameSettings.assets.PAUSE_UP,
                    Zamboni.Utils.GameSettings.assets.PAUSE_DOWN,
                    Zamboni.Utils.GameSettings.assets.PAUSE_HOVER
                ].map(Engine.AssetManager.getAsset),

                render: function (ctx) {
                    ctx.drawImage(this.img[this.state], 950, 5, 40, 40);
                },

                update: function () {
                    var mousePos = Engine.MouseInput.getMousePos();

                    if (mousePos.x > 950 && mousePos.x < 990 && mousePos.y > 5 && mousePos.y < 45) {
                        if (Engine.MouseInput.isMouseDown()) {
                            this.state = 1;
                        } else {
                            this.state = 2;
                        }
                    } else {
                        this.state = 0;
                    }
                }
            };

        //Set values for coin text
        coinText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        coinText.setBaseline("top");
        coinText.setSize(20);
        coinText.setColour(Zamboni.Utils.ColourScheme.ORANGE);

        //Set values for pause text
        pauseText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        pauseText.setBaseline("middle");
        pauseText.setSize(40);
        pauseText.setColour(Zamboni.Utils.ColourScheme.WISTERIA);

        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {
            world.render(ctx);

            //Draw the HUD bar
            ctx.fillStyle = "rgb(0,0,0,0.3)";
            ctx.fillRect(0, 0, 1000, 50);

            //Draw the number of coins and an image
            ctx.drawImage(coinImg, 5, 15, 20, 20);
            coinText.render(ctx);

            //Render the players lives
            for (i = 0; i < world.playerDescriptor.lives; i += 1) {
                ctx.drawImage(lifeImg,  930 - ((i + 1) * (lifeImgSize + lifeImgPadding)), 25 - (lifeImgSize / 2), lifeImgSize, lifeImgSize);
            }

            //If the game is paused then render text to show that it is
            if (paused) {
                //Draw an overlay to make the rest of everything look darker
                ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
                ctx.fillRect(0, 0, 1000, 600);

                //Draw the square around it
                ctx.fillStyle = Zamboni.Utils.ColourScheme.GREEN_SEA;
                Engine.DrawTools.roundRect(ctx, 300, 225, 400, 150, 30, true, false);

                pauseText.render(ctx);
            }

            //Render the pause button
            pauseButton.render(ctx);
        };

        state.update = function (delta) {

            //If the game isn't paused then update the world
            if (!paused) {
                world.update(delta);
            }

            //Update the button and check if it was clicked
            pauseButton.update();
            if (pauseButton.state === 1 && pauseChange === 0) {
                paused = !paused;
                pauseChange = 1;

                //Reset pause change after 500ms
                setTimeout(function () {
                    pauseChange = 0;
                }, 500);
            }

            //Update GUI values
            coinText.setText(world.playerDescriptor.coinsCollected);
        };


        return state;
    }

};
