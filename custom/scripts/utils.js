/**
 * _c is the abbreviation for codeMelon.utils
 */
var codeMelon = codeMelon || {},
    _c;

codeMelon.utils = codeMelon.utils || {};
_c = codeMelon.utils;

/**
 * Without the optional <code>choose</code> parameter, the function simply
 * returns a randomly shuffled copy of the input array.
 * With the <code>choose</code> parameter, an array of 
 * length <code>choose</code> is returned who values
 * are randomly chosen from the values in the input array.
 * If the values in the input array are distinct, the values
 * in the output will be distinct. If the input array
 * contains duplicates, the output may contain duplicates.
 * WARNING: This method will shuffle the values in the input
 * array, so use a copy if this array needs to be preserved.
 */
codeMelon.utils.randomize = function(arr, choose) {
    var result = [],
        resultSize = choose || arr.length,
        i, j, tmp;

    // randomize the first 'choose' values
    for (i = 0; i < resultSize; i++) {
        // find value with which to swap i
        j = Math.floor(Math.random() * (arr.length - i)) + i;
        // make the swap
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        // put value into result array
        result.push(arr[i]);
    }
    return result;
};
