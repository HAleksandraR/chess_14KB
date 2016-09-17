var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');

require('jquery-ui/ui/widgets/draggable.js');
require('jquery-ui/ui/widgets/droppable.js');

require('./chess.css');

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

/*var FigureView = React.createComponent({

    render: function() {
        $(this.el).text(this.model.get('text'));

        $(this.el).addClass(this.model.get('color'));
        $(this.el).attr({cid: this.model.cid});

        $(this.el).draggable();

        return this;
    }

});*/

class FigureView extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return <div className={"figure " + this.props.figure.get('color')}>{this.props.figure.get('text')}</div>;
    }

}

class BoardView extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        var rows = [];
        for(var i = 0; i < 8; i++) {
            var cols = [];
            for(var j = 0; j < 8; j++) {
                var f = this.props.figures.find(function(f) {
                    return f.get('row') == i && f.get('col') == j;
                });
                cols.push(<td key={j}>{f ? <FigureView figure={f} /> : null}</td>);
            }
            rows.push(<tr key={i}>{cols}</tr>);
        }

        return (
            <table>
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }

}

var Figures = Backbone.Collection.extend({

    model: Figure

});

$(function() {
    var figures = new Figures();

    /*var board = $("<table>");
    for(var i = 0; i < 8; i++) {
        var tr = $("<tr>");
        for(var j = 0; j < 8; j++) {
            var td = $("<td>");
            var f = figures.find(function(f) {
                return f.get('row') == i && f.get('col') == j;
            });
            td.attr({row: i, col: j});
            tr.append(td);
        }
        board.append(tr);
    }
    $("#board").html(board);

    figures.on("add", function(figure) {
        var v = new FigureView({model: figure});
        $('#board td[row='+figure.get('row')+'][col='+figure.get('col')+']').html(v.render().el);

        figure.on("change:col change:row", function(model, data) {
            console.log(figure.cid, data)
        });

        figure.on("remove", function() {
            v.remove();
        });
    });

    $("#board td").droppable({
        accept: '.figure',
        drop: function(event, ui) {
            var el = $(ui.helper[0]);

            el.detach();
            $(this).append(el);

            var f_old = figures.find(function(f) {
                return f.get('row') == $(this).attr('row') && f.get('col') == $(this).attr('col');
            }.bind(this));

            if(f_old) {
                figures.remove(f_old);
            }

            var cid = el.attr('cid');
            var f = figures.get(cid);
            f.set({col: $(this).attr('col'), row: $(this).attr('row')});

            el.css({left: 0, top: 0});
        }
    });*/

    /////////////////////////////////

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

    ReactDOM.render(
        <BoardView figures={figures} />,
        $("#board")[0]
    );
});
