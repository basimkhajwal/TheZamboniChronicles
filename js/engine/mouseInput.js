//Implements an abstracted set of methods of getting information about the mouse
Engine.MouseInput = function () {

    //Get the canvas element and initialise some variables
    var canvas = document.getElementById("canvas");
    var mousePos = {
        x: 0,
        y: 0
    };
    var mouseDown = false;

    //Utility function to calculate the relative position from the absolute window position
    var calcRelativePosition = function (evt) {

        //Get the bounding rectangle of the canvas
        var rect = canvas.getBoundingClientRect();

        //Update the mousePos as the absolute minus the current position of the canvas
        mousePos.x = evt.clientX - rect.left;
        mousePos.y = evt.clientY - rect.top;
    };

    canvas.addEventListener("mousedown", function () { mouseDown = true; }, false);
    canvas.addEventListener("mouseup", function () { mouseDown = false; }, false);
    canvas.addEventListener("blur", function () { mouseDown = false; }, false);

    canvas.addEventListener("mousemove", calcRelativePosition, false);

    return {

        getMousePos: function () {
            return mousePos;
        },

        isMouseDown: function () {
            return mouseDown;
        }

    };

}();
