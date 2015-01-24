Game.Game = function () {

    this.canvas = null;
    this.timer = null;

};

Game.Game.prototype = {
    Initialise: function () {
        this.canvas = Game.Canvas.create(1000, 600);

        this.timer = new Game.Timer();
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

        this.timer.Initialise(update, render);

        //Begin the game loop
        this.timer.Start();
    },




};

