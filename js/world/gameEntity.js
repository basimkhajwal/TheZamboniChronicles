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

                this.vx = clamp(this.vx, -this.maxVx, this.maxVx);
                this.vy = clamp(this.vy, -this.maxVy, this.maxVy);
            },

            //Update the x and y based on the velocity and the delta
            update: function (delta, collisionFunction) {

                if (typeof collisionFunction === "undefined") {
                    this.translate(this.vx * delta, this.vy * delta);
                } else {

                    var oldX = this.x,
                        oldY = this.y,
                        wasLeft = this.vx < 0,
                        wasRight = this.vx > 0,
                        ddx = 0,
                        ddy = 0,
                        accel = this.accelForce * (this.falling ? 1.0 : 0.5),
                        friction = this.frictionForce * (this.falling ? 0.5 : 1.0);

                    if (this.applyGravity) {
                        ddy = this.gravityForce;
                    }

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

                    this.accelerate(ddx, ddy);

                    if ((wasLeft  && (this.vx > 0)) || (wasRight && (this.vx < 0))) {
                        this.vx = 0;
                    }

                    if (this.jump && !this.jumping) {
                        this.vy -= this.jumpForce;
                        this.jumping = true;
                    }

                    this.y += delta * this.vy;

                    if (this.collidesTop(collisionFunction)) {
                        this.y = oldY;
                        this.vy = 0;
                    } else if (this.collidesBottom(collisionFunction)) {

                        this.jumping = false;
                        this.falling = false;

                        if (this.vy > 0 && (this.y - oldY > 10)) {

                            while (this.collidesBottom(collisionFunction)) {
                                this.y -= 1;
                            }
                        } else {
                            this.y = oldY;
                        }

                        this.vy = 0;
                    } else {
                        this.falling = true;
                    }
                    
                    this.x += delta * this.vx;

                    if ((this.vx < 0 && this.collidesLeft(collisionFunction)) || (this.vx > 0 && this.collidesRight(collisionFunction))) {
                        this.x = oldX;
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
