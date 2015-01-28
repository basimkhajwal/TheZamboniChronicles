//The keys object, holds all the keycodes for easy access
Engine.Keys = {

    BACKSPACE: 8,
    TAB: 9,

    ENTER: 13,

    ESC: 27,

    SPACE: 32,

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    getAlphabet: function (c) {
        return c.charCodeAt(0);
    }
};

//The keyboard input class to handle key presses etc.
Engine.KeyboardInput = function () {

    //Hold the current state of which keys are pressed
    var keyStates = {};

    //Set a key in the keyState variable to true or false
    var setKey = function (event, value) {
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

}();
