var codeMelon = codeMelon || {}; 
codeMelon.games = codeMelon.games || {}; 

codeMelon.games.AppView = Backbone.View.extend({
    initialize: function() {
        var _this = this;

        _.bindAll(_this,
            'render'
        );

        _this.render();
    },

    render: function() {
        var _this = this,
            context = _this.el.getContext('2d');

        context.font = '38pt Arial';
        context.fillStyle = 'cornflowerblue';
        context.strokeStyle = 'blue';
        context.fillText('Hello Canvas', _this.el.width / 2 - 128, _this.el.height / 2 + 15);
        context.strokeText('Hello Canvas', _this.el.width / 2 - 128, _this.el.height / 2 + 15);
    }
});
