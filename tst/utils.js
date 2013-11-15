test( "full shuffle test", function() {
    var items = [0, 1, 2, 3, 4],
        // probability for each element of remaining unchanged through
        // all tests: 1 / (items.length ^ repetitions)
        repetitions = 32,
        changed = [false, false, false, false, false],
        i, j;
    
    for (i = 1; i <= repetitions; i++) {
        _c.shuffle(items);
        for (j = 0; j < items.length; j++) {
            if (items[j] !== j) { changed[j] = true; }
        }
    }
    for (j = 0; j < items.length; j++) {
        ok(changed[j], "on full shuffle item " + j + " changed");
        ok(items.indexOf(j) > -1, j + " still present in array");
    }
});

test( "partial shuffle test", function() {
    var items = [0, 1, 2, 3, 4],
        // probability for each element of remaining unchanged through
        // all tests: 1 / (items.length ^ repetitions)
        repetitions = 32, 
        changed = [false, false, false, false, false],
        depth = 2,
        i, j;
    
    for (i = 1; i <= repetitions; i++) {
        _c.shuffle(items, depth);
        for (j = 0; j < depth; j++) {
            if (items[j] !== j) { changed[j] = true; }
        }
    }
    for (j = 0; j < depth; j++) {
        ok(changed[j], "on partial shuffle item " + j + " changed");
    }
    for (j = 0; j < items.length; j++) {
        ok(items.indexOf(j) > -1, j + " still present in array");
    }
});
