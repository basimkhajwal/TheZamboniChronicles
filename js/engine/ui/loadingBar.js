//Use the Engine module and the sub UI module
var Engine = Engine || {};
Engine.UI = Engine.UI || {};


Engine.UI.LoadingBar = {


    create: function (bar_Y, bar_Width, bar_Height, canvas_Width, bar_Colour) {
        "use strict";

        var barColour = bar_Colour || "#000",
            canvasWidth = canvas_Width || 1000,
            barHeight = bar_Height || 30,
            barWidth = bar_Width || canvasWidth,
            barY = bar_Y || 100,

            currentPercentage = 0,
            barX = (canvasWidth - barWidth) / 2;

        return {

            render: function (ctx) {
                ctx.fillStyle = barColour;
                ctx.fillRect(barX, barY, barWidth * currentPercentage, barHeight);
            },

            //The getters and setters

            setPercentage: function (p) {
                currentPercentage = p;
            },

            getPercentage: function () {
                return currentPercentage;
            },

            setY: function (y) {
                barY = y;
            },

            getY: function () {
                return barY;
            },

            setX: function (x) {
                barX = x;
            },

            getX: function () {
                return barX;
            },

            setWidth: function (width) {
                barWidth = width;
            },

            getWidth: function () {
                return barWidth;
            },

            setHeight: function (height) {
                barHeight = height;
            },

            getHeight: function () {
                return barHeight;
            },

            setCanvasWidth: function (width) {
                canvasWidth = width;
            },

            getCanvasWidth: function () {
                return canvasWidth;
            },

            setColour: function (colour) {
                barColour = colour;
            },

            getColour: function () {
                return barColour;
            }

        };

    }

};
