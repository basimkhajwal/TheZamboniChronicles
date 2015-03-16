//The namespace design pattern
var Engine = Engine || {};

//New modular method
Engine.Canvas = {

    //The create method implements most of it
    create: function (width, height) {
        "use strict";

        //Get the main canvas
        var canvas = document.getElementById("canvas"),

            //Get the context to draw on
            canvasContext = canvas.getContext("2d");

        //Return a closure with all the public methods
        return {

            //Clear context
            clear: function () {
                canvasContext.clearRect(0, 0, width, height);
            },

            getContext: function () {
                return canvasContext;
            }

        };

    }


};

/*
*   A utility colour class for support of RGBA colours
*/
Engine.Colour = {
    
    /*
    *   Create a new colour with the R,G,B,A values provided
    */
    create: function (r, g, b, a) {
        "use strict";
        
        //Return a clousure although no private methods are needed (as of yet...)
        return {
            
            
            // --------------------- Interpolation Methods --------------------------
            // Where 0 is this colour and 1 is the other colour
            
            linearInterpolation: function (otherColour, value) {
                
                // Calculate the linear Interpolation using the formula
                var newR = Math.floor(r + (otherColour.getR() - r) * value),
                    newG = Math.floor(g + (otherColour.getG() - g) * value),
                    newB = Math.floor(b + (otherColour.getB() - b) * value),
                    newA = Math.floor(a + (otherColour.getA() - a) * value);
                
                
                //Return a new Colour with the settings
                return Engine.Colour.create(newR, newG, newB, newA);
            },
            
            quadraticInterpolation: function (otherColour, value) {
                return this.linearInterpolation(otherColour, value * value);
            },

            inverseQuadraticInterpolation: function (otherColour, value) {
                return this.quadraticInterpolation(otherColour, 1 - value);
            },
            
            // ---------------------- Getters & Setters -------------------------------
            
            getR: function () {
                return r;
            },
            
            getG: function () {
                return g;
            },
            
            getB: function () {
                return b;
            },
            
            getA: function () {
                return a;
            },
            
            getCanvasColour: function () {
                return "rbg(" + r + "," + g + "," + b + ")";
            }
        };
        
    }
};

//Add some default colours
(function () {
    "use strict";

    //THe default colours to add
    var colours = [
        ["BLACK", 0, 0, 0],
        ["RED", 255, 0, 0],
        ["GREEN", 0, 255, 0],
        ["BLUE", 0, 0, 255]
    ];

    //Set the values for all the list by iterating over and creating a new colour
    colours.forEach(function (colour) {
        Engine.Colour[colour[0]] = Engine.Colour.create(colour[1], colour[2], colour[3]);
    });

}());


/*
*   A set of drawing tools that can be added to as the game progreses
*   for long or commonly used functions tghat could be used again
*/
Engine.DrawTools = {


    /**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
    roundRect: function (ctx, x, y, width, height, radius, fill, stroke) {
        "use strict";

        stroke = (typeof stroke === "undefined") ? true : stroke;
        radius = (typeof radius === "undefined") ? 5 : radius;

        ctx.beginPath();

        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);

        ctx.closePath();

        if (stroke) {
            ctx.stroke();
        }

        if (fill) {
            ctx.fill();
        }
    }
};
