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

        coinText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        coinText.setBaseline("top");
        coinText.setSize(20);
        coinText.setColour(Zamboni.Utils.ColourScheme.ORANGE);

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

            //Render the pause button
            pauseButton.render(ctx);

            //Render the players lives
            for (i = 0; i < world.playerDescriptor.lives; i += 1) {
                ctx.drawImage(lifeImg,  930 - ((i + 1) * (lifeImgSize + lifeImgPadding)), 25 - (lifeImgSize / 2), lifeImgSize, lifeImgSize);
            }
        };

        state.update = function (delta) {

            //If the game isn't paused then update the world
            if (!paused) {
                world.update(delta);
            }

            //Update the button and check if it was clicked
            pauseButton.update();
            if (pauseButton.state === 1) {
                paused = !paused;
            }

            //Update GUI values
            coinText.setText(world.playerDescriptor.coinsCollected);
        };


        return state;
    }

};
