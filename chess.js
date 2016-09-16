/**
 * Created by demon on 12.09.16.
 */

var Figure = Backbone.Model.extend({

    defaults: {
        name: '',
        text: '',
        color: '',
        row: 0,
        col: 0
    },

    constructor: function () {
        Backbone.Model.apply(this, arguments);
    }

});

var FigureView = Backbone.View.extend({

    className: "figure",

    render: function() {
        $(this.el).text(this.model.get('text'));

        $(this.el).addClass(this.model.get('color'));
        $(this.el).attr({cid: this.model.cid});

        $(this.el).draggable();

        return this;
    }

});

var Figures = Backbone.Collection.extend({

    model: Figure

});

$(function() {
    var figures = new Figures();

    var colors = ['black', 'white'];
    var rows = [0, 7];

    for(var c = 0; c < 2; c++) {
        for (var i = 0; i < 8; i++) {
            figures.add({name: 'pawn', text: '♟', color: colors[c], row: c == 0 ? 1 : 6, col: i});
        }

        figures.add([
            {name: 'rook', text: '♜', color: colors[c], row: rows[c], col: 0},
            {name: 'knight', text: '♞', color: colors[c], row: rows[c], col: 1},
            {name: 'bishop', text: '♝', color: colors[c], row: rows[c], col: 2},
            {name: 'rook', text: '♜', color: colors[c], row: rows[c], col: 7},
            {name: 'knight', text: '♞', color: colors[c], row: rows[c], col: 6},
            {name: 'bishop', text: '♝', color: colors[c], row: rows[c], col: 5},
            {name: 'king', text: '♚', color: colors[c], row: rows[c], col: c == 0 ? 3 : 4},
            {name: 'queen', text: '♛', color: colors[c], row: rows[c], col: c == 0 ? 4 : 3},
        ]);
    }

    var board = $("<table>");
    for(var i = 0; i < 8; i++) {
        var tr = $("<tr>");
        for(var j = 0; j < 8; j++) {
            var td = $("<td>");
            var f = figures.find(function(f) {
                return f.get('row') == i && f.get('col') == j;
            });
            if(f) {
                var v = new FigureView({model: f});

                td.html(v.render().el);
            }
            td.attr({row: i, col: j});
            tr.append(td);
        }
        board.append(tr);
    }
    $("#board").html(board);

    $("#board td").droppable({
        accept: '.figure',
        drop: function(event, ui) {
            var el = $(ui.helper[0]);

            el.detach();
            $(this).append(el);

            var cid = el.attr('cid');
            var f = figures.get(cid);
            f.set({col: $(this).attr('col'), row: $(this).attr('row')});

            el.css({left: 0, top: 0});
        }
    });

    figures.each(function(f) {
        f.on("change:col change:row", function(model, data) {
            console.log(f.cid, data)
        });
    });
});
