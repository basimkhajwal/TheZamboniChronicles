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


/* The old way using the normal object literal approach
Game.Canvas = function () {

    this.canvas = null;
    this.canvasContext = null;

    this.buffer = null;
    this.bufferContext = null;

};

Game.Canvas.prototype = {
    Initialise: function (width, height) {

        this.canvas = document.getElementById("canvas");
        this.canvasContext = canvas.getContext("2d");

        this.buffer = document.createElement("canvas");
        this.buffer.width = width;
        this.buffer.height = height;
        this.bufferContext = this.buffer.getContext("2d");

    },

    Begin: function () {

        this.bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    },

    End: function () {
        this.canvasContext.drawImage(this.buffer, 0, 0);
    }
}; **/
