var codeMelon = codeMelon || {}; 
codeMelon.games = codeMelon.games || {}; 

codeMelon.games.AppView = Backbone.View.extend({
    events: {
        "click": "handleClick"
    },

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
            'drawForeignCells',
            'handleClick'
        );

        _this.setConstants(options);
        _this.readyForClick = false;
        _this.clickCount = 1;
        _this.render();
    },

    render: function() {
        var _this = this;

        _this.drawUniformCells();
        _this.drawForeignCells();
        setTimeout(function() {
            _this.drawUniformCells();
            setTimeout(function() {
                _this.readyForClick = true;
            }, _this.DELAY_UNTIL_CLICK_READY);
        }, _this.TIME_TO_SHOW_FOREIGN);
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
        _this.TIME_TO_SHOW_FOREIGN = 2000;
        _this.DELAY_UNTIL_CLICK_READY = 1500;
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
    },

    handleClick: function(event) {
        var _this = this,
            canvasOffset = _this.$el.offset(),
            clickX = event.pageX - canvasOffset.left,
            clickY = event.pageY - canvasOffset.top,
            row, col, i;

        if (!_this.readyForClick) {
            console.log('not ready yet!');
            return;
        }
        if (clickY <= _this.CANVAS_PADDING || 
            clickY >= _this.el.height - _this.CANVAS_PADDING ||
            clickX <= _this.CANVAS_PADDING ||
            clickX >= _this.el.width - _this.CANVAS_PADDING) {
            console.log('out of bounds');
            return;
        }
        if (_this.clickCount > _this.FOREIGN_EGG_COUNT) {
            console.log('no more guesses allowed!');
            return;
        }
        clickY -= _this.CANVAS_PADDING;
        clickX -= _this.CANVAS_PADDING;
        row = Math.floor(clickY / _this.SIDE_SIZE);
        col = Math.floor(clickX / _this.SIDE_SIZE);
        i = _this.SIDE_CELLS * row + col;
        if (_this.NEST[i] === 0) {
            _this.clickCount++;
            alert('You destroyed a native egg!');
        }
        else if (_this.NEST[i] === 1) {
            _this.clickCount++;
            alert('Success!');
        }
    }
});
