//Use the Engine module and the sub UI module
var Engine = Engine || {};
Engine.UI = Engine.UI || {};

//Create the module
Engine.UI.TextButton = {


    create: function (buttonX, buttonY, buttonWidth, buttonHeight, textString) {
        "use strict";

        //The default values
        var clicked = false;
        var mouseOver = false;

        var buttonColour = "#000";
        var hoverColour = "#666";
        var clickColour = "#222";

        var cornerRadius = 0;

        //Private stuff
        var text = Engine.UI.TextArea.create(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, textString);
        text.setColour("#FFF");
        text.setBaseline("middle");

        var update = function () {

            var mousePos = Engine.MouseInput.getMousePos();

            if (mousePos.x > buttonX && mousePos.x < buttonX + buttonWidth && mousePos.y > buttonY && mousePos.y < buttonY + buttonWidth) {
                mouseOver = true;
                clicked = Engine.MouseInput.isMouseDown();
            }

        };

        //The public stuff
        return {

            render: function (ctx) {
                update();

                if (clicked) {
                    ctx.fillStyle = clickColour;
                } else if (mouseOver) {
                    ctx.fillStyle = hoverColour;
                } else {
                    ctx.fillStyle = buttonColour;
                }

                Engine.DrawTools.roundRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, cornerRadius, true, false);
            },

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
            },

            setColour: function (colour) {
                buttonColour = colour;
            },

            getColour: function () {
                return buttonColour;
            },

            setHoverColour: function (colour) {
                hoverColour = colour;
            },

            getHoverColour: function () {
                return hoverColour;
            },

            setClickColour: function (colour) {
                clickColour = colour;
            },

            getClickColour: function () {
                return clickColour;
            },

            setTextColour: function (colour) {
                text.setColour(colour);
            },

            getTextColour: function () {
                return text.getColour();
            },

            setFont: function (font) {
                text.setFamily(font);
            },

            getFont: function () {
                return text.getFamily();
            },

            setCornerRadius: function (radius) {
                cornerRadius = radius;
            },

            getCornerRadius: function () {
                return cornerRadius;
            },

            isClicked: function () {
                return clicked;
            },

            isMouseOver: function () {
                return mouseOver;
            }
        };

    }

};
