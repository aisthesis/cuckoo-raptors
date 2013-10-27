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
            content = '<p>JavaScript generated content</p>';

        _this.$el.find('.col-md-12').append(content);
    }
});
