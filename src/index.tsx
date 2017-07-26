import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter, BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Game } from './game'


class Hello extends React.Component<any, any> {
    render() {
        return <div>Hello, {this.props.name}</div>
    }
}

function Home(props) {
    return <div>this is Home</div>;
}
//<Hello name='jack' />
render(
    <Router>
        <div>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/hello'>Greeting</Link></li>
                <li><Link to='/game'>Game</Link></li>
            </ul>
            <hr />
            <Route exact path='/' component={Home} />
            <Route path='/hello' component={Hello} />
            <Route path='/game' component={Game} />
        </div>
    </Router>,
    document.getElementById('root')
)

