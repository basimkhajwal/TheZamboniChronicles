//New modular method
Game.Canvas = {

    //The create method implements most of it
    create: function (width, height) {

        var canvas = document.getElementById("canvas");
        var canvasContext = canvas.getContext("2d");

        var buffer = document.createElement("canvas");
        buffer.width = width;
        buffer.height = height;
        var bufferContext = buffer.getContext("2d");

        //Return a closure
        return {

            begin: function () {
                bufferContext.clearRect(0, 0, width, height);
                canvasContext.clearRect(0, 0, width, height);
            },

            end: function () {
                canvasContext.drawImage(buffer, 0, 0);
            },

            getContext: function () {
                return bufferContext;
            }

        };

    }


}
