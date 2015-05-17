//Use the Engine module and the sub UI module
var Engine = Engine || {};
Engine.UI = Engine.UI || {};

//Create the module
Engine.UI.TextArea = {

    /*
    *   Create a new text area with the settings, only x,y and text are mandatory
    *   others can be added or will be set to default value.
    */
    create: function (x, y, text, size, colour, family, weight, style, align, variant, baseline) {
        "use strict";

        //All the private variables for the closure to use
        size = size || 12;
        colour = colour || "#000";
        family = family || "arial";
        weight = weight || "normal";
        style = style || "normal";
        align = align || "center";
        variant = variant || "normal";
        baseline = baseline || "bottom";

        //The closure that will contain the public methods
        return {

            //Render the text onto the context with the current state set
            render: function (ctx) {
                //Put all the values in the correct order
                ctx.font = style + " " + variant + " " + weight + " " + size + "px " + family;

                //Set the align, colour and baseline
                ctx.textAlign = align;
                ctx.fillStyle = colour;
                ctx.textBaseline = baseline;

                //Draw the text at the current position
                ctx.fillText(text, x, y);
            },

            //All the getter and setter functions, self documenting
            setText: function (newText) {
                text = newText;
            },

            getText: function () {
                return text;
            },

            setBaseline: function (newBaseline) {
                baseline = newBaseline;
            },

            getBaseline: function () {
                return baseline;
            },

            setWeight: function (newWeight) {
                weight = newWeight;
            },

            getWeight: function () {
                return weight;
            },

            setStyle: function (newStyle) {
                style = newStyle;
            },

            getStyle: function () {
                return style;
            },

            setSize: function (newSize) {
                size = newSize;
            },

            getSize: function () {
                return size;
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
