/**
 * _c is the abbreviation for codeMelon.utils
 */
var codeMelon = codeMelon || {},
    _c;

codeMelon.utils = codeMelon.utils || {};
_c = codeMelon.utils;

/**
 * Randomly shuffle an array of items.
 * If the optional depth parameter is provided, only the first
 * `depth` items are shuffled.
 */
codeMelon.utils.shuffle = function(items, depth) {
    depth = depth ? depth : items.length;
    for (i = 0; i < depth; i++) {
        // find value with which to swap i
        j = Math.floor(Math.random() * (items.length - i)) + i;
        // make the swap
        tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
    return items;
};

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
codeMelon.utils.randomlyChoose = function(items, howMany) {
    return _c.shuffle(items, howMany).slice(0, howMany || items.length);
};
