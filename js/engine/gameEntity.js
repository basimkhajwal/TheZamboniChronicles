//The needed modules
var Engine = Engine || {};

//Any sub-modules
Engine.UI = Engine.UI || {};

//The base entity class that will hold the needed variables for a movable entity
Engine.GameEntity = {

    /*
    *   Create a new empty entity with all the default values
    */
    createEmpty: function () {
        "use strict";

        //Utility function to clamp a value in a specified interval
        var clamp = function (val, min, max) {
            return Math.max(min, Math.min(max, val));
        };

        return {

            //-------------------------------- The variables for an entity ---------------------------------
            //The position
            x: 0,
            y: 0,

            //The size
            width: 20,
            height: 20,

            //The velocity
            vx: 0,
            vy: 0,

            //The collision resolution (how many to check per side)
            collisionRes: 4,

            //The acceleration and frictional force in the horizontal directions
            accelForce: 80,
            frictionForce: 60,

            //Acceleration when jumping
            jumpForce: 1500,

            //Render variables
            img: null,
            colour: "#000",

            //Clamp values
            maxVx: 200,
            maxVy: 600,

            //Forces to apply on it
            applyGravity: false,
            applyFriction: true,
            gravityForce: 50,

            //States
            moveLeft: false,
            moveRight: false,
            jump: false,
            falling: false,
            jumping: false,

            //The collision flags
            collidedUp: false,
            collidedDown: false,
            collidedRight: false,
            collidedLeft: false,

            //The force to apply in a tick
            impulseX: 0,
            impulseY: 0,


            //The amount it changed in a tick
            xChange: 0,
            yChange: 0,

            // -------------------------------- Util Functions ---------------------------------------

            //Change the position by a certain amount
            translate: function (dx, dy) {
                this.x += dx;
                this.y += dy;
            },

            //Change the velocity by a certain amount
            accelerate: function (dx, dy) {
                this.vx += dx;
                this.vy += dy;

                //Make sure that the new velocity is in the range for this sprite
                this.vx = clamp(this.vx, -this.maxVx, this.maxVx);
                this.vy = clamp(this.vy, -this.maxVy, this.maxVy);
            },

            //Apply a force
            applyForce: function (fx, fy) {
                this.impulseX += fx;
                this.impulseY += fy;
            },

            // ------------------------------ Updating & Rendering ---------------------------------------

            //Update the x and y based on the velocity and the delta
            update: function (deltaRaw, collisionFunction) {

                //The initial values for the sprite to check for collisions
                var oldX = this.x,
                    oldY = this.y,
                    wasLeft = this.vx < 0,
                    wasRight = this.vx > 0,

                    //The change in velocity (acceleration)
                    ddx = this.impulseX,
                    ddy = this.impulseY,

                    //The default forces to apply for movement
                    accel = this.accelForce * (this.falling ? 0.5 : 1.0),
                    friction = this.frictionForce * (this.falling ? 1.0 : 0.5),

                    //Iterative move to avoid falling through tiles
                    currentDelta = deltaRaw,
                    delta = 0.018;



                //If there is no collision function then just do a simple update
                if (typeof collisionFunction === "undefined") {

                    //If gravity is enabled for the sprite and it is falling apply it initially
                    if (this.applyGravity && this.falling) {
                        ddy += this.gravityForce;
                    }

                    //Add appropritate friction to the sides depending on which direction you are moving
                    if (this.moveLeft) {
                        ddx -= accel;
                    } else if (wasLeft && this.applyFriction) {
                        ddx += friction;
                    }

                    if (this.moveRight) {
                        ddx += accel;
                    } else if (wasRight && this.applyFriction) {
                        ddx -= friction;
                    }

                    //If the jump command has just been called then apply a single large impulse
                    if (this.jump && !this.jumping) {
                        ddy -= this.jumpForce;

                        this.jumping = true;
                    }

                    //Accelerate by delta * 60 so that we dont have to change other values
                    this.accelerate(ddx * deltaRaw * 60, ddy * deltaRaw * 60);

                    //To prevent the sprite from moving backwards from friction
                    if ((wasLeft  && (this.vx > 0)) || (wasRight && (this.vx < 0))) {
                        this.vx = 0;
                    }

                    //Just move by velocity * delta
                    this.translate(this.vx * deltaRaw, this.vy * deltaRaw);

                } else {

                    while (currentDelta > 0) {
                        delta  = Math.min(delta, currentDelta);

                        //If gravity is enabled for the sprite and it is falling apply it initially
                        if (this.applyGravity && this.falling) {
                            ddy += this.gravityForce;
                        }

                        //Add appropritate friction to the sides depending on which direction you are moving
                        if (this.moveLeft) {
                            ddx -= accel;
                        } else if (wasLeft && this.applyFriction) {
                            ddx += friction;
                        }

                        if (this.moveRight) {
                            ddx += accel;
                        } else if (wasRight && this.applyFriction) {
                            ddx -= friction;
                        }

                        //If the jump command has just been called then apply a single large impulse
                        if (this.jump && !this.jumping) {
                            ddy -= this.jumpForce;

                            this.jumping = true;
                        }

                        //Accelerate by delta * 60 so that we dont have to change other values
                        this.accelerate(ddx * delta * 60, ddy * delta * 60);

                        //To prevent the sprite from moving backwards from friction
                        if ((wasLeft  && (this.vx > 0)) || (wasRight && (this.vx < 0))) {
                            this.vx = 0;
                        }

                        //Check if we have already collided then move along until we don't
                        while (this.collidesBottom(collisionFunction)) {
                            this.y -= 1;
                        }

                        //Otherwise if we do have a collision function do a collision check update
                        //we assume that the previous position is free from collision

                        //First move the y by the current velocity
                        this.y += delta * this.vy;

                        //Check if a collision occured vertically and set the flags
                        this.collidedUp = this.collidesTop(collisionFunction);
                        this.collidedDown = this.collidesBottom(collisionFunction);

                        //Check if either side collided
                        if (this.collidedDown || this.collidedUp) {

                            if (this.collidedDown) {
                                //If it collided on the bottom then set the states
                                this.jumping = false;
                                this.falling = false;
                            }

                            //If it collides then move up until it doesn't collide
                            if (this.vy !== 0 && Math.abs(oldY - this.y) > 5) {


                                if (this.collidedDown) {
                                    while (this.collidesBottom(collisionFunction)) {
                                        this.y -= 1;
                                    }
                                } else {
                                    while (this.collidesTop(collisionFunction)) {
                                        this.y += 1;
                                    }
                                }

                            } else {
                                this.y = oldY;
                            }

                            //Now set the velocity to 0
                            this.vy = 0;

                        } else {
                            //If it didn't collide on top or bottom then the sprite is falling
                            this.falling = true;
                        }

                        //Move along x by vx and delta
                        this.x += delta * this.vx;

                        //Check for horizontal collisions
                        this.collidedLeft = this.collidesLeft(collisionFunction);
                        this.collidedRight = this.collidesRight(collisionFunction);

                        //If any did occure
                        if (this.collidedLeft || this.collidedRight) {

                            //To prevent wobbling at collision boundaries
                            if (this.vx !== 0 && (Math.abs(this.x - oldX) > 10)) {

                                //Move the specified direction that we collided
                                if (this.collidedLeft) {
                                    while (this.collidesLeft(collisionFunction)) {
                                        this.x += 1;
                                    }
                                } else {
                                    while (this.collidesRight(collisionFunction)) {
                                        this.x -= 1;
                                    }
                                }

                            } else {
                                this.x = oldX;
                            }

                            //Now don't move along anymore
                            this.vx = 0;
                        }

                        currentDelta -= delta;
                    }
                }

                //Set the impulse to 0 after using it
                this.impulseX = 0;
                this.impulseY = 0;

                //Update the change variables
                this.xChange = this.x - oldX;
                this.yChange = this.y - oldY;
            },

            //Draw the image or a solid colour at the entity's position
            render: function (ctx) {
                if (this.img !== null) {
                    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
                } else {
                    ctx.fillStyle = this.colour;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            },


            // ----------------------- The collision section ----------------------------

            //Returns a function that checks whether a point is within this entity
            generateCollisionFunction: function () {
                //Keep a variable for the outer object to be used as a closure
                var that = this;

                //The collision function
                return function (x, y) {
                    return (x >= that.x && x <= that.x + that.width && y >= that.y && y <= that.y + that.height);
                };
            },

            //Check if the left side collides with the respective collision function
            collidesLeft: function (collisionFunc) {

                //How much to change each time
                var step = this.height / this.collisionRes,

                    //The counter variable
                    i;

                //Check over collisionRes times on the side
                for (i = this.y; i <= this.y + this.height; i += step) {
                    //If the point collides then return true
                    if (collisionFunc(this.x, i)) {
                        return true;
                    }
                }

                //No collision occurred
                return false;
            },

            //Check if the right side collides with the respective collision function
            collidesRight: function (collisionFunc) {

                //How much to change each time
                var step = this.height / this.collisionRes,

                    //The counter variable
                    i;

                //Check over collisionRes times on the side
                for (i = this.y; i <= this.y + this.height; i += step) {
                    //If the point collides then return true
                    if (collisionFunc(this.x + this.width, i)) {
                        return true;
                    }
                }

                //No collision occurred
                return false;
            },


            //Check if the top side collides with the respective collision function
            collidesTop: function (collisionFunc) {

                //How much to change each time
                var step = this.width / this.collisionRes,

                    //The counter variable
                    i;

                //Check over collisionRes times on the side
                for (i = this.x; i <= this.x + this.width; i += step) {
                    //If the point collides then return true
                    if (collisionFunc(i, this.y)) {
                        return true;
                    }
                }

                //No collision occurred
                return false;
            },


            //Check if the bottom side collides with the respective collision function
            collidesBottom: function (collisionFunc) {
                //console.log("Called " + this);
                //How much to change each time
                var step = this.width / this.collisionRes,

                    //The counter variable
                    i;

                //Check over collisionRes times on the side
                for (i = this.x; i <= this.x + this.width; i += step) {
                    //If the point collides then return true
                    if (collisionFunc(i, this.y + this.height)) {
                        return true;
                    }
                }

                //No collision occurred
                return false;
            },

            //Check if the object collides with a given collision function
            collides: function (collisionFunc) {
                return this.collidesBottom(collisionFunc) || this.collidesTop(collisionFunc) || this.collidesLeft(collisionFunc) || this.collidesRight(collisionFunc);
            }

        };

    }


};
