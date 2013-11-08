test( "nest test", function() {
    var nest, i, j, k, foreignEggCount;

    // outer loop for nest size
    // inner loop for foreign eggs
    for (i = 4; i <= 8; i++) {
        for (j = 3; j <= 7; j++) {
            nest = new codeMelon.games.Nest(i, j);
            deepEqual(nest.content.length, i * i, "correct nest size");
            deepEqual(nest.content[0], -1, "corner empty");
            deepEqual(nest.content[i - 1], -1, "corner empty");
            deepEqual(nest.content[(i - 1) * i], -1, "corner empty");
            deepEqual(nest.content[i * i - 1], -1, "corner empty");
            foreignEggCount = 0;
            for (k = 0; k < nest.content.length; k++) {
                if (nest.content[k] === 1) { foreignEggCount++; }
            }
            deepEqual(foreignEggCount, j, "correct number of foreign eggs");
        }
    }
});
