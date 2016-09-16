/**
 * Created by demon on 12.09.16.
 */

var Figure = _.extend(Backbone.Model, {

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

$(function() {
    var figures = [];

    var colors = ['black', 'white'];
    var rows = [0, 7];

    for(var c = 0; c < 2; c++) {
        for (var i = 0; i < 8; i++) {
            figures = figures.concat(new Figure({name: 'pawn', text: '♟', color: colors[c], row: c == 0 ? 1 : 6, col: i}));
        }

        figures = figures.concat([
            new Figure({name: 'rook', text: '♜', color: colors[c], row: rows[c], col: 0}),
            new Figure({name: 'knight', text: '♞', color: colors[c], row: rows[c], col: 1}),
            new Figure({name: 'bishop', text: '♝', color: colors[c], row: rows[c], col: 2}),
            new Figure({name: 'rook', text: '♜', color: colors[c], row: rows[c], col: 7}),
            new Figure({name: 'knight', text: '♞', color: colors[c], row: rows[c], col: 6}),
            new Figure({name: 'bishop', text: '♝', color: colors[c], row: rows[c], col: 5}),
            new Figure({name: 'king', text: '♚', color: colors[c], row: rows[c], col: c == 0 ? 3 : 4}),
            new Figure({name: 'queen', text: '♛', color: colors[c], row: rows[c], col: c == 0 ? 4 : 3}),
        ]);
    }

    var board = $("<table>");
    for(var i = 0; i < 8; i++) {
        var tr = $("<tr>");
        for(var j = 0; j < 8; j++) {
            var td = $("<td>");
            var div = $("<div>");
            var f = _.find(figures, function(f) {
                return f.get('row') == i && f.get('col') == j;
            });
            if(f) {
                div.text(f.get('text'));
                div.addClass(f.get('color'));
                div.addClass("figure");
                div.attr({cid: f.cid});
                $(div).draggable();
                td.html(div);
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
            var f = _.find(figures, function(f) {
                return f.cid == cid;
            });
            f.set({col: $(this).attr('col'), row: $(this).attr('row')});

            el.css({left: 0, top: 0});
        }
    });

    _.each(figures, function(f) {
        f.on("change:col change:row", function(model, data) {
            console.log(f.cid, data)
        });
    });
});
