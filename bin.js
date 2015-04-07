/*
*   This is where all the old code goes that could be re-used

     Create a new tiled map for the level
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

,
            //An array to hold all their respective objects
            //enemyObjects = [],
            //lavaObjects = [],
            //platformObjects = [],
            //spikeObjects = [],
            //ladderObjects = [],

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

//Parse a new player from the JSON object
            parsePlayer = function (playerObj) {

                //Create a new game entity for the player
                var player = Engine.GameEntity.createEmpty();

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
                    tileHeight: Math.ceil(ladderObj.height / tiledMap.getTileHeight())

                };

                //Push a new ladder to the current ladder list
                ladderObjects.push(ladder);

                //Add the collision function for this ladder
                ladderCollisions.push(function (x, y) {
                    return x >= ladder.x && x <= ladder.x + ladder.width && y >= ladder.y && y <= ladder.y + ladder.height;
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





                    //The steps to move in each direction if a collision occured
                    stepX,
                    stepY,

                    //If the sprite collides keep the new moved positions
                    newX,
                    newY;



this.y += this.vy * delta;

                    //Set the flags
                    this.collidedUp = this.collidesTop(collisionFunction);
                    this.collidedDown = this.collidesBottom(collisionFunction);

                    this.x += this.vx * delta;

                    this.collidedLeft = this.collidesLeft(collisionFunction);
                    this.collidedRight = this.collidesRight(collisionFunction);

                    if (this.collidedUp || this.collidedLeft || this.collidedDown || this.collidedRight) {

                        stepX = (this.x - oldX) / this.collisionSteps;
                        stepY = (this.y - oldY) / this.collisionSteps;

                        if (this.collidedUp || this.collidedDown) {
                            this.vy = 0;

                            if (this.collidedDown) {
                                this.jumping = false;
                                this.falling = false;
                            }

                            do {
                                this.y -= stepY;
                            } while (this.collidesBottom(collisionFunction) || this.collidesTop(collisionFunction));

                        }


                        if (this.collidedLeft || this.collidedRight) {
                            this.vx = 0;

                            do {
                                this.x -= stepX;
                            } while (this.collidesLeft(collisionFunction) || this.collidesRight(collisionFunction));
                        }

                        if ((this.vx > 0 && this.x < oldX) || (this.vx < 0 && this.x > oldX)) {
                            this.x = oldX;
                        }

                        if ((this.vy > 0 && this.y < oldY) || (this.vy < 0 && this.y > oldY)) {
                            this.y = oldY;
                        }
                    } else {
                        this.falling = true;
                    }




            //How many iterations to trace ray by each time
            collisionSteps: 25,

                        //Iterative update approach - OLD BECAUSE OF SOME BUGS THAT DIDNT WORK!!
            updateIter: function (delta, collisionFunction) {

                //Keep the total change(s) and the collisions
                var oldX = this.x,
                    oldY = this.y,

                    //The collision markers
                    anyCollisionLeft = false,
                    anyCollisionRight = false,
                    anyCollisionTop = false,
                    anyCollisionBottom = false;


                //If frame rate is less than specified amount then update at intervals instead
                while (delta > 0.018) {
                    //Update normally
                    this.tickUpdate(0.018, collisionFunction, oldX, oldY);

                    //Add to collisions
                    anyCollisionLeft = anyCollisionLeft || this.collidedLeft;
                    anyCollisionRight = anyCollisionRight || this.collidedRight;
                    anyCollisionTop = anyCollisionTop || this.collidedUp;
                    anyCollisionBottom = anyCollisionBottom || this.collidedDown;

                    //Min 0.018 from delta (what we just updated) and iterate if theres more left
                    delta -= 0.018;
                }

                //Update remaining delta
                this.tickUpdate(delta, collisionFunction, oldX, oldY);

                //Update change variables
                this.xChange = this.x - oldX;
                this.yChange = this.y - oldY;

                //Update collision markers
                this.collidedDown = anyCollisionBottom;
                this.collidedLeft = anyCollisionLeft;
                this.collidedRight = anyCollisionRight;
                this.collidedLeft = anyCollisionLeft;
            },



*/
