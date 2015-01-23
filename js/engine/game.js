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
            console.log("updatin yall");
        };

        this.timer.Initialise(update, function () {
            console.log("called");
            that.canvas.Begin();

            that.canvas.bufferContext.fillRect(100, 100, 30, 40);

            that.canvas.End();
        });

        this.timer.Start();

        console.log("Finished?");
    },




};

