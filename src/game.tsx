import * as React from 'react'
import { render } from 'react-dom'
import { Button } from 'react-bootstrap'
import * as MarkdownIt from 'markdown-it'


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}> {props.value}</button>
    )
}


class Board extends React.Component<any, any> {
    
    renderSquare(i) {
        return (
            <Square
                onClick={() => this.props.onClick(i)}
                value={this.props.squares[i]}/>
        )
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
            
        )
    }
}


class Game extends React.Component<any, any> {
    constructor () {
        super();
        this.state = {
            history: [
                Array(9).fill(null)
            ],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.slice();
        if (calculateWinner(squares) || squares[i]) {
            return ;
        }
        squares[i] = (this.state.xIsNext? 'X': 'O');
        history.push(squares)
        this.setState({
            history: history,
            stepNumber: history.length - 1,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ===0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current)

        const moves = history.map((step, move) => {
            const desc = move ? 'Move #' + move: 'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            )
        })
        let status;
        if (winner) {
            status = 'Winner: ' + winner
        }
        else {
            status = 'Next Player:' + (this.state.xIsNext? 'X': 'O');
        }
        let json_data = {fuck: 43, sons: {
            first: 'jack',
            second: 'tom',
        }}
        let md = new MarkdownIt();
        let htmlStr = md.render("# this is header\n## this is second header");
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current}
                        onClick={(i)=>this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{moves}</ol>
                </div>
                <div>
                    <Button bsStyle="success" bsSize="small">
                        Something
                    </Button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: htmlStr }}/>
            </div>
        )
    }
}

export {Game}
