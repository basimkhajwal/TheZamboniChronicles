//The needed modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Any sub-modules
Engine.UI = Engine.UI || {};

Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Zamboni.World = Zamboni.World || {};



//The base entity class that will hold the needed variables for a movable entity
Zamboni.World.GameEntity = {

    /*
    *   Create a new empty entity with all the default values
    */
    createEmpty: function (collisionRes) {
        "use strict";

        //Utility function to clamp a value in a specified interval
        var clamp = function (val, min, max) {
            return Math.max(min, Math.min(max, val));
        };

        //How many times to check each side
        collisionRes = collisionRes || Zamboni.Utils.GameSettings.collisionResolution;

        return {

            //The variables for an entity
            //The position
            x: 0,
            y: 0,

            //The size
            width: 20,
            height: 20,

            //The velocity
            vx: 0,
            vy: 0,

            //The acceleration and frictional force in the horizontal directions
            accelForce: 30,
            frictionForce: 20,

            //Acceleration when jumping
            jumpForce: 1500,

            //Render variables
            img: null,
            colour: "#000",

            //Clamp values
            maxVx: 200,
            maxVy: 400,

            //Forces to apply on it
            applyGravity: false,
            gravityForce: 30,

            //States
            moveLeft: false,
            moveRight: false,
            jump: false,
            falling: false,
            jumping: false,
            
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

            //Update the x and y based on the velocity and the delta
            update: function (delta, collisionFunction) {

                //The initial values for the sprite to check for collisions
                var oldX = this.x,
                    oldY = this.y,
                    wasLeft = this.vx < 0,
                    wasRight = this.vx > 0,

                    //The change in velocity (acceleration)
                    ddx = 0,
                    ddy = 0,

                    //The default forces to apply for movement
                    accel = this.accelForce * (this.falling ? 1.0 : 0.5),
                    friction = this.frictionForce * (this.falling ? 0.5 : 1.0),

                    //The collision flags
                    collidedUp,
                    collidedDown,
                    collidedRight,
                    collidedLeft;

                //If gravity is enables for the sprite apply it initially
                if (this.applyGravity) {
                    ddy += this.gravityForce;
                }

                //Add appropritate friction to the sides depending on which direction you are moving
                if (this.moveLeft) {
                    ddx -= accel;
                } else if (wasLeft) {
                    ddx += friction;
                }

                if (this.moveRight) {
                    ddx += accel;
                } else if (wasRight) {
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

                //If there is no collision function then just do a simple update
                if (typeof collisionFunction === "undefined") {

                    //Just move by velocity * delta
                    this.translate(this.vx * delta, this.vy * delta);

                } else {
                    //Otherwise if we do have a collision function do a collision check update
                    //we assume that the current position is free from collision

                    //First move the y by the current velocity
                    this.y += delta * this.vy;

                    //Now check if this new y has collided with anything top or bottom
                    if (this.collidesTop(collisionFunction)) {

                        //If it collided on top then move up until it collides
                        if (this.vy < 0 && (oldY - this.y > 10)) {

                            while (this.collidesTop(collisionFunction)) {
                                this.y += 1;
                            }
                        } else {
                            this.y = oldY;
                        }

                        //Now set the velocity to 0
                        this.vy = 0;

                    } else if (this.collidesBottom(collisionFunction)) {

                        //If it collided on the bottom then set the states
                        this.jumping = false;
                        this.falling = false;

                        //Move down until we collide
                        if (this.vy > 0 && (this.y - oldY > 10)) {

                            while (this.collidesBottom(collisionFunction)) {
                                this.y -= 1;
                            }
                        } else {
                            this.y = oldY;
                        }

                        //Set the velocity back to 0
                        this.vy = 0;

                    } else {
                        //If it didn't collide on top or bottom then the sprite is falling
                        this.falling = true;
                    }
                    
                    this.x += delta * this.vx;

                    collidedLeft = this.collidesLeft(collisionFunction);
                    collidedRight = this.collidesRight(collisionFunction);

                    if (collidedLeft || collidedRight) {



                        if (this.vx !== 0 && (Math.abs(this.x - oldX) > 10)) {

                            if (collidedLeft) {
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

                        this.vx = 0;
                    }
                }
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

            //Returns a function that checks whether a point is within this entity
            getCollisionFunction: function () {
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
                var step = this.height / collisionRes,

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
                var step = this.height / collisionRes,

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
                var step = this.width / collisionRes,

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

                //How much to change each time
                var step = this.width / collisionRes,

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
