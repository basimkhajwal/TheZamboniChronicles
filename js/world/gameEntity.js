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
            x: 0,
            y: 0,
            width: 20,
            height: 20,
            vx: 0,
            vy: 0,
            img: null,
            colour: "#000",

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

            //Update the x and y based on the velocity and the delta
            update: function (delta, collisionFunction) {

                if (typeof collisionFunction === "undefined") {
                    this.x += delta * this.vx;
                    this.y += delta * this.vy;
                } else {

                    var oldX = this.x,
                        oldY = this.y,
                        collided = false;

                    this.x += delta * this.vx;
                    this.y += delta * this.vy;

                    if (this.collidesTop(collisionFunction) || this.collidesBottom(collisionFunction)) {
                        this.y = oldY;
                        this.vy = 0;

                        collided = true;
                    }

                    if (!collided && (this.collidesLeft(collisionFunction) || this.collidesRight(collisionFunction))) {
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
