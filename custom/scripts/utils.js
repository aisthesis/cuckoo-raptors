var codeMelon = codeMelon || {};
codeMelon.utils = codeMelon.utils || {};

/**
 * Return an array consisting of distinct random numbers.
 * @param choices Required parameter specifying the number of distinct
 * choices available. If only this parameter is given, an array will be 
 * returned of this size where the entries are distinct random
 * integers in the range [0, choices - 1]
 * @param start The lowest value in the range of random numbers
 * to be returned. Defaults to 0. 
 * @param choose The size of the array returned. Must be between
 * 1 and choices. Defaults to choices.
 * Examples:
 * codeMelon.utils.randomize( {choices: 5} );
 * might return [3, 0, 1, 4, 2]
 * codeMelon.utils.randomize( {choices: 4, start: 2} );
 * might return [3, 2, 5, 4]
 * codeMelon.utils.randomize( {choices: 7, choose: 3} );
 * might return [4, 0, 6]
 */

codeMelon.utils.randomize = function(params) {
    "use strict";
    var choices = params.choices,
        start = params.start || 0,
        choose = params.choose || choices,
        arr = [],
        result = [],
        max = start + choices,
        i, 
        j, 
        tmp;

    if (choose > choices) {
        throw new RangeError("cannot choose more values than available choices");
    }

    // initialize array to be randomized
    for (i = start; i < max; i++) {
        arr.push(i);
    }

    // randomize the first 'choose' values
    for (i = 0; i < choose; i++) {
        // find value with which to swap i
        j = Math.floor(Math.random() * (choices - i)) + i;
        // make the swap
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        // put value into result array
        result.push(arr[i]);
    }
    return result;
};
