var Engine = Engine || {};

Engine.TextArea = {

    create: function (x, y, text, colour, family, align, variant) {
        "use strict";

        colour = colour || "#000";
        family = family || "arial";
        align = align || "center";
        variant = variant || "normal";

        return {


            render: function (context) {



            },

            setVariant: function (newVariant) {
                variant = newVariant;
            },

            getVariant: function () {
                return variant;
            },

            setFamily: function (newFamily) {
                family = newFamily;
            },

            getFamily: function () {
                return family;
            },

            setAlign: function (newAlign) {
                align = newAlign;
            },

            getAlign: function () {
                return align;
            },

            setColour: function (newColour) {
                colour = newColour;
            },

            getColour: function () {
                return colour;
            },

            setX: function (newX) {
                x = newX;
            },

            getX: function () {
                return x;
            },

            setY: function (newY) {
                y = newY;
            },

            getY: function () {
                return y;
            }

        };

    }


};
