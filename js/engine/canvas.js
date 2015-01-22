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
        this.bufferContext = buffer.getContext("2d");

    },

    Begin: function () {

        this.bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    },

    End: function () {

        this.canvasContext.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, 0, 0, this.canvas.width, this.canvas.height);
    }
};
