Game.Game = function () {

    this.canvas = null;
    this.timer = null;

};

Game.Game.prototype = {
    Initialise: function () {
        this.canvas = Game.Canvas.create(1000, 600);
    },


    Start: function () {
        var that = this;

        var update = function (delta) {

        };

        var render =  function () {
            that.canvas.begin();

            that.canvas.getContext().fillRect(10,10,20,20);

            that.canvas.end();
        };

        var timer = Game.Timer.create(update, render);

        //Begin the game loop
        timer.start();
    },




};

