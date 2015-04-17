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

    // ------------------------- Spline / Curve Methods (one dimensional) -----------------------------

    Spline: {




        /*
        *   Create an array approximation between evenly spaces y-values with a difference specified
        *
        *   The curve is linearly estimated using the number of points given (default 16)
        */
        cubicToPoints: function (yValues, startX, xChange, numPoints) {
            "use strict";

            //Set the default value to be sixteen if not set
            numPoints = numPoints || 16;

            //Repeat the first and last values so cubic can work better (no tailing ends)
            yValues.unshift(yValues[0]);
            yValues.push(yValues[yValues.length - 1]);

            var curvePoints = [],

                //The difference between each linear interpolation
                pointDiff = xChange / numPoints,

                //Iteration variables
                i = 0,
                j = 0;

            //Iterate over all but first and last (repeated)
            for (i = 1; i < yValues.length - 2; i += 1) {

                //Iterate over the curve estimation
                for (j = 0; j < numPoints; j += 1) {
                    curvePoints.push([
                        startX + (xChange * (i - 1)) + (pointDiff * j),
                        Engine.MathsUtils.Interpolation.cubic(yValues[i - 1], yValues[i], yValues[i + 1], yValues[i + 2], j / numPoints)
                    ]);
                }

            }

            //Return the points generated
            return curvePoints;
        }

    }
};
