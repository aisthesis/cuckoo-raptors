test( "nest model test", function() {
    var nestModel, i, j, k, foreignEggCount;

    // outer loop for nest size
    // inner loop for foreign eggs
    for (i = 4; i <= 8; i++) {
        for (j = 3; j <= 7; j++) {
            nestModel = new codeMelon.games.NestModel(i, j);
            deepEqual(nestModel.content.length, i * i, "correct nestModel size");
            deepEqual(nestModel.content[0], -1, "corner empty");
            deepEqual(nestModel.content[i - 1], -1, "corner empty");
            deepEqual(nestModel.content[(i - 1) * i], -1, "corner empty");
            deepEqual(nestModel.content[i * i - 1], -1, "corner empty");
            foreignEggCount = 0;
            for (k = 0; k < nestModel.content.length; k++) {
                if (nestModel.content[k] === 1) { foreignEggCount++; }
            }
            deepEqual(foreignEggCount, j, "correct number of foreign eggs");
        }
    }
});
