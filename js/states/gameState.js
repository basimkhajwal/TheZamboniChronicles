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

            //The game world
            world = Zamboni.World.GameWorld.create(),

            //GUI
            coinText = Engine.UI.TextArea.create(35, 13, ""),
            coinImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_1),

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

            pauseButton.render(ctx);
        };

        state.update = function (delta) {
            world.update(delta);

            pauseButton.update();

            //Update GUI values
            coinText.setText(world.playerDescriptor.coinsCollected);
        };


        return state;
    }

};
