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
        var tiledMap,

            //Clamp utility function
            clamp = function (val, min, max) {
                return Math.min(max, Math.max(val, min));
            },

            //The tiled maps collision function
            tiledCollision,

            //The camera for viewing the world (in the eyes of the player)
            camera = Engine.Camera.create(0, 0, 0),

            //The settings for the camera
            minCameraX = 0,
            minCameraY = 0,

            //To be set when the tiled map is created
            maxCameraX,
            maxCameraY,

            //How much the camera moved
            cameraChangeX,
            cameraChangeY,

            //An array to hold all the lava objects
            lavaObjects = [],

            //The player entity
            player,

            //Manage the background stuff
            backgroundManager = (function () {

                //Generate a random number between the two stated values
                var getRan = function (min, max) {
                    return Math.random() * (max - min) + min;
                },

                    //Variables for easy access
                    cloudImg = Engine.AssetManager.getAsset(Zamboni.Utils.Assets.CLOUD_FUZZY),
                    cloudWidth = Zamboni.Utils.GameSettings.fuzzyCloudWidth,
                    cloudHeight = Zamboni.Utils.GameSettings.fuzzyCloudHeight,

                    //Generate a new random cloud
                    genCloud = function (genAnywhere) {
                        var vx,

                            width = cloudWidth * getRan(0.2, 0.5),
                            height = cloudHeight * getRan(0.2, 0.5),

                            x = 0,
                            y = 0;

                        do {
                            vx = getRan(-40, 40);
                        } while (Math.abs(vx) < 10);

                        if (genAnywhere) {
                            x = getRan(0, 1000 - width);
                            y = getRan(20 - height, 600);
                        } else {
                            x = (vx > 0) ? getRan(-400, -1 * (width + 10)) : getRan(1010, 1200);
                            y = getRan(20 - height, 200 - height);
                        }

                        return [x + camera.getX(), y + camera.getY(), width, height, vx];
                    },

                    //The clouds each have an x,y,width,height and vx
                    clouds = [],

                    //The amount to test whether a section is off the screen
                    offscreenAmount = 20,

                    //The counter variable
                    i;

                return {

                    create: function () {
                        //Add the initial clouds
                        for (i = 0; i < Zamboni.Utils.GameSettings.backgroundCloudNumber; i += 1) {
                            clouds.push(genCloud(true));
                        }
                    },

                    update: function (delta) {
                        for (i = 0; i < clouds.length; i += 1) {
                            clouds[i][0] += (clouds[i][4] * delta) + (cameraChangeX * 0.6);

                            if ((clouds[i][4] < 0 && clouds[i][0] + clouds[i][2] < offscreenAmount) || (clouds[i][4] > 0 && clouds[i][0] > 1000 + offscreenAmount)) {
                                clouds[i] = genCloud(false);
                            }
                        }
                    },

                    render: function (ctx) {
                        ctx.imageSmoothingEnabled = false;

                        for (i = 0; i < clouds.length; i += 1) {
                            ctx.drawImage(cloudImg, clouds[i][0], clouds[i][1], clouds[i][2], clouds[i][3]);
                        }

                        ctx.imageSmoothingEnabled = true;
                    }

                };

            }()),

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

            //Create a new lava area from an object
            parseLava = function (lavaObj) {

                lavaObjects.push({
                    x: lavaObj.x,
                    y: lavaObj.y,

                    width: lavaObj.width,
                    height: lavaObj.height
                });

            },

            //Parse a new level from a given string
            parseLevel = function (fileText) {

                //Parse the actual JSOn Object first
                var jsonObj = JSON.parse(fileText),

                    //Counter variable
                    i,

                    //The tile layer from the JSON
                    tiles = jsonObj.layers[0].data,

                    //The tile to enumerate over
                    tile,

                    //Get all the objects
                    objects = jsonObj.layers[1].objects;

                //Create a new tiled map for the level
                tiledMap = Engine.TiledMap.create(jsonObj.width, jsonObj.height, 20, 20);

                //Put all the renderable tiles into the tiled maps renderable so that they are rendered correctly

                //Use a loop for less lines of code
                for (tile in Zamboni.Utils.GameSettings.tiles) {
                    if (Zamboni.Utils.GameSettings.tiles.hasOwnProperty(tile) && Zamboni.Utils.Assets.hasOwnProperty(tile)) {
                        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles[tile], Engine.AssetManager.getAsset(Zamboni.Utils.Assets[tile]));
                    }
                }

                //Set the camera variables
                maxCameraX = tiledMap.getWidth() * tiledMap.getTileWidth() - 1000;
                maxCameraY = tiledMap.getHeight() * tiledMap.getTileHeight() - 600;

                //Set all the background tiles
                for (i = 0; i < tiles.length; i += 1) {

                    //Set the correct row and column to the value that is at that tile
                    tiledMap.setTileAt(Math.floor(i / jsonObj.width), i % jsonObj.width, tiles[i]);
                }

                //Loop over every object defined in the second layer
                for (i = 0; i < objects.length; i += 1) {

                    switch (objects[i].type) {

                    case "player":
                        parsePlayer(objects[i]);
                        break;

                    case "lava":
                        parseLava(objects[i]);
                        break;
                    }
                }

                //Generate the background
                backgroundManager.create();

                //Get the collision function
                tiledCollision = tiledMap.isCellBlocked;
            },

            //The updating stuff
            updatePlayer = function (delta) {

                player.moveRight = (Engine.KeyboardInput.isKeyDown(Engine.Keys.RIGHT));
                player.moveLeft = (Engine.KeyboardInput.isKeyDown(Engine.Keys.LEFT));
                player.jump = (Engine.KeyboardInput.isKeyDown(Engine.Keys.UP));

                player.update(delta, tiledCollision);

            },

            updateCamera = function (delta) {

                //Rotation just for fun
                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("Q"))) {
                    camera.rotate(10 * delta);
                }

                if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W"))) {
                    camera.rotate(-10 * delta);
                }


                //Update the camera position
                camera.setX((player.x + player.width / 2) - Zamboni.Utils.GameSettings.playerScreenX);
                camera.setY((player.y + player.height / 2) - Zamboni.Utils.GameSettings.playerScreenY);

                //Clamp the values
                camera.setX(clamp(camera.getX(), minCameraX, maxCameraX));
                camera.setY(clamp(camera.getY(), minCameraY, maxCameraY));
            },

            //Update the static objects in the level
            updateObjects = function (delta) {



            },

            //Render the static objects
            renderObjects = function (ctx) {

                //Render all the lava
                lavaObjects.forEach(function (lava) {
                    ctx.fillStyle = Zamboni.Utils.ColourScheme.PUMPKIN;
                    ctx.fillRect(lava.x, lava.y, lava.width, lava.height);
                });

            };

        //Parse the level - TODO
        parseLevel(Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.levels.TEST2));

        //Return all the public methods and variables
        return {

            //Render the world on the context ctx
            render: function (ctx) {
                //Set the background colour
                ctx.fillStyle = Zamboni.Utils.ColourScheme.BACKGROUND_COLOUR;
                ctx.fillRect(0, 0, 1000, 600);

                camera.projectContext(ctx);

                backgroundManager.render(ctx);
                tiledMap.render(ctx);
                player.render(ctx);
                renderObjects(ctx);

                camera.unProjectContext(ctx);
            },

            //Update the world with time delta
            update: function (delta) {

                updateObjects(delta);
                updatePlayer(delta);

                var oldCameraX = camera.getX(),
                    oldCameraY = camera.getY();

                updateCamera(delta);

                cameraChangeX = camera.getX() - oldCameraX;
                cameraChangeY = camera.getY() - oldCameraY;

                backgroundManager.update(delta);
            }


        };
    }

};
