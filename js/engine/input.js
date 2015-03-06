//The namespace design pattern
var Engine = Engine || {};

//The keys object, holds all the keycodes for easy access
Engine.Keys = {

    BACKSPACE: 8,
    TAB: 9,

    ENTER: 13,

    ESC: 27,

    SPACE: 32,

    //The arrow key keys
    LEFT: 37,
    UP: 40,
    RIGHT: 39,
    DOWN: 38,

    getAlphabet: function (c) {
        "use strict";
        return c.charCodeAt(0);
    }
};

//The keyboard input class to handle key presses etc.
Engine.KeyboardInput = (function () {

    //Hold the current state of which keys are pressed
    "use strict";
    var keyStates = {},

        //Set a key in the keyState variable to true or false
        setKey = function (event, value) {
            keyStates[event.keyCode] = value;
        };

    //When a key has been pressed then set the value to be true
    document.addEventListener('keydown', function (e) {
        setKey(e, true);
    });

    //When it is released then set the key state to false
    document.addEventListener('keyup', function (e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function () {
        keyStates = {};
    });

    //Return a closure to privatise top-level methods and variables
    return {
        //The only public method returns whether a certain key is pressed
        isKeyDown: function (keyCode) {
            return keyStates[keyCode] || false; //If the key exists and is true then return it otherwise false, makes up for undefined values
        }
    };

}());


//Implements an abstracted set of methods of getting information about the mouse
Engine.MouseInput = (function () {

    //Get the canvas element and initialise some variables
    "use strict";
    var canvas = document.getElementById("canvas"),
        mousePos = {
            x: 0,
            y: 0
        },
        mouseDown = false,

        //Utility function to calculate the relative position from the absolute window position
        calcRelativePosition = function (evt) {

            //Get the bounding rectangle of the canvas
            var rect = canvas.getBoundingClientRect();

            //Update the mousePos as the absolute minus the current position of the canvas
            mousePos.x = evt.clientX - rect.left;
            mousePos.y = evt.clientY - rect.top;
        };

    canvas.addEventListener("mousedown", function () { mouseDown = true; }, false);
    canvas.addEventListener("mouseup", function () { mouseDown = false; }, false);
    canvas.addEventListener("blur", function () { mouseDown = false; }, false);

    canvas.addEventListener("mousemove", calcRelativePosition, false);

    return {

        getMousePos: function () {
            return mousePos;
        },

        isMouseDown: function () {
            return mouseDown;
        }

    };

}());
