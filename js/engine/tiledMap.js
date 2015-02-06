//The Engine module
var Engine = Engine || {};


//The tiled map creator
Engine.TiledMap = {

    create: function (mapWidth, mapHeight, tileWidth, tileHeight) {
        "use strict";

        var tiles = [];
        var renderMap = [];
        var xOffset = 0;
        var yOffset = 0;

        (function () {
            var row, col;

            for (row = 0; row < mapHeight; row += 1) {
                tiles.push([]);

                for (col = 0; col < mapWidth; col += 1) {
                    tiles[row].push(0);
                }
            }

        }());

        return {

            render: function (ctx) {
                var row, col, val;

                for (row = 0; row < mapHeight; row += 1) {
                    for (col = 0; col < mapWidth; col += 1) {
                        val = tiles[row][col];

                        if (val in renderMap && renderMap[val] instanceof Image){
                            ctx.drawImage(renderMap[val], xOffset + col * tileWidth, yOffset + row * tileHeight, tileWidth, tileHeight);
                        }
                    }
                }
            },

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
            },

            setOffset: function (x, y) {
                xOffset = x;
                yOffset = y;
            },

            getOffset: function () {
                return {
                    x: xOffset,
                    y: yOffset
                };
            },

            setRenderMap: function (map) {
                renderMap = map;
            },

            getRenderMap: function () {
                return renderMap;
            },

            putRenderable: function (id, val) {
                renderMap[id] = val;
            }
        };
    }

};
