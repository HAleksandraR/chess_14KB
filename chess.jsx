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

var Figures = Backbone.Collection.extend({

    model: Figure

});

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

class FigureView extends React.Component {

    componentDidMount() {
        $(this.refs.figure).draggable();
    }

    render() {
        return <div ref="figure" className={"figure " + this.props.figure.get('color')} data-cid={this.props.figure.cid}>{this.props.figure.get('text')}</div>;
    }
}

class BoardCell extends React.Component {

    componentDidMount() {
        $(this.refs.cell).droppable({
            accept: '.figure',
            drop: (event, ui) => {
                var el = $(ui.helper[0]);

                var f_old = figures.find(function(f) {
                    return f.get('row') == this.props.row && f.get('col') == this.props.col;
                }.bind(this));

                if(f_old) {
                    figures.remove(f_old);
                }

                var cid = el.data('cid');
                var f = figures.get(cid);
                f.set({col: this.props.col, row: this.props.row});
            }
        });
    }

    render() {
        return <td ref="cell">{this.props.children}</td>;
    }
}

class BoardView extends React.Component {

    constructor(props) {
        super(props);

        this.toMatrix = this.toMatrix.bind(this);

        this.state = {
            figures: this.toMatrix()
        };
    }

    static get defaultProps() {
        return {
            figures: null
        }
    }

    componentDidMount() {
        this.props.figures.on('change', () => {
            this.setState({
                figures: this.toMatrix()
            });
        });
    }

    toMatrix() {
        var m = [];

        for (var i = 0; i < 8; i++) {
            m.push(new Array(8));
        }

        this.props.figures.each(f => {
            m[f.get('row')][f.get('col')] = f;
        });
        return m;
    }

    render() {
        var rows = [];
        for(var i = 0; i < 8; i++) {
            var cols = [];
            for(var j = 0; j < 8; j++) {
                var f = this.state.figures[i][j];
                cols.push(<BoardCell key={j} col={j} row={i}>{f ? <FigureView figure={f} /> : null}</BoardCell>);
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

$(function() {
    ReactDOM.render(
        <BoardView figures={figures} />,
        $("#board")[0]
    );
});
