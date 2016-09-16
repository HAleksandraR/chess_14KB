/**
 * Created by demon on 12.09.16.
 */

$(function() {
    var figures = [];

    var colors = ['black', 'white'];
    var rows = [0, 7];

    for(var c = 0; c < 2; c++) {
        for (var i = 0; i < 8; i++) {
            figures = figures.concat({name: 'pawn', text: '♟', color: colors[c], row: c == 0 ? 1 : 6, col: i});
        }

        figures = figures.concat([
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
            var div = $("<div>");
            var f = _.find(figures, function(f) {
                return f.row == i && f.col == j;
            });
            if(f) {
                div.text(f.text);
                div.addClass(f.color);
                td.html(div);
            }
            tr.append(td);
        }
        board.append(tr);
    }
    $("#board").html(board);
});
