/**
 * Dependencies:
 * custom/scripts/utils.js
 */
var codeMelon = codeMelon || {};
codeMelon.games = codeMelon.games || {};

/**
 * Nest constructor requires as input a width (nests are always
 * square, so height === width) and the number of foreign eggs
 * to be included in the nest.
 */
codeMelon.games.Nest = function(width, foreignEggCount) {
    var nests = [],
        occupiedCells = [],
        foreignEggs = [];

    nests[4] = [
        -1, 0, 0, -1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        -1, 0, 0, -1
    ];
    nests[5] = [
        -1, 0, 0, 0, -1,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        -1, 0, 0, 0, -1
    ];
    nests[6] = [
        -1, -1, 0, 0, -1, -1,
        -1, 0, 0, 0, 0, -1,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        -1, 0, 0, 0, 0, -1,
        -1, -1, 0, 0, -1, -1
    ];
    nests[7] = [
        -1, -1, 0, 0, 0, -1, -1,
        -1, 0, 0, 0, 0, 0, -1,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        -1, 0, 0, 0, 0, 0, -1,
        -1, -1, 0, 0, 0, -1, -1
    ];
    nests[8] = [
        -1, -1, 0, 0, 0, 0, -1, -1,
        -1, 0, 0, 0, 0, 0, 0, -1,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        -1, 0, 0, 0, 0, 0, 0, -1,
        -1, -1, 0, 0, 0, 0, -1, -1
    ];

    // get occupied cells
    for (var i = 0; i < nests[width].length; i++) {
        if (nests[width][i] === 0) { occupiedCells.push(i); }
    }

    // get random foreign eggs
    foreignEggs = codeMelon.utils.randomize(occupiedCells, foreignEggCount);

    // set array value to 1 for foreign eggs
    for (var i = 0; i < foreignEggs.length; i++) {
        nests[width][foreignEggs[i]] = 1;
    }

    this.content = nests[width];
}
