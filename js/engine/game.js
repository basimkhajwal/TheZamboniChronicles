//The namespace design pattern
var Engine = Engine || {};

Engine.Game = {

    create: function (gameState) {

        //Create the 'private' variables, needed in the closure
        var canvas = Engine.Canvas.create(1000, 600);
        var fpsLogger = Engine.FPSLogger.create();
        var gameStateManager = Engine.GameStateManager.create(this);
        var assetManager = Engine.AssetManager.create();
        var timer = Engine.Timer.create();

        gameStateManager.setState(gameState);

        //Return the closure
        return {

            start: function () {

                assetManager.queueDownload("img/test.png");
                assetManager.downloadAll(function () {});

                var update = function (delta) {
                    fpsLogger.log(delta);

                    gameStateManager.update(delta);
                };

                var render =  function () {
                    canvas.begin();

                    gameStateManager.render(canvas.getContext());

                    canvas.getContext().fillRect(10, 10, 20, 20);

                    if (Engine.KeyboardInput.isKeyDown(Engine.Keys.SPACE)) {
                        canvas.getContext().drawImage(assetManager.getAsset("img/test.png"), 50, 50);

                    }

                    if (Engine.MouseInput.isMouseDown()) {
                        var mousePos = Engine.MouseInput.getMousePos();

                        console.log("Mouse clicked: " + mousePos.x + ", " + mousePos.y);
                    }

                    canvas.end();
                };

                //Begin the game loop
                timer.start(update, render);
            },

            getGameStateManager: function () {
                return gameStateManager;
            },

            getAssetManager: function () {
                return assetManager;
            }

        };

    }


};
