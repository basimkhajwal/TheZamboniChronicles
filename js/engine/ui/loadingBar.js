//Use the Engine module
var Engine = Engine || {};

//Use the UI submodule
Engine.UI = Engine.UI || {};

/*
*   A loading bar utility class that holds a percentage of a bar
*   to draw and has a render method to draw it correcly
*/
Engine.UI.LoadingBar = {

    /*
    *   Create a new loading bar with the given properties (not all are compulsory for initialisation)
    */
    create: function (barY, barWidth, barHeight, canvasWidth, barColour) {
        "use strict";

        //Set the variable default values if not already set
        barColour = barColour || "#000";
        canvasWidth = canvasWidth || 1000;
        barHeight = barHeight || 30;
        barWidth = barWidth || canvasWidth;
        barY = barY || 100;

        //The percentage of the bar that is done (initially 0)
        var currentPercentage = 0,

            //The position
            barX = (canvasWidth - barWidth) / 2;

        //Return the public closure methdos
        return {

            //Render the loading bar on the canvas context provided
            render: function (ctx) {
                //Set the colour
                ctx.fillStyle = barColour;

                //Draw the rectangle
                ctx.fillRect(barX, barY, barWidth * currentPercentage, barHeight);
            },

            // ------------------ The Getters & Setters ----------------------------

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
