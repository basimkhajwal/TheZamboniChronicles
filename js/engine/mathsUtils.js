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
        },

        cubic: function (y0, y1, y2, y3, d) {
            "use strict";

            var mid = d * d,

                a0 = y3 - y2 - y0 + y1,
                a1 = y0 - y1 - a0,
                a2 = y2 - y0,
                a3 = y1;

            return (a0 * d * mid + a1 * mid +  a2 * d + a3);
        }
    },

    // ------------------------- Spline / Curve Methods -----------------------------

    Spline: {

    }
};
