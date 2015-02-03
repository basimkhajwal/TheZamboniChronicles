//Use the Engine module and the sub UI module
var Engine = Engine || {};
Engine.UI = Engine.UI || {};

//Create the module
Engine.UI.TextArea = {


    create: function (buttonX, buttonY, buttonWidth, buttonHeight, text) {
        "use strict";

        //The default values
        var buttonColour = "#000";
        var hoverColour = "#666";
        var clickColour = "#222";

        //The public stuff
        return {


            //The getters and setters
            setX: function (x) {
                buttonX = x;
            },

            getX: function () {
                return buttonX;
            },

            setY: function (y) {
                buttonY = y;
            },

            getY: function () {
                return buttonY;
            },

            setWidth: function (width) {
                buttonWidth = width;
            },

            getWidth: function () {
                return buttonWidth;
            },

            setHeight: function (height) {
                buttonHeight = height;
            },

            getHeight: function () {
                return buttonHeight;
            }

        };

    }

};
