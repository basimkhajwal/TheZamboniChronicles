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


        // ------------------ All the private methods and variables --------------------------

        //The tiled map for the background
        var tiledMap,

            //The counter variable
            i,

            //Utility clone for objects
            cloneObj = function (obj) {
                //Check to see if it is the correct type
                if (null === obj || "object" !== typeof obj) {
                    return obj;
                }

                //Get a copy of an empty object to use
                var copy = obj.constructor(),

                    //Attribute to enumerate over
                    attr;

                //Go over each property in the initial object
                for (attr in obj) {

                    //Copy the attribute if possible
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = obj[attr];
                    }
                }

                //Return the generated copy
                return copy;
            },

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

            //Like wise for enemy
            enemyCollisions = [],
            enemyCollision,

            //Ladder collisions
            ladderCollisions = [],
            ladderCollision,

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
            spikeObjects = [],
            ladderObjects = [],

            //The images for quick access
            spikeImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.SPIKES),

            ladderBottom = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LADDER_BOTTOM),
            ladderMiddle = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LADDER_MIDDLE),
            ladderTop = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LADDER_TOP),

            //Manage the background stuff (clouds and parallax scrolling etc)
            backgroundManager = (function () {

                //Generate a random number between the two stated values
                var getRan = function (min, max) {
                        return Math.random() * (max - min) + min;
                    },

                    //Variables for easy access
                    cloudImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.CLOUD_FUZZY),
                    cloudWidth = Zamboni.Utils.GameSettings.fuzzyCloudWidth,
                    cloudHeight = Zamboni.Utils.GameSettings.fuzzyCloudHeight,

                    //Generate a new random cloud
                    genCloud = function (genAnywhere) {
                        //The speed of the cloud in the x direction
                        var vx,

                            //A random size
                            width = cloudWidth * getRan(0.2, 0.5),
                            height = cloudHeight * getRan(0.2, 0.5),

                            //The position (to be set)
                            x,
                            y;

                        //Get a random velocity of a magnitude atleast 10
                        do {
                            vx = getRan(-40, 40);
                        } while (Math.abs(vx) < 10);

                        //If generating anywhere on screen then do so
                        //otherwise generate clouds only off the screen so they move in
                        if (genAnywhere) {
                            x = getRan(0, worldWidth - width);
                            y = getRan(50, (worldHeight - height) - 200);
                        } else {
                            x = (vx > 0) ? getRan(-400, -1 * (worldWidth + 10)) : getRan(worldWidth + 10, worldWidth + 200);
                            y = getRan(50, 200 - worldHeight);
                        }

                        //Return the array of the cloud details
                        return [x + camera.getX(), y + camera.getY(), width, height, vx];
                    },

                    //The clouds each have an x,y,width,height and vx
                    clouds = [],

                    //The position of the background mountains
                    backgroundMountains = [],

                    //The images to draw for the background
                    mountainImg = [
                        Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.BACKGROUND_MOUNTAINS_LIGHTER),
                        Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.BACKGROUND_MOUNTAINS_LIGHT),
                        Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.BACKGROUND_MOUNTAINS)
                    ],

                    //The amount to test whether a section is off the screen
                    offscreenAmount = 100;

                return {

                    //Reset the background manager
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

                        //Iterate over all the clouds
                        for (i = 0; i < clouds.length; i += 1) {
                            //Move them by their x velocity
                            clouds[i][0] += (clouds[i][4] * delta) - (cameraChangeX * 0.1);

                            //Check if they are off the screen, if so then reset it to a new cloud
                            if ((clouds[i][4] < 0 && clouds[i][0] + clouds[i][2] < -offscreenAmount) || (clouds[i][4] > 0 && clouds[i][0] > worldWidth + offscreenAmount)) {
                                clouds[i] = genCloud(false);
                            }
                        }

                        //Set the initial counter variable
                        i = 0;

                        //Iterate over each mountain that we are drawing
                        backgroundMountains.forEach(function (mountain) {
                            //Move mountains further away by less than the closer ones
                            mountain.x += cameraChangeX * (1 - (i * 0.2));

                            //Get the point on the screen of the mountain relative to the camera
                            var point = mountain.x - camera.getX();

                            //Check if the mountain goes off the screen and move it so that it doesn't
                            if (point < 0) {
                                mountain.x += 1000;
                            } else if (point > 1000) {
                                mountain.x -= 1000;
                            }

                            //Increment i for the next mountain
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

                //Create a new game entity for the player
                player = Engine.GameEntity.createEmpty();

                //Set the positions and the dimension
                player.x = playerObj.x;
                player.y = playerObj.y;
                player.width = playerObj.width;
                player.height = playerObj.height;

                //Set the sprite image as loaded, will be an animation later
                player.img = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.JAGO);

                //Set the forces (only gravity for now)
                player.applyGravity = true;

            },

            //Create a new enemy from the object
            parseEnemy = function (enemyObj) {

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

                //Add it to the global enemy array
                enemyObjects.push(enemy);

                //Add the collision function to the enemy object list
                enemyCollisions.push(enemy.generateCollisionFunction());
            },

            //Create a new lava area from an object
            parseLava = function (lavaObj) {

                //Add a new lava object with the position and dimensions to the lava object list
                lavaObjects.push({
                    x: lavaObj.x,
                    y: lavaObj.y,

                    width: lavaObj.width,
                    height: lavaObj.height
                });

            },

            //Add a new spike object
            parseSpikes = function (spikeObj) {
                var spike = {};

                //Set the position and dimensions
                spike.x = spikeObj.x;
                spike.y = spikeObj.y;
                spike.width = spikeObj.width;
                spike.height = spikeObj.height;

                //How many tiles wide the spikes are
                spike.tileWidth = Math.floor(spike.width / tiledMap.getTileWidth());

                //Add a simple collision function
                spike.collisionFunction = function (x, y) {
                    return (x >= spike.x && x <= spike.x + spike.width) && (y >= spike.y && y <= spike.y + spike.height);
                };

                //Add it to the global spike list
                spikeObjects.push(spike);
            },

            //Make a ladder from the JSON obj
            parseLadder = function (ladderObj) {

                //Create the ladder object
                var ladder = {

                    //Set the position and dimensions
                    x: ladderObj.x,
                    y: ladderObj.y,
                    width: tiledMap.getTileWidth(),
                    height: ladderObj.height,

                    //Tile height for easier rendering and easing the computations
                    tileHeight: Math.floor(ladderObj.height / tiledMap.getTileHeight()) + 1

                };

                //Push a new ladder to the current ladder list
                ladderObjects.push(ladder);

                //Add the collision function for this ladder
                ladderCollisions.push(function (x, y) {
                    return x >= ladder.x && x <= ladder.x + tiledMap.getTileWidth() && y >= ladder.y && y <= ladder.y + tiledMap.getTileWidth();
                });
            },

            //Take the object of a platfrom from the JSON and creat a platform from it
            parsePlatform = function (platformObj) {

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
                platformObjects.push(platform);

                //Add the collision function for entities to collide with
                entityCollisions.push(platform.collisionFunction);
            },

            //Parse a new level from a given string
            parseLevel = function (fileText) {

                //Parse the actual JSOn Object first
                var jsonObj = JSON.parse(fileText),

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
                    if (Zamboni.Utils.GameSettings.tiles.hasOwnProperty(tile) && Zamboni.Utils.GameSettings.assets.hasOwnProperty(tile)) {
                        tiledMap.putRenderable(Zamboni.Utils.GameSettings.tiles[tile], Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets[tile]));
                    }
                }

                //Set the camera variables
                worldWidth = tiledMap.getWidth() * tiledMap.getTileWidth();
                worldHeight = tiledMap.getHeight() * tiledMap.getTileHeight();

                //Where the camera could end up at max to prevent dodgy camera movement off the tiled map
                maxCameraX = worldWidth - 1000;
                maxCameraY = worldHeight - 600;

                //Set all the background tiles
                for (i = 0; i < tiles.length; i += 1) {

                    //Set the correct row and column to the value that is at that tile
                    tiledMap.setTileAt(Math.floor(i / jsonObj.width), i % jsonObj.width, tiles[i]);
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

                //Generate the background
                backgroundManager.create();

                //Get the collision function
                tiledCollision = tiledMap.isCellBlocked;
                entityCollisions.push(tiledMap.generateCollisionFunction());

                //Merge the collision functions all into one
                entityCollision = mergeAllCollisions(entityCollisions);
                ladderCollision = mergeAllCollisions(ladderCollisions);
                enemyCollision = mergeAllCollisions(enemyCollisions);
            },

            //The updating stuff
            updatePlayer = function (delta) {

                //If any movement keys have been pressed set the movement pace
                player.moveRight = (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("D")));
                player.moveLeft = (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("A")));
                player.jump = (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W")));

                //Update the player physics
                player.update(delta, entityCollision);

                //Move player down by 10 because no collisions normally occur
                player.y += 5;

                //Check collisions with platforms and apply a force if it is
                platformObjects.forEach(function (platform) {

                    //If the player is on a platform then move along with it
                    if (player.collidesBottom(platform.collisionFunction)) {
                        player.x += platform.xChange;
                        player.y += platform.yChange;
                    }

                });

                //Return the player back to its original y value
                player.y -= 5;
            },

            updateCamera = function (delta) {

                //Save the old position
                var oldCameraX = camera.getX(),
                    oldCameraY = camera.getY();

                //Update the camera position
                camera.setX((player.x + player.width / 2) - Zamboni.Utils.GameSettings.playerScreenX);
                camera.setY((player.y + player.height / 2) - Zamboni.Utils.GameSettings.playerScreenY);

                //Clamp the values
                camera.setX(clamp(camera.getX(), minCameraX, maxCameraX));
                camera.setY(clamp(camera.getY(), minCameraY, maxCameraY));

                //Update the change variables
                cameraChangeX = camera.getX() - oldCameraX;
                cameraChangeY = camera.getY() - oldCameraY;
            },

            //Update the static objects in the level
            updateObjects = function (delta) {

                //Update all the platforms
                platformObjects.forEach(function (platform) {

                    //Apply the physics
                    platform.update(delta);

                    //If the platform is moving in the original direction
                    if (platform.movingToEnd) {

                        //Check if it has reached the end if it is moving left or right, then switch direction
                        if ((platform.directionX > 0 && platform.x >= platform.endX) || (platform.directionX < 0 && platform.x <= platform.endX)) {
                            platform.x = platform.endX;
                            platform.vx *= -1;
                            platform.movingToEnd = false;
                        }

                        //If the it has reached the end either up or down then switch direction
                        if ((platform.directionY > 0 && platform.y >= platform.endY) || (platform.directionY < 0 && platform.y <= platform.endY)) {
                            platform.y = platform.endY;
                            platform.vy *= -1;
                            platform.movingToEnd = false;
                        }

                    } else {

                        //If it has gone back to the start either left or right then switch direction
                        if ((platform.directionX > 0 && platform.x <= platform.startX) || (platform.directionX < 0 && platform.x >= platform.startX)) {
                            platform.x = platform.startX;
                            platform.vx *= -1;
                            platform.movingToEnd = true;
                        }

                        //If it has reached the start again either upwards or below then switch direction again
                        if ((platform.directionY > 0 && platform.y <= platform.startY) || (platform.directionY < 0 && platform.y >= platform.startY)) {
                            platform.y = platform.startY;
                            platform.vy *= -1;
                            platform.movingToEnd = true;
                        }

                    }

                });

                //Update all the enemies
                //Update enemies
                enemyObjects.forEach(function (enemy) {

                    //Temporary variable for the side-checking enemy
                    var change;

                    //Move differently for different enemies
                    switch (enemy.type) {

                    //A simple enemy that changes direction on a side collision
                    case "a":

                        //If it collided on the left side and are moving left or the opposite way
                        if ((enemy.collidedLeft && enemy.moveLeft) || (enemy.collidedRight && enemy.moveRight)) {

                            //Reverse the direction
                            enemy.moveLeft = !enemy.moveLeft;
                            enemy.moveRight = !enemy.moveRight;

                        }


                        break;

                    //An enemy that only moves side to side and doesn't fall off edges
                    case "b":

                        //If it collided on the left side and are moving left or the opposite way
                        if ((enemy.collidedLeft && enemy.moveLeft) || (enemy.collidedRight && enemy.moveRight)) {

                            //Reverse the direction
                            enemy.moveLeft = !enemy.moveLeft;
                            enemy.moveRight = !enemy.moveRight;

                        }

                        //Check if it would fall off
                        if (!enemy.falling) {

                            //Store the amount that it will move on the x-direction
                            change = 0;

                            //Move it down slightly
                            enemy.y += 5;

                            for (i = 0; i < 4; i += 1) {
                                change += delta * enemy.vx;
                                enemy.x += delta * enemy.vx;

                                //See if it has gone off the edge, if so then reverse direction
                                if (!enemy.collidesBottom(entityCollision)) {

                                    //Reverse the direction
                                    enemy.moveLeft = !enemy.moveLeft;
                                    enemy.moveRight = !enemy.moveRight;

                                    //Stop updating
                                    break;

                                }
                            }

                            //Reset to the initial position
                            enemy.y -= 5;
                            enemy.x -= change;

                        }

                        break;

                    }


                    //Update the physics built in to a game entity
                    enemy.update(delta, entityCollision);

                    //Check collisions with platforms and apply a force if it is
                    platformObjects.forEach(function (platform) {

                        //If the player is on a platform then move along with it
                        if (enemy.collidesBottom(platform.collisionFunction)) {
                            enemy.x += platform.xChange;
                            enemy.y += platform.yChange;
                        }

                    });
                });
            },

            //Render the static objects
            renderObjects = function (ctx) {

                //The laddrs
                ladderObjects.forEach(function (ladder) {

                    if (ladder.tileHeight > 1) {
                        //Draw the top ladder
                        ctx.drawImage(ladderTop, ladder.x, ladder.y, tiledMap.getTileWidth(), tiledMap.getTileHeight());

                        //Draw the middle ladders
                        for (i = 1; i < ladder.tileHeight - 1; i += 1) {
                            ctx.drawImage(ladderMiddle, ladder.x, ladder.y + tiledMap.getTileHeight() * i, tiledMap.getTileWidth(), tiledMap.getTileHeight());
                        }

                        //Draw the bottom ladder
                        ctx.drawImage(ladderBottom, ladder.x, ladder.y + ladder.height - tiledMap.getTileHeight(), tiledMap.getTileWidth(), tiledMap.getTileHeight());

                    } else {
                        ctx.drawImage(ladderMiddle, ladder.x, ladder.y, tiledMap.getTileWidth(), tiledMap.getTileHeight());
                    }
                });

                //Draw the player
                player.render(ctx);

                //Draw all the enemies
                enemyObjects.forEach(function (enemy) {
                    enemy.render(ctx);
                });

                //Render all spikes
                spikeObjects.forEach(function (spike) {
                    for (i = 0; i < spike.tileWidth; i += 1) {
                        ctx.drawImage(spikeImg, spike.x + (tiledMap.getTileWidth() * i), spike.y, tiledMap.getTileWidth(), spike.height);
                    }

                });

                //Render all the lava
                lavaObjects.forEach(function (lava) {
                    ctx.fillStyle = Zamboni.Utils.ColourScheme.PUMPKIN;
                    ctx.fillRect(lava.x, lava.y, lava.width, lava.height);
                });

                //Render all the platforms
                platformObjects.forEach(function (platform) {
                    platform.render(ctx);
                });

            },

            //TEMP
            emitter = Engine.ParticleEmitter.create({
                x: 300,
                y: 700,

                ax: 5,
                ay: 20,

                angle: 10,
                angleVariance: 100,

                speed: 30,

                lifeSpan: 8,

                startColour: Engine.Colour.create(255, 0, 0, 255),
                endColour: Engine.Colour.create(255, 255, 0, 255),

                maxParticles: 60,
                particlesPerSecond: 20
            });

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
                renderObjects(ctx);

                emitter.render(ctx);

                camera.unProjectContext(ctx);
            },

            //Update the world with time delta
            update: function (delta) {

                updateObjects(delta);
                updatePlayer(delta);

                updateCamera(delta);

                emitter.update(delta);

                backgroundManager.update(delta);
            }


        };
    }

};
