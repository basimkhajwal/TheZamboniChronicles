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

            //Utility function that returns -1 if less than 0, 0 if 0, 1 if more than 0
            sign = function (val) {
                if (val === 0) {
                    return 0;
                } else if (val < 0) {
                    return -1;
                } else {
                    return 1;
                }
            },

            //Takes a pair of collision functions and returns OR of them
            mergeCollisions = function (functionA, functionB) {
                return function (x, y) {
                    return functionA(x, y) || functionB(x, y);
                };
            },

            //Takes a list of collision functions and returns OR of them
            mergeAllCollisions = function (collisions) {

                return function (x, y) {
                    var i;

                    for (i = 0; i < collisions.length; i += 1) {
                        if (collisions[i](x, y)) {
                            return true;
                        }
                    }

                    return false;

                };

            },

            //The total collision functions for entities, the array of the functions and the final one
            entityCollisions = [],
            entityCollision,

            recomputeCollisions = function () {
                entityCollision = mergeAllCollisions(entityCollisions);
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

            //The size of the world in pixels
            worldWidth,
            worldHeight,

            //The player entity
            player,

            //An array to hold all their respective objects
            enemyObjects = [],
            lavaObjects = [],
            platformObjects = [],

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
                            x = getRan(0, worldWidth - width);
                            y = getRan(50, worldHeight - height);
                        } else {
                            x = (vx > 0) ? getRan(-400, -1 * (worldWidth + 10)) : getRan(worldWidth + 10, worldWidth + 200);
                            y = getRan(50, 200 - worldHeight);
                        }

                        return [x + camera.getX(), y + camera.getY(), width, height, vx];
                    },

                    //The clouds each have an x,y,width,height and vx
                    clouds = [],

                    //The position of the background mountains
                    backgroundMountains = [],

                    //The images to draw for the background
                    mountainImg = [
                        Engine.AssetManager.getAsset(Zamboni.Utils.Assets.BACKGROUND_MOUNTAINS_LIGHTER),
                        Engine.AssetManager.getAsset(Zamboni.Utils.Assets.BACKGROUND_MOUNTAINS_LIGHT),
                        Engine.AssetManager.getAsset(Zamboni.Utils.Assets.BACKGROUND_MOUNTAINS)
                    ],

                    //The amount to test whether a section is off the screen
                    offscreenAmount = 100,

                    //The counter variable
                    i;

                return {

                    create: function () {
                        //Add the initial clouds
                        for (i = 0; i < Zamboni.Utils.GameSettings.backgroundCloudNumber; i += 1) {
                            clouds.push(genCloud(true));
                        }

                        //Set the initial background positions
                        for (i = 0; i < 3; i += 1) {
                            backgroundMountains.push({
                                x: camera.getX(),
                                y: worldHeight - 700 + i * 125
                            });
                        }
                    },

                    update: function (delta) {

                        for (i = 0; i < clouds.length; i += 1) {
                            clouds[i][0] += (clouds[i][4] * delta) - (cameraChangeX * 0.1);

                            if ((clouds[i][4] < 0 && clouds[i][0] + clouds[i][2] < offscreenAmount) || (clouds[i][4] > 0 && clouds[i][0] > worldWidth + offscreenAmount)) {
                                clouds[i] = genCloud(false);
                            }
                        }

                        var point;

                        i = 0;
                        backgroundMountains.forEach(function (mountain) {
                            mountain.x += cameraChangeX * (1 - (i * 0.2));
                            point = mountain.x - camera.getX();

                            if (point < -offscreenAmount) {
                                mountain.x += 1000;
                            } else if (point > 1000 + offscreenAmount) {
                                mountain.x -= 1000;
                            }

                            i += 1;
                        });
                    },

                    render: function (ctx) {
                        //No image smoothing to keep pixelated effect
                        ctx.imageSmoothingEnabled = false;

                        //Draw 3 background images, one to its left, one at the position and one to the right
                        i = 0;
                        backgroundMountains.forEach(function (mountain) {
                            ctx.drawImage(mountainImg[i], mountain.x, mountain.y, 1000, 600);
                            ctx.drawImage(mountainImg[i], mountain.x - 1000, mountain.y, 1000, 600);
                            ctx.drawImage(mountainImg[i], mountain.x + 1000, mountain.y, 1000, 600);

                            i += 1;
                        });

                        //Draw the clouds with a bit of transparency and no image smoothing
                        ctx.globalAlpha = 0.8;
                        for (i = 0; i < clouds.length; i += 1) {
                            ctx.drawImage(cloudImg, clouds[i][0], clouds[i][1], clouds[i][2], clouds[i][3]);
                        }

                        //Set back to default
                        ctx.globalAlpha = 1.0;
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

            //Create a new enemy from the object
            parseEnemy = function (enemyObj) {

                var enemy = Zamboni.World.GameEntity.createEmpty();

                enemy.x = enemyObj.x;
                enemy.y = enemyObj.y;

                enemy.width = enemyObj.width;
                enemy.height = enemyObj.height;

                enemy.applyGravity = true;
                enemy.moveLeft = true;

                enemyObjects.push(enemy);

                console.log("GOT HERE");

                //var fn = enemy.generateCollisionFunction();
                //console.log(fn(enemy.x, enemy.y));
                //entityCollisions.push(fn);
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

            //Take the object of a platfrom from the JSON and creat a platform from it
            parsePlatform = function (platformObj) {

                var platform = Zamboni.World.GameEntity.createEmpty();

                platform.x = platformObj.x;
                platform.y = platformObj.y;
                platform.width = platformObj.width;
                platform.height = platformObj.height;

                platform.startX = platformObj.x;
                platform.startY = platformObj.y;
                platform.endX = parseInt(platformObj.properties.endX, 10);
                platform.endY = parseInt(platformObj.properties.endY, 10);

                platform.directionX = sign(platform.endX - platform.x);
                platform.directionY = sign(platform.endY - platform.y);

                platform.vx = 60 * platform.directionX;
                platform.vy = 60 * platform.directionY;

                platform.movingToEnd = true;

                platform.applyGravity = false;
                platform.applyFriction = false;
                platform.colour = Zamboni.Utils.ColourScheme.WET_ASPHALT;

                platformObjects.push(platform);

                entityCollisions.push(platform.generateCollisionFunction());
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
                worldWidth = tiledMap.getWidth() * tiledMap.getTileWidth();
                worldHeight = tiledMap.getHeight() * tiledMap.getTileHeight();

                maxCameraX = worldWidth - 1000;
                maxCameraY = worldHeight - 600;



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

                    case "enemy":
                        parseEnemy(objects[i]);
                        break;

                    case "platform":
                        parsePlatform(objects[i]);
                        break;
                    }
                }

                //Generate the background
                backgroundManager.create();

                //Get the collision function
                tiledCollision = tiledMap.isCellBlocked;
                entityCollisions.push(tiledMap.generateCollisionFunction());

                recomputeCollisions();
            },

            //The updating stuff
            updatePlayer = function (delta) {

                player.moveRight = (Engine.KeyboardInput.isKeyDown(Engine.Keys.RIGHT));
                player.moveLeft = (Engine.KeyboardInput.isKeyDown(Engine.Keys.LEFT));
                player.jump = (Engine.KeyboardInput.isKeyDown(Engine.Keys.UP));

                player.update(delta, entityCollision);

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

                //Update all the platforms
                platformObjects.forEach(function (platform) {

                    //Apply the physics
                    platform.update(delta);


                    if (platform.movingToEnd) {

                        if ((platform.directionX > 0 && platform.x >= platform.endX) || (platform.directionX < 0 && platform.x <= platform.endX)) {
                            platform.x = platform.endX;
                            platform.vx *= -1;
                            platform.movingToEnd = false;
                        }

                    } else {

                        if ((platform.directionX > 0 && platform.x <= platform.startX) || (platform.directionX < 0 && platform.x >= platform.startX)) {
                            platform.x = platform.startX;
                            platform.vx *= -1;
                            platform.movingToEnd = true;
                        }

                    }

                    //console.log(platform.vx + ", " + platform.vy);

                });

            },

            //Render the static objects
            renderObjects = function (ctx) {

                //Render all the lava
                lavaObjects.forEach(function (lava) {
                    ctx.fillStyle = Zamboni.Utils.ColourScheme.PUMPKIN;
                    ctx.fillRect(lava.x, lava.y, lava.width, lava.height);
                });

                //Render all the platforms
                platformObjects.forEach(function (platform) {
                    platform.render(ctx);
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
                tiledMap.render(ctx, camera.getX(), camera.getX() + 1000, camera.getY(), camera.getY() + 600);
                player.render(ctx);
                renderObjects(ctx);

                //Draw all the enemies
                enemyObjects.forEach(function (enemy) {
                    enemy.render(ctx);
                });

                camera.unProjectContext(ctx);
            },

            //Update the world with time delta
            update: function (delta) {

                updateObjects(delta);
                updatePlayer(delta);

                //Update enemies
                enemyObjects.forEach(function (enemy) {

                    if (enemy.x > player.x + 20) {
                        enemy.moveLeft = true;
                        enemy.moveRight = false;
                    } else if (enemy.x < player.x - 20) {
                        enemy.moveLeft = false;
                        enemy.moveRight = true;
                    } else {
                        enemy.moveLeft = false;
                        enemy.moveRight = false;
                    }

                    enemy.update(delta, entityCollision);

                    if (enemy.collidedRight || enemy.collidedLeft) {
                        enemy.jump = true;
                    } else {
                        enemy.jump = false;
                    }

                });

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
