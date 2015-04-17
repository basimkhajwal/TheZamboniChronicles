//Modules needed
var Engine = Engine || {};


/*
*   A set of modules with mathematical expressions needed for keeping models for physics or rendering in the game
*/
Engine.MathsUtils = {

    // ------------------------- Interpolation Methods -----------------------------

    Interpolation: {

        linear: function (y1, y2, d) {
            "use strict";

            return y1 + (y1 - y2) * d;
        },

        cosine: function (y1, y2, d) {
            "use strict";

            var mid = (1 - Math.cos(d * Math.PI)) / 2;

            return (y1 * (1 - mid) + y2 * mid);
        }
    }


};
