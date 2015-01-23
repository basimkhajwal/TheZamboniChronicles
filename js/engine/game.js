Game.Game = function () {

    this.canvas = null;

};

Game.Game.prototype = {
    Initialise: function () {

        this.canvas = new Game.Canvas();
        this.canvas.Initialise(1000, 600);

        console.log("Game initialised");
    }



};
