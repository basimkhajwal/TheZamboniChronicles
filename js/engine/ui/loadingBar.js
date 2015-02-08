//Use the Engine module and the sub UI module
var Engine = Engine || {};
Engine.UI = Engine.UI || {};


Engine.UI.LoadingBar = {


    create: function (barY, barWidth, barHeight, canvasWidth, barColour) {
        "use strict";

        var barColour = barColour || "#000";
        var canvasWidth = canvasWidth || 1000;
        var barHeight = barHeight || 30;
        var barWidth = barWidth || canvasWidth;
        var barY = barY || 100;

        var currentPercentage = 0;
        var barX = (canvasWidth - barWidth) / 2;

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