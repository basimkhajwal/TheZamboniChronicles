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


    createEmpty: function () {
        "use strict";

        return {

            x: 0,
            y: 0,

            width: 20,
            height: 20,

            vx: 0,
            vy: 0,

            img: null,
            colour: "#000",

            translate: function (dx, dy) {
                this.x += dx;
                this.y += dy;
            },

            accelerate: function (dx, dy) {
                this.vx += dx;
                this.vy += dy;
            },

            update: function (delta) {
                this.x += delta * this.vx;
                this.y += delta * this.vy;
            },

            render: function (ctx) {
                if (this.img !== null) {
                    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
                } else {
                    ctx.fillStyle = this.colour;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }
        };

    }


};
