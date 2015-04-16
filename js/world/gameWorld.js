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

            //Clamp utility function
            clamp = function (val, min, max) {
                return Math.min(max, Math.max(val, min));
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

            //Holds the details about the world
            worldDescriptor = {

                //The dimensions of the world (to be set)
                worldWidth: 0,
                worldHeight: 0,

                //The tiled map for the background
                tiledMap: null,

                //The settings for the camera
                minCameraX: 0,
                minCameraY: 0,

                //How much the camera moved in an update
                cameraChangeX: 0,
                cameraChangeY: 0,

                //To be set when the tiled map is created
                maxCameraX: null,
                maxCameraY: null,

                //The total collision functions for entities, the array of the functions and the final one
                entityCollisions: [],
                entityCollision: null,

                //Like wise for enemy
                enemyCollisions: [],
                enemyCollision: null,

                //Ladder collisions
                ladderCollisions: [],
                ladderCollision: null,

                //The tiled maps collision function
                tiledCollision: null,

                //The camera for viewing the world (in the eyes of the player)
                camera: Engine.Camera.create(0, 0, 0),

                //The player entity
                player: null,

                //An array to hold all their respective objects
                enemyObjects: [],
                coinObjects: [],
                lavaObjects: [],
                platformObjects: [],
                spikeObjects: [],
                brickObjects: [],
                ladderObjects: []

            },

            //A player descriptor to hold values about the player
            playerDescriptor = {

                coinsCollected: 0,

                isDead: 0


            },

            //The images for quick access
            spikeImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.SPIKES),
            ladderBottom = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LADDER_BOTTOM),
            ladderMiddle = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LADDER_MIDDLE),
            ladderTop = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.LADDER_TOP),

            //Animations
            coinAnimation = Engine.Animation.create([
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_1),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_2),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_3),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_4),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_5),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_6),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.COIN_7)
            ], 0.07, false),

            //Parse a new level from a given string
            parseLevel = function (fileText) {

                //Parse into the world descriptor
                Zamboni.World.LevelParser.parseLevel(fileText, worldDescriptor);

                //Generate the background
                Zamboni.World.BackgroundManager.create(worldDescriptor);

                //Get the collision function
                worldDescriptor.tiledCollision = worldDescriptor.tiledMap.isCellBlocked;
                worldDescriptor.entityCollisions.push(worldDescriptor.tiledMap.generateCollisionFunction());

                //Merge the collision functions all into one
                worldDescriptor.entityCollision = mergeAllCollisions(worldDescriptor.entityCollisions);
                worldDescriptor.ladderCollision = mergeAllCollisions(worldDescriptor.ladderCollisions);
                worldDescriptor.enemyCollision = mergeAllCollisions(worldDescriptor.enemyCollisions);
            },

            //The updating stuff
            updatePlayer = function (delta) {

                //If any movement keys have been pressed set the movement pace
                worldDescriptor.player.moveRight = (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("D")));
                worldDescriptor.player.moveLeft = (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("A")));
                worldDescriptor.player.jump = (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W")));

                //Move player down by 10 because no collisions normally occur
                worldDescriptor.player.y += 5;

                //Check collisions with platforms and apply a force if it is
                worldDescriptor.platformObjects.forEach(function (platform) {

                    //If the player is on a platform then move along with it
                    if (worldDescriptor.player.collidesBottom(platform.collisionFunction)) {
                        worldDescriptor.player.x += platform.xChange;
                        worldDescriptor.player.y += platform.yChange;
                    }

                });

                //Return the player back to its original y value
                worldDescriptor.player.y -= 5;

                //Check collisions with ladders only on left and right so the player can jump on ladders
                if (worldDescriptor.player.collidesLeft(worldDescriptor.ladderCollision) || worldDescriptor.player.collidesRight(worldDescriptor.ladderCollision)) {

                    //Stop forces
                    worldDescriptor.player.applyGravity = false;

                    //Dont allow the player to jump if the head hits the ladder
                    if (worldDescriptor.player.collidesTop(worldDescriptor.ladderCollision)) {
                        worldDescriptor.player.jump = false;

                        //Set the initial velocity to 0 because the friction is very high
                        worldDescriptor.player.vy = 0;
                    } else if (!worldDescriptor.player.jumping) {
                        //Set the initial velocity to 0 because the friction is very high
                        worldDescriptor.player.vy = 0;
                    }

                    //Move up if up is pressed
                    if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("W"))) {
                        worldDescriptor.player.applyForce(0, -100);
                    }

                    //Move down if down is pressed
                    if (Engine.KeyboardInput.isKeyDown(Engine.Keys.getAlphabet("S"))) {
                        worldDescriptor.player.applyForce(0, 100);
                    }

                } else {

                    //Reset to default settings
                    worldDescriptor.player.applyGravity = true;
                }

                var fallingBefore = worldDescriptor.player.falling;

                //Update the player physics
                worldDescriptor.player.update(delta, worldDescriptor.entityCollision);

                //If the player moved enough and isnt falling and a random chance then emit some particles
                if (!worldDescriptor.player.falling && worldDescriptor.player.xChange > 20 * delta && Math.random() > 0.9) {

                    Zamboni.World.ParticleEmitters.groundEmitter.setPosition(worldDescriptor.player.x + (worldDescriptor.player.width / 2),
                                                                             worldDescriptor.player.y + worldDescriptor.player.height);

                    Zamboni.World.ParticleEmitters.groundEmitter.emitParticle();
                }

                if (fallingBefore && !worldDescriptor.player.falling && worldDescriptor.player.yChange > 10 * delta) {

                    Zamboni.World.ParticleEmitters.groundEmitter.setPosition(worldDescriptor.player.x + (worldDescriptor.player.width / 2),
                                                                             worldDescriptor.player.y + worldDescriptor.player.height);

                    for (i = 0; i < 3; i += 1) {
                        Zamboni.World.ParticleEmitters.groundEmitter.emitParticle();
                    }
                }
            },

            updateCamera = function (delta) {

                //Save the old position
                var oldCameraX = worldDescriptor.camera.getX(),
                    oldCameraY = worldDescriptor.camera.getY();

                //Update the camera position
                worldDescriptor.camera.setX((worldDescriptor.player.x + worldDescriptor.player.width / 2) - Zamboni.Utils.GameSettings.playerScreenX);
                worldDescriptor.camera.setY((worldDescriptor.player.y + worldDescriptor.player.height / 2) - Zamboni.Utils.GameSettings.playerScreenY);

                //Clamp the values
                worldDescriptor.camera.setX(clamp(worldDescriptor.camera.getX(), worldDescriptor.minCameraX, worldDescriptor.maxCameraX));
                worldDescriptor.camera.setY(clamp(worldDescriptor.camera.getY(), worldDescriptor.minCameraY, worldDescriptor.maxCameraY));

                //Update the change variables
                worldDescriptor.cameraChangeX = worldDescriptor.camera.getX() - oldCameraX;
                worldDescriptor.cameraChangeY = worldDescriptor.camera.getY() - oldCameraY;
            },

            //Update the static objects in the level
            updateObjects = function (delta) {

                //Update all the platforms
                worldDescriptor.platformObjects.forEach(function (platform) {

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
                worldDescriptor.enemyObjects.forEach(function (enemy) {

                    //Temporary variable for the side-checking enemy
                    var oldX;

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
                            oldX = enemy.x;

                            //Move it down slightly
                            enemy.y += 5;

                            for (i = 0; i < 5; i += 1) {
                                enemy.x += 2 * delta * enemy.vx;

                                //See if it has gone off the edge, if so then reverse direction
                                if (!enemy.collidesBottom(worldDescriptor.entityCollision)) {

                                    //Reverse the direction
                                    enemy.moveLeft = !enemy.moveLeft;
                                    enemy.moveRight = !enemy.moveRight;

                                    //Stop updating
                                    break;

                                }
                            }

                            //Reset to the initial position
                            enemy.y -= 5;
                            enemy.x = oldX;

                        }

                        break;

                    }


                    //Update the physics built in to a game entity
                    enemy.update(delta, worldDescriptor.entityCollision);

                    //Check collisions with platforms and apply a force if it is
                    worldDescriptor.platformObjects.forEach(function (platform) {

                        //If the player is on a platform then move along with it
                        if (enemy.collidesBottom(platform.collisionFunction)) {
                            enemy.x += platform.xChange;
                            enemy.y += platform.yChange;
                        }

                    });
                });

                //Update the animations for the coins
                if (coinAnimation.isFinished() && Math.random() < 0.015) {
                    coinAnimation.restart();
                }

                coinAnimation.update(delta);

                //Update all the lava objects and the emitter used for them
                worldDescriptor.lavaObjects.forEach(function (lava) {




                });
            },

            //Render the static objects
            renderObjects = function (ctx) {

                //The laddrs
                worldDescriptor.ladderObjects.forEach(function (ladder) {

                    if (ladder.tileHeight > 1) {
                        //Draw the top ladder
                        ctx.drawImage(ladderTop, ladder.x, ladder.y, worldDescriptor.tiledMap.getTileWidth(), worldDescriptor.tiledMap.getTileHeight());

                        //Draw the middle ladders
                        for (i = 1; i < ladder.tileHeight - 1; i += 1) {
                            ctx.drawImage(ladderMiddle, ladder.x, ladder.y + worldDescriptor.tiledMap.getTileHeight() * i, worldDescriptor.tiledMap.getTileWidth(), worldDescriptor.tiledMap.getTileHeight());
                        }

                        //Draw the bottom ladder
                        ctx.drawImage(ladderBottom, ladder.x, ladder.y + ladder.height - worldDescriptor.tiledMap.getTileHeight(), worldDescriptor.tiledMap.getTileWidth(), worldDescriptor.tiledMap.getTileHeight());

                    } else {
                        ctx.drawImage(ladderMiddle, ladder.x, ladder.y, worldDescriptor.tiledMap.getTileWidth(), worldDescriptor.tiledMap.getTileHeight());
                    }
                });

                //Draw the player
                worldDescriptor.player.render(ctx);

                //Draw the particles for the player
                Zamboni.World.ParticleEmitters.groundEmitter.render(ctx);

                //Draw all the enemies
                worldDescriptor.enemyObjects.forEach(function (enemy) {
                    enemy.render(ctx);
                });

                //Render all spikes
                worldDescriptor.spikeObjects.forEach(function (spike) {
                    for (i = 0; i < spike.tileWidth; i += 1) {
                        ctx.drawImage(spikeImg, spike.x + (worldDescriptor.tiledMap.getTileWidth() * i), spike.y, worldDescriptor.tiledMap.getTileWidth(), spike.height);
                    }

                });

                //Render all the lava
                worldDescriptor.lavaObjects.forEach(function (lava) {
                    ctx.fillStyle = Zamboni.Utils.ColourScheme.PUMPKIN;
                    ctx.fillRect(lava.x, lava.y, lava.width, lava.height);

                    ctx.strokeStyle = Zamboni.Utils.ColourScheme.ORANGE;
                    ctx.lineWidth = 3;

                    ctx.beginPath();
                    ctx.moveTo(lava.x, lava.y);
                    ctx.lineTo(lava.x + lava.width, lava.y);
                    ctx.closePath();
                    ctx.stroke();
                });

                //Render all the platforms
                worldDescriptor.platformObjects.forEach(function (platform) {
                    platform.render(ctx);
                });

                //Draw all the coins
                worldDescriptor.coinObjects.forEach(function (coin) {
                    ctx.drawImage(coinAnimation.getCurrentFrame(), coin.x, coin.y, coin.width, coin.height);
                });
            };

        //Parse the level - TODO
        parseLevel(Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.levels.TEST2));

        //Return all the public methods and variables
        return {

            //Render the world on the context ctx
            render: function (ctx) {
                //Set and clear the background colour
                ctx.fillStyle = Zamboni.Utils.ColourScheme.BACKGROUND_COLOUR;
                ctx.fillRect(0, 0, 1000, 600);

                worldDescriptor.camera.projectContext(ctx);

                Zamboni.World.BackgroundManager.render(ctx);
                worldDescriptor.tiledMap.render(ctx, worldDescriptor.camera.getX(), worldDescriptor.camera.getX() + 1000, worldDescriptor.camera.getY(), worldDescriptor.camera.getY() + 600);

                renderObjects(ctx);

                worldDescriptor.camera.unProjectContext(ctx);
            },

            //Update the world with time delta
            update: function (delta) {

                updateObjects(delta);
                updatePlayer(delta);
                updateCamera(delta);

                Zamboni.World.BackgroundManager.update(delta);
                Zamboni.World.ParticleEmitters.update(delta);
            }


        };
    }

};
