//The Engine module
var Engine = Engine || {};


//The tiled map creator
Engine.TiledMap = {

    create: function (mapWidth, mapHeight, tileWidth, tileHeight) {
        "use strict";

        var tiles = [];

        (function () {
            var row, col;

            for (row = 0; row < tileHeight; row += 1) {
                tiles.push(new Array());

                for (col = 0; col < tileWidth; col += 1) {
                    tiles[i].push(0);
                }
            }

        }());

        return {

            getTileAt: function (row, col) {
                return tiles[row][col];
            },

            setTileAt: function (row, col, val) {
                tiles[row][col] = val;
            },

            getWidth: function () {
                return mapWidth;
            },

            getHeight: function () {
                return mapHeight;
            },

            getTileWidth: function () {
                return tileWidth;
            },

            getTileHeight: function () {
                return tileHeight;
            }
        };
    }

};
