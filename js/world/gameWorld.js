//The needed modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Any sub-modules
Engine.UI = Engine.UI || {};

Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Zamboni.World = Zamboni.World || {};

/*
*   The main world class that will contain the current level and any game object (players, enemies etc.)
*/
Zamboni.World.GameWorld = {

    /*
    *   Create a new empty world
    */
    create: function () {
        "use strict";

        //All the private methods and variables
        var tiledMap = Engine.TiledMap.create(50, 30, 20, 20);
        var camera = Engine.Camera.create(0, 0, 0);
        var player = {};

        var parseLevel = function (fileText) {

            var jsonObj = JSON.parse(fileText),
                i,
                tiles = jsonObj.layers[0].data;



            for (i = 0; i < tiles.length; i += 1) {
                tiledMap.setTileAt(Math.floor(i / 50), i % 50, tiles[i]);
            }


        };

        tiledMap.putRenderable(Zamboni.Utils.Tiles.GRASS, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS));
        tiledMap.putRenderable(Zamboni.Utils.Tiles.GRASS_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS_DARK));

        parseLevel(Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.levels.TEST));



        //Return all the public methods and variables
        return {

            //Render the world on the context ctx
            render: function (ctx) {
                //Set the background colour
                ctx.fillStyle = Zamboni.Utils.ColourScheme.BACKGROUND_COLOUR;
                ctx.fillRect(0, 0, 1000, 600);


                camera.projectContext(ctx);
                tiledMap.render(ctx);
                camera.unProjectContext(ctx);
            },

            //Update the world with time delta
            update: function (delta) {
                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.RIGHT)) {
                    camera.translate(-400 * delta, 0);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.LEFT)) {
                    camera.translate(400 * delta, 0);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.DOWN)) {
                    camera.translate(0, -400 * delta);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.UP)) {
                    camera.translate(0, 400 * delta);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("Q"))) {
                    camera.rotate(10 * delta);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W"))) {
                    camera.rotate(-10 * delta);
                }
            }


        };
    }

};
