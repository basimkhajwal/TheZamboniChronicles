//The namespace design pattern
var Engine = Engine || {};

//New modular method
Engine.Canvas = {

    //The create method implements most of it
    create: function (width, height) {

        //Get the main canvas
        var canvas = document.getElementById("canvas");

        //Get the context to draw on
        var canvasContext = canvas.getContext("2d");

        //Create a back-buffer with the settings but don't add it to the DOM
        var buffer = document.createElement("canvas");
        buffer.width = width;
        buffer.height = height;
        var bufferContext = buffer.getContext("2d");

        //Return a closure with all the public methods
        return {

            //Clear both contexts
            begin: function () {
                bufferContext.clearRect(0, 0, width, height);
                canvasContext.clearRect(0, 0, width, height);
            },

            //Draw the buffer onto the main canvas
            end: function () {
                canvasContext.drawImage(buffer, 0, 0);
            },

            getContext: function () {
                return bufferContext;
            }

        };

    }


};
