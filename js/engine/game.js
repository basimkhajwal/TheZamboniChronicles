Game.Game = function () {

    this.canvas = null;
    this.timer = null;

};

Game.Game.prototype = {
    Initialise: function () {
        this.canvas = new Game.Canvas();
        this.canvas.Initialise(1000, 600);

        this.timer = new Game.Timer();
    },


    Start: function () {
        var that = this;

        var update = function (delta) {

        };

        var render = function () {
            that.canvas.Begin();

            that.canvas.bufferContext.rect(100, 100, 30, 40);

            that.canvas.End();
        };



        this.timer.Initialise(update, render);

        this.timer.Start();
    },




};

