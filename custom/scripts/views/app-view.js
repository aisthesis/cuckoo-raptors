var codeMelon = codeMelon || {}; 
codeMelon.games = codeMelon.games || {}; 

codeMelon.games.AppView = Backbone.View.extend({
    initialize: function(options) {
        var _this = this;

        _.bindAll(_this,
            'render',
            'setConstants',
            'getNest',
            'getForeignEggCount',
            'drawCells',
            'drawCell',
            'drawUniformCells',
            'drawForeignCells'
        );

        _this.setConstants(options);
        _this.render();
    },

    render: function() {
        var _this = this;

        _this.drawUniformCells();
        _this.drawForeignCells();
    },

    setConstants: function(options) {
        var _this = this;

        _this.CONTEXT = _this.el.getContext('2d');
        _this.CANVAS_PADDING = 16;
        _this.SIDE_CELLS = 4;
        _this.SIDE_SIZE = (_this.el.width - 2 * _this.CANVAS_PADDING) / _this.SIDE_CELLS,
        _this.FOREIGN_EGG_COUNT = _this.getForeignEggCount();
        _this.NEST = _this.getNest();
        _this.NATIVE_CELL_FILL_STYLE = '#999999';
        _this.FOREIGN_CELL_FILL_STYLE = '#FF0000';
        _this.CELL_STROKE_STYLE = '#cccccc';
        _this.CELL_BORDER_WIDTH = 16;
    },

    /**
     * NEST is an array of size SIDE_CELLS * SIDE_CELLS representing
     * a square grid. 
     * Cells with no eggs (on the corners) have a value of -1.
     * Cells with native eggs have a value of 0.
     * Cells with foreign eggs have a value of 1.
     */
    getNest: function() {
        var _this = this,
            result = [
                -1, 0, 0, -1,
                0, 0, 0, 0,
                0, 0, 0, 0,
                -1, 0, 0, -1],
            valuesToRandomize = [],
            foreignEggs,
            i;

        // get cells occupied by eggs
        for (i = 0; i < result.length; i++) {
            if (result[i] === 0) {
                valuesToRandomize.push(i);
            }
        }
        // choose foreign egg cells randomly among the cells occupied by eggs
        foreignEggs = codeMelon.utils.randomize(valuesToRandomize, _this.FOREIGN_EGG_COUNT);
        for (i = 0; i < foreignEggs.length; i++) {
            result[foreignEggs[i]] = 1;
        }
        return result;
    },

    getForeignEggCount: function() {
        // TODO link to context
        return 3;
    },

    /**
     * @param minTypeToFill 0 to fill all cells with the given
     * style, 1 to fill only foreign cells with the given style
     */
    drawCells: function(fillStyle, minTypeToFill) {
        var _this = this;

        _this.CONTEXT.save();
        _this.CONTEXT.fillStyle = fillStyle;
        _this.CONTEXT.strokeStyle = _this.CELL_STROKE_STYLE;
        _this.CONTEXT.lineWidth = _this.CELL_BORDER_WIDTH;
        for (var i = 0; i < _this.NEST.length; i++) {
            if (_this.NEST[i] >= minTypeToFill) {
                _this.drawCell(i);
            }
        }
        _this.CONTEXT.restore();
    },

    drawCell: function(i) {
        var _this = this,
            row = Math.floor(i / _this.SIDE_CELLS),
            col = i % _this.SIDE_CELLS,
            yTop = _this.CANVAS_PADDING + row * _this.SIDE_SIZE,
            xLeft = _this.CANVAS_PADDING + col * _this.SIDE_SIZE;

        _this.CONTEXT.fillRect(xLeft, yTop, _this.SIDE_SIZE, _this.SIDE_SIZE);
        _this.CONTEXT.rect(xLeft, yTop, _this.SIDE_SIZE, _this.SIDE_SIZE);
        _this.CONTEXT.stroke();
    },

    drawUniformCells: function() {
        var _this = this;

        _this.drawCells(_this.NATIVE_CELL_FILL_STYLE, 0);
    },

    drawForeignCells: function() {
        var _this = this;

        _this.drawCells(_this.FOREIGN_CELL_FILL_STYLE, 1);
    }
});
