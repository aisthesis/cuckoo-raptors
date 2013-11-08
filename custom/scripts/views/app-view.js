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
            'initVariables',
            'getNestWidth',
            'getForeignEggCount',
            'drawCells',
            'drawCell',
            'colorCell',
            'drawUniformCells',
            'drawForeignCells',
            'handleClick',
            'getSounds',
            'getInitialLevelScore',
            'addToScores',
            'renderScores'
        );

        _this.setConstants(options);
        _this.initVariables(options);
        _this.render();
    },

    render: function() {
        var _this = this;

        _this.drawUniformCells();
        _this.drawForeignCells();
        _this.renderScores();
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
        _this.FOREIGN_EGG_COUNT = _this.getForeignEggCount();
        _this.SIDE_CELLS = _this.getNestWidth();
        _this.NEST = new codeMelon.games.Nest(_this.SIDE_CELLS, _this.FOREIGN_EGG_COUNT).content;
        _this.SIDE_SIZE = (_this.el.width - 2 * _this.CANVAS_PADDING) / _this.SIDE_CELLS,
        _this.NATIVE_CELL_FILL_STYLE = '#999999';
        _this.FOREIGN_CELL_FILL_STYLE = '#FF0000';
        _this.WRONG_CHOICE_FILL_STYLE = '#444444';
        _this.CELL_STROKE_STYLE = '#cccccc';
        _this.CELL_BORDER_WIDTH = 64 / _this.SIDE_CELLS;
        _this.TIME_TO_SHOW_FOREIGN = 2000;
        _this.DELAY_UNTIL_CLICK_READY = 1500;
        _this.DELAY_ON_DONE = 1000;
        _this.CURRENT_SCORE_SELECTOR = '.current-score';
        _this.LEVEL_SCORE_SELECTOR = '.level-score';
        _this.SCORE_MULTIPLE = 100;
        _this.SOUNDS = _this.getSounds(options);
    },

    initVariables: function(options) {
        var _this = this;

        _this.readyForClick = false;
        _this.clickCount = 0;
        _this.currentScore = 0;
        _this.levelScore = 0;
    },

    getNestWidth: function() {
        // TODO link to context
        return 4;
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

    colorCell: function(fillStyle, i) {
        var _this = this,
            row = Math.floor(i / _this.SIDE_CELLS),
            col = i % _this.SIDE_CELLS,
            yTop = _this.CANVAS_PADDING + row * _this.SIDE_SIZE,
            xLeft = _this.CANVAS_PADDING + col * _this.SIDE_SIZE;

        _this.CONTEXT.save();
        _this.CONTEXT.fillStyle = fillStyle;
        _this.CONTEXT.strokeStyle = _this.CELL_STROKE_STYLE;
        _this.CONTEXT.lineWidth = _this.CELL_BORDER_WIDTH;
        _this.CONTEXT.fillRect(xLeft, yTop, _this.SIDE_SIZE, _this.SIDE_SIZE);
        _this.CONTEXT.rect(xLeft, yTop, _this.SIDE_SIZE, _this.SIDE_SIZE);
        _this.CONTEXT.stroke();
        _this.CONTEXT.restore();
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
        if (_this.clickCount >= _this.FOREIGN_EGG_COUNT) {
            console.log('no more guesses allowed!');
            return;
        }
        clickY -= _this.CANVAS_PADDING;
        clickX -= _this.CANVAS_PADDING;
        row = Math.floor(clickY / _this.SIDE_SIZE);
        col = Math.floor(clickX / _this.SIDE_SIZE);
        i = _this.SIDE_CELLS * row + col;
        if (_this.NEST[i] === 0) {
            // wrong choice
            _this.SOUNDS['egg_break'].stop().play();
            _this.clickCount++;
            _this.colorCell(_this.WRONG_CHOICE_FILL_STYLE, i);
            _this.addToScores(-_this.SCORE_MULTIPLE);
            _this.renderScores();
        }
        else if (_this.NEST[i] === 1) {
            // correct choice
            _this.SOUNDS['whoosh'].stop().play();
            _this.clickCount++;
            _this.colorCell(_this.FOREIGN_CELL_FILL_STYLE, i);
            _this.addToScores(_this.SCORE_MULTIPLE);
            _this.renderScores();
        }
        if (_this.clickCount === _this.FOREIGN_EGG_COUNT) {
            setTimeout(function() {
                _this.drawForeignCells();
                if (_this.currentScore === _this.FOREIGN_EGG_COUNT * _this.SCORE_MULTIPLE) {
                    _this.SOUNDS['applause'].play();
                    _this.addToScores(_this.currentScore);
                    _this.renderScores();
                }
                else if (_this.currentScore > 0) {
                    _this.SOUNDS['groan'].play();
                }
                else {
                    _this.SOUNDS['scream'].play();
                }
            }, _this.DELAY_ON_DONE);
        }
    },

    getSounds: function(options) {
        var _this = this,
            soundsPath = 'resources/sounds/',
            params = {
                formats: [ 'ogg' ],
                preload: true
            },
            result = [];

        result['applause'] = new buzz.sound(soundsPath + 'applause', params);
        result['egg_break'] = new buzz.sound(soundsPath + 'egg_break', params);
        result['scream'] = new buzz.sound(soundsPath + 'scream', params);
        result['groan'] = new buzz.sound(soundsPath + 'groan', params);
        result['whoosh'] = new buzz.sound(soundsPath + 'whoosh', params);
        return result;
    },

    getInitialLevelScore: function() {
        return 0;
    },

    addToScores: function(bonus) {
        var _this = this;

        _this.currentScore += bonus;
        _this.levelScore += bonus;
    },

    renderScores: function() {
        var _this = this;

        $(_this.CURRENT_SCORE_SELECTOR).text(_this.currentScore);
        $(_this.LEVEL_SCORE_SELECTOR).text(_this.levelScore);
    }
});
