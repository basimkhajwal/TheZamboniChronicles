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
    //Utility function that returns -1 if less than 0, 0 if 0, 1 if more than 0
    var sign = function (val) {
            if (val === 0) {
                return 0;
            } else if (val < 0) {
                return -1;
            } else {
                return 1;
            }
        },

        generateCollision = function (x, y, width, height) {
            return function (nx, ny) {
                return nx >= x && nx <= x + width && ny >= y && ny <= y + height;
            };
        },

        //The iterating variables
        i,
        j,

        //Parse a new player from the JSON object
        parsePlayer = function (playerObj, worldDescriptor) {

            //Create a new game entity for the player
            var player = Engine.GameEntity.createEmpty();

            //Set the positions and the dimension
            player.x = playerObj.x;
            player.y = playerObj.y;
            player.width = playerObj.width;
            player.height = playerObj.height;

            //Set the sprite image as loaded, will be an animation later
            player.img = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.JAGO_RIGHT);

            //Set the forces (only gravity for now)
            player.applyGravity = true;


            //Set the world descriptor player
            worldDescriptor.player = player;
        },

        //Create a new enemy from the object
        parseEnemy = function (enemyObj, worldDescriptor) {

            //Create a new game entity for this enemy
            var enemy = Engine.GameEntity.createEmpty();

            //Set the position and dimensions
            enemy.x = enemyObj.x;
            enemy.y = enemyObj.y;
            enemy.width = enemyObj.width;
            enemy.height = enemyObj.height;

            //The settings for the enemy for forces
            enemy.applyGravity = true;
            enemy.moveLeft = true;

            //Set the type of the enemy, the default is type a
            enemy.type = (enemyObj.properties.type || "a").toLowerCase();

            //The appropriate images
            if (enemy.width > 20) {
                enemy.leftImage = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.MONSTER2_LEFT);
                enemy.rightImage = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.MONSTER2_RIGHT);
            } else {
                enemy.leftImage = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.MONSTER_LEFT);
                enemy.rightImage = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.MONSTER_RIGHT);
            }

            //Add it to the global enemy array
            worldDescriptor.enemyObjects.push(enemy);

            //Add the collision function to the enemy object list
            worldDescriptor.enemyCollisions.push(enemy.generateCollisionFunction());
        },

        //Create a new lava area from an object
        parseLava = function (lavaObj, worldDescriptor) {

            //Create the base lava with the settings in the lavaObj
            var lava = {
                    x: lavaObj.x,
                    y: lavaObj.y,

                    width: lavaObj.width,
                    height: lavaObj.height,

                    //For drawing a wavy cubic thing (it looks pretty)
                    waves: []
                },

                //How much to step by
                stepWidth = worldDescriptor.tiledMap.getTileWidth() / 2,

                //For generating alternate direction waves
                sign = 1,

                //The biggest amplitude (up or down) of a wave
                maxHeight = 4;

            //Add the first point (beginning)
            lava.waves.push(lava.x);
            lava.waves.push(lava.y);

            //Create the waves
            for (i = 1; i < Math.floor(lava.width / stepWidth); i += 1) {

                //Put the x co-ord in
                lava.waves.push(lava.x + stepWidth * i);

                //Make a random height for it
                lava.waves.push(lava.y + Math.random() * maxHeight * sign);

                //Flip the sign to make it wavy
                sign *= -1;
            }

            //Add the last point
            lava.waves.push(lava.x + lava.width);
            lava.waves.push(lava.y);

            //Add a new lava object with the position and dimensions to the lava object list
            worldDescriptor.lavaObjects.push(lava);

        },

        //Add a new spike object
        parseSpikes = function (spikeObj, worldDescriptor) {
            var spike = {};

            //Set the position and dimensions
            spike.x = spikeObj.x;
            spike.y = spikeObj.y;
            spike.width = spikeObj.width;
            spike.height = spikeObj.height;

            //How many tiles wide the spikes are
            spike.tileWidth = Math.floor(spike.width / worldDescriptor.tiledMap.getTileWidth());

            //Add a simple collision function
            spike.collisionFunction = generateCollision(spike.x, spike.y, spike.width, spike.height);

            //Add it to the global spike list
            worldDescriptor.spikeObjects.push(spike);
        },


        //Parse a breakable brick block from an object
        parseBrick = function (brickObj, worldDescriptor) {

            //How many bricks wide and high the object is
            var bricksWidth = brickObj.width / worldDescriptor.tiledMap.getTileWidth(),
                bricksHeight = brickObj.height / worldDescriptor.tiledMap.getTileHeight(),

                //An object for iterating
                brick;

            //Add the appropriate number of bricks at the positions
            for (i = 0; i < bricksWidth; i += 1) {
                for (j = 0; j < bricksHeight; j += 1) {

                    brick = {
                        x: brickObj.x + worldDescriptor.tiledMap.getTileWidth() * i,
                        y: brickObj.y + worldDescriptor.tiledMap.getTileHeight() * j,

                        width: worldDescriptor.tiledMap.getTileWidth(),
                        height: worldDescriptor.tiledMap.getTileHeight()
                    };

                    brick.collisionFunction = generateCollision(brick.x, brick.y, brick.width, brick.height);

                    worldDescriptor.brickCollisions.push(brick.collisionFunction);
                    worldDescriptor.brickObjects.push(brick);
                }
            }


        },

        //Make a ladder from the JSON obj
        parseLadder = function (ladderObj, worldDescriptor) {

            //Create the ladder object
            var ladder = {

                //Set the position and dimensions
                x: ladderObj.x,
                y: ladderObj.y,
                width: worldDescriptor.tiledMap.getTileWidth(),
                height: ladderObj.height,

                //Tile height for easier rendering and easing the computations
                tileHeight: Math.ceil(ladderObj.height / worldDescriptor.tiledMap.getTileHeight())

            };

            //Push a new ladder to the current ladder list
            worldDescriptor.ladderObjects.push(ladder);

            //Add the collision function for this ladder
            worldDescriptor.ladderCollisions.push(generateCollision(ladder.x, ladder.y, ladder.width, ladder.height));
        },

        //Parse a coin from the json object
        parseCoin = function (coinObj, worldDescriptor) {

            //The coin object to create
            var coin = {};

            //Set the position according to the JSON object
            coin.x = coinObj.x;
            coin.y = coinObj.y;

            //The dimensions according to the JSON object
            coin.width = coinObj.width;
            coin.height = coinObj.height;

            //Make a collision function for it
            coin.collisionFunction = generateCollision(coin.x, coin.y, coin.width, coin.height);

            //Add it to the global coins list
            worldDescriptor.coinObjects.push(coin);
        },

        //Take the object of a platfrom from the JSON and creat a platform from it
        parsePlatform = function (platformObj, worldDescriptor) {

            //Create a new game entity for this platform
            var platform = Engine.GameEntity.createEmpty(),

                //Set the default speed value or get one
                speed = parseInt(platformObj.properties.speed, 10) || 60,

                //The movement variables for later use
                changeX,
                changeY,
                lengthChange;

            //Set the position and dimensions
            platform.x = platformObj.x;
            platform.y = platformObj.y;
            platform.width = platformObj.width;
            platform.height = platformObj.height;

            //Set the movement positions
            platform.startX = platformObj.x;
            platform.startY = platformObj.y;
            platform.endX = parseInt(platformObj.properties.endX, 10);
            platform.endY = parseInt(platformObj.properties.endY, 10);

            //Calculate which way to move
            changeX = platform.endX - platform.x;
            changeY = platform.endY - platform.y;
            lengthChange = Math.sqrt(changeX * changeX + changeY * changeY);

            //Set the direction
            platform.directionX = sign(changeX);
            platform.directionY = sign(changeY);

            //Set the velocity
            platform.vx = speed * (changeX / lengthChange);
            platform.vy = speed * (changeY / lengthChange);

            //Whether or not the platform is moving to its start position or end (see above)
            platform.movingToEnd = true;

            //The forces to apply to the platform (which are none)
            platform.applyGravity = false;
            platform.applyFriction = false;

            //The default platform colour (to be changed)
            platform.colour = Zamboni.Utils.ColourScheme.WET_ASPHALT;

            //Get the collsion function because it will be used a lot
            platform.collisionFunction = platform.generateCollisionFunction();

            //Add the platform to the global platofrm array
            worldDescriptor.platformObjects.push(platform);

            //Add the collision function for entities to collide with
            worldDescriptor.entityCollisions.push(platform.collisionFunction);
        };


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
                    parsePlayer(objects[i], worldDescriptor);
                    break;

                case "lava":
                    parseLava(objects[i], worldDescriptor);
                    break;

                case "enemy":
                    parseEnemy(objects[i], worldDescriptor);
                    break;

                case "platform":
                    parsePlatform(objects[i], worldDescriptor);
                    break;

                case "spikes":
                    parseSpikes(objects[i], worldDescriptor);
                    break;

                case "ladder":
                    parseLadder(objects[i], worldDescriptor);
                    break;

                case "coin":
                    parseCoin(objects[i], worldDescriptor);
                    break;

                case "brick":
                    parseBrick(objects[i], worldDescriptor);
                    break;

                }
            }

            //Get the collision function
            worldDescriptor.tiledCollision = worldDescriptor.tiledMap.isCellBlocked;
            worldDescriptor.entityCollisions.push(worldDescriptor.tiledMap.generateCollisionFunction());

        }


    };

}());
