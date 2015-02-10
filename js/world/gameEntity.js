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

            //The acceleration
            ax: 0,
            ay: 0,

            //The impulse
            ix: 0,
            iy: 0,

            //Render variables
            img: null,
            colour: "#000",

            //The mass of the object
            mass: 1,

            //Forces to apply on it
            applyGravity: false,
            gravityForce: Zamboni.Utils.GameSettings.gravityForce,

            //Change the position by a certain amount
            translate: function (dx, dy) {
                this.x += dx;
                this.y += dy;
            },

            //Change the velocity by a certain amount
            accelerate: function (dx, dy) {
                this.vx += dx;
                this.vy += dy;
            },

            //Apply a force on it
            applyForce: function (fx, fy) {
                this.ax += fx / this.mass;
                this.ay += fy / this.mass;
            },

            //Update the x and y based on the velocity and the delta
            update: function (delta, collisionFunction) {

                if (typeof collisionFunction === "undefined") {
                    this.accelerate(this.ax * delta, this.ay * delta);
                    this.translate(this.vx * delta, this.vy * delta);

                } else {

                    var oldX = this.x,
                        oldY = this.y;

                    this.y += delta * this.vy;

                    if (this.collidesTop(collisionFunction) || this.collidesBottom(collisionFunction)) {
                        this.y = oldY;
                        this.vy = 0;
                    }
                    
                    this.x += delta * this.vx;

                    if (this.collidesLeft(collisionFunction) || this.collidesRight(collisionFunction)) {
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
