/**
 * Dependencies:
 * custom/scripts/models/nest.js
 */
var codeMelon = codeMelon || {},
    _cg;

codeMelon.games = codeMelon.games || {}; 
_cg = codeMelon.games;

codeMelon.games.AppView = Backbone.View.extend({
    events: {
        "click": "handleClick"
    },

    initialize: function(options) {
        _.bindAll(this,
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

        this.setConstants(options);
        this.initVariables(options);
        this.render();
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
        this.CONTEXT = this.el.getContext('2d');
        this.CANVAS_PADDING = 16;
        this.FOREIGN_EGG_COUNT = this.getForeignEggCount();
        this.SIDE_CELLS = this.getNestWidth();
        this.NEST_MODEL = new _cg.NestModel(this.SIDE_CELLS, this.FOREIGN_EGG_COUNT).content;
        this.SIDE_SIZE = (this.el.width - 2 * this.CANVAS_PADDING) / this.SIDE_CELLS,
        this.NATIVE_CELL_FILL_STYLE = '#999999';
        this.FOREIGN_CELL_FILL_STYLE = '#FF0000';
        this.WRONG_CHOICE_FILL_STYLE = '#444444';
        this.CELL_STROKE_STYLE = '#cccccc';
        this.CELL_BORDER_WIDTH = 64 / this.SIDE_CELLS;
        this.TIME_TO_SHOW_FOREIGN = 2000;
        this.DELAY_UNTIL_CLICK_READY = 1500;
        this.DELAY_ON_DONE = 1000;
        this.CURRENT_SCORE_SELECTOR = '.current-score';
        this.LEVEL_SCORE_SELECTOR = '.level-score';
        this.SCORE_MULTIPLE = 100;
        this.SOUNDS = this.getSounds(options);
    },

    initVariables: function(options) {
        this.readyForClick = false;
        this.clickCount = 0;
        this.currentScore = 0;
        this.levelScore = 0;
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
        this.CONTEXT.save();
        this.CONTEXT.fillStyle = fillStyle;
        this.CONTEXT.strokeStyle = this.CELL_STROKE_STYLE;
        this.CONTEXT.lineWidth = this.CELL_BORDER_WIDTH;
        for (var i = 0; i < this.NEST_MODEL.length; i++) {
            if (this.NEST_MODEL[i] >= minTypeToFill) {
                this.drawCell(i);
            }
        }
        this.CONTEXT.restore();
    },

    drawCell: function(i) {
        var row = Math.floor(i / this.SIDE_CELLS),
            col = i % this.SIDE_CELLS,
            yTop = this.CANVAS_PADDING + row * this.SIDE_SIZE,
            xLeft = this.CANVAS_PADDING + col * this.SIDE_SIZE;

        this.CONTEXT.fillRect(xLeft, yTop, this.SIDE_SIZE, this.SIDE_SIZE);
        this.CONTEXT.rect(xLeft, yTop, this.SIDE_SIZE, this.SIDE_SIZE);
        this.CONTEXT.stroke();
    },

    colorCell: function(fillStyle, i) {
        var row = Math.floor(i / this.SIDE_CELLS),
            col = i % this.SIDE_CELLS,
            yTop = this.CANVAS_PADDING + row * this.SIDE_SIZE,
            xLeft = this.CANVAS_PADDING + col * this.SIDE_SIZE;

        this.CONTEXT.save();
        this.CONTEXT.fillStyle = fillStyle;
        this.CONTEXT.strokeStyle = this.CELL_STROKE_STYLE;
        this.CONTEXT.lineWidth = this.CELL_BORDER_WIDTH;
        this.CONTEXT.fillRect(xLeft, yTop, this.SIDE_SIZE, this.SIDE_SIZE);
        this.CONTEXT.rect(xLeft, yTop, this.SIDE_SIZE, this.SIDE_SIZE);
        this.CONTEXT.stroke();
        this.CONTEXT.restore();
    },

    drawUniformCells: function() {
        this.drawCells(this.NATIVE_CELL_FILL_STYLE, 0);
    },

    drawForeignCells: function() {
        this.drawCells(this.FOREIGN_CELL_FILL_STYLE, 1);
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
        if (_this.NEST_MODEL[i] === 0) {
            // wrong choice
            _this.SOUNDS['egg_break'].stop().play();
            _this.clickCount++;
            _this.colorCell(_this.WRONG_CHOICE_FILL_STYLE, i);
            _this.addToScores(-_this.SCORE_MULTIPLE);
            _this.renderScores();
        }
        else if (_this.NEST_MODEL[i] === 1) {
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
        var soundsPath = 'resources/sounds/',
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
        this.currentScore += bonus;
        this.levelScore += bonus;
    },

    renderScores: function() {
        $(this.CURRENT_SCORE_SELECTOR).text(this.currentScore);
        $(this.LEVEL_SCORE_SELECTOR).text(this.levelScore);
    }
});
