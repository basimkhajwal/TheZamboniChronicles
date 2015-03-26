//The modules for this program
var Zamboni = Zamboni || {};
var Engine = Engine || {};

//The submodules
Zamboni.World = Zamboni.World || {};


/*
*   Parses a world into a given world descripter from a valid JSON object given
*/
Zamboni.World.LevelParser = (function () {

    "use strict";



    //Return a closure
    return {

        //The visible outside parse function
        parseLevel: function (fileText, worldDescriptor) {

            //Parse the actual JSOn Object first
            var jsonObj = JSON.parse(fileText),

                //Iterating variable
                i,

                //The tile layer from the JSON
                tiles = jsonObj.layers[0].data,

                //The tile to enumerate over
                tile,

                //Get all the objects
                objects = jsonObj.layers[1].objects;

            //Create a new tiled map for the level
            worldDescriptor.tiledMap = Engine.TiledMap.create(jsonObj.width, jsonObj.height, 20, 20);

            //Put all the renderable tiles into the tiled maps renderable so that they are rendered correctly

            //Use a loop for less lines of code
            for (tile in Zamboni.Utils.GameSettings.tiles) {
                if (Zamboni.Utils.GameSettings.tiles.hasOwnProperty(tile) && Zamboni.Utils.GameSettings.assets.hasOwnProperty(tile)) {
                    worldDescriptor.tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles[tile], Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets[tile]));
                }
            }

            //Set the camera variables
            worldDescriptor.worldWidth = worldDescriptor.tiledMap.getWidth() * worldDescriptor.tiledMap.getTileWidth();
            worldDescriptor.worldHeight = worldDescriptor.tiledMap.getHeight() * worldDescriptor.tiledMap.getTileHeight();

            //Where the camera could end up at max to prevent dodgy camera movement off the tiled map
            worldDescriptor.maxCameraX = worldDescriptor.worldWidth - 1000;
            worldDescriptor.maxCameraY = worldDescriptor.worldHeight - 600;

            //Set all the background tiles
            for (i = 0; i < tiles.length; i += 1) {

                //Set the correct row and column to the value that is at that tile
                worldDescriptor.tiledMap.setTileAt(Math.floor(i / jsonObj.width), i % jsonObj.width, tiles[i]);
            }

            //Loop over every object defined in the second layer and call the correct function to parse it
            for (i = 0; i < objects.length; i += 1) {

                switch (objects[i].type) {

                case "player":
                    parsePlayer(objects[i]);
                    break;

                case "lava":
                    parseLava(objects[i]);
                    break;

                case "enemy":
                    parseEnemy(objects[i]);
                    break;

                case "platform":
                    parsePlatform(objects[i]);
                    break;

                case "spikes":
                    parseSpikes(objects[i]);
                    break;

                case "ladder":
                    parseLadder(objects[i]);
                    break;
                }
            }

            //Get the collision function
            worldDescriptor.tiledCollision = worldDescriptor.tiledMap.isCellBlocked;
            worldDescriptor.entityCollisions.push(worldDescriptor.tiledMap.generateCollisionFunction());

        }


    };

}());
