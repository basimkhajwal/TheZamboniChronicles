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

            //The camera for viewing the world (in the eyes of the player)
            camera = Engine.Camera.create(0, 0, 0),

            //The player entity
            player = Zamboni.World.GameEntity.createEmpty(),

            //Parse a new player from the JSON object
            parsePlayer = function (playerObj) {

                player.x = playerObj.x;
                player.y = playerObj.y;

                player.vx = 0;
                player.vy = 0;

                player.width = playerObj.width;
                player.height = playerObj.height;

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
            },

            jumped = false;


        //Put all the renderable tiles into the tiled maps renderable so that they are rendered correctly
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.GRASS, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS));
        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles.GRASS_DARK, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS_DARK));


        //Parse the test level - TODO
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

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.RIGHT)) {
                    player.x += 400 * delta;
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.LEFT)) {
                    player.x += -400 * delta;
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.DOWN)) {
                    player.y += 400 * delta;
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.UP)) {
                    player.y += -400 * delta;
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.SPACE) && !jumped) {
                    player.vy = -200;
                    jumped = true;
                } else if (Engine.KeyboardInput.isKeyDown(Engine.Keys.SPACE)) {
                    jumped = false;
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("Q"))) {
                    camera.rotate(10 * delta);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W"))) {
                    camera.rotate(-10 * delta);
                }

                player.accelerate(0, Zamboni.Utils.GameSettings.gravityForce * delta);
                player.update(delta);

            }


        };
    }

};
