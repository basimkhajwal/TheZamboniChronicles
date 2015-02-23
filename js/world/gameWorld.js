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

        //The tiled map for the background
        var tiledMap = Engine.TiledMap.create(50, 30, 20, 20),

            //The tiled maps collision function
            tiledCollision,

            //The camera for viewing the world (in the eyes of the player)
            camera = Engine.Camera.create(0, 0, 0),

            //The player entity
            player,

            //Parse a new player from the JSON object
            parsePlayer = function (playerObj) {

                player = Zamboni.World.GameEntity.createEmpty();

                player.x = playerObj.x;
                player.y = playerObj.y;

                player.width = playerObj.width;
                player.height = playerObj.height;

                player.img = Engine.AssetManager.getAsset(Zamboni.Utils.Assets.PLAYER);

                player.applyGravity = true;

            },

            //Parse a new level from a given string
            parseLevel = function (fileText) {

                //Parse the actual JSOn Object first
                var jsonObj = JSON.parse(fileText),

                    //Counter variable
                    i,

                    //The tile layer from the JSON
                    tiles = jsonObj.layers[0].data,

                    //Get all the objects
                    objects = jsonObj.layers[1].objects;

                //Set all the background tiles
                for (i = 0; i < tiles.length; i += 1) {

                    //Set the correct row and column to the value that is at that tile
                    tiledMap.setTileAt(Math.floor(i / 50), i % 50, tiles[i]);
                }

                //Loop over every object defined in the second layer
                for (i = 0; i < objects.length; i += 1) {

                    switch (objects[i].type) {

                    case "player":
                        parsePlayer(objects[i]);
                        break;
                    }
                }

                //Get the collision function
                tiledCollision = tiledMap.isCellBlocked;
            };


        //Put all the renderable tiles into the tiled maps renderable so that they are rendered correctly
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.BLACK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.BLACK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.BLACK_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.BLACK_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.CLOUDS, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.CLOUDS));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.CLOUDS_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.CLOUDS_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.GRASS, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.GRASS_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.GREY, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GREY));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.GREY_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GREY_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.ORANGE, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.ORANGE));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.ORANGE_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.ORANGE_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.PURPLE, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.PURPLE));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.PURPLE_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.PURPLE_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.RED, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.RED));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.RED_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.RED_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.SKY, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.SKY));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.SKY_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.SKY_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.TURQUOISE, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.TURQUOISE));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.TURQUOISE_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.TURQUOISE_DARK));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.YELLOW, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.YELLOW));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.YELLOW_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.YELLOW_DARK));


        //Parse the level - TODO
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
                player.render(ctx);

                camera.unProjectContext(ctx);
            },

            //Update the world with time delta
            update: function (delta) {


                //Test movement code
                player.moveRight = (Engine.KeyboardInput.isKeyDown(Engine.Keys.RIGHT));
                player.moveLeft = (Engine.KeyboardInput.isKeyDown(Engine.Keys.LEFT));
                player.jump = (Engine.KeyboardInput.isKeyDown(Engine.Keys.UP));

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("Q"))) {
                    camera.rotate(10 * delta);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W"))) {
                    camera.rotate(-10 * delta);
                }

                player.update(delta, tiledCollision);

                //Update the camera position - TEMP
                camera.setX(player.x - 200);
                camera.setY(player.y - 200);
            }


        };
    }

};
