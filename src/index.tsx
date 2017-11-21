import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import {Nav, NavItem, Navbar, NavDropdown} from 'react-bootstrap'
import { Game } from './game'
// import { BlogList } from './blog/blog'
import { BlogIndex } from './blog'


class Hello extends React.Component<any, any> {
    render() {
        return <div>Hello, {this.props.name}</div>
    }
}

function Home(props) {
    return <div>this is Home</div>;
}


class IndexPage extends React.Component<any, any> {
    constructor() {
        super()
        this.state={
            activeNav: 1,
        }
    }

    changeNav(index) {
        this.setState({activeNav: index});
    }

    render() {
        return <Router>
            <div>
                <Navbar collapseOnSelect >
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to='/'>Home</Link>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav activeKey={this.state.activeNav}>
                            <NavItem eventKey={1}><Link onClick={()=>this.changeNav(1)} to='/hello'>Greeting</Link></NavItem>
                            <NavItem eventKey={2}><Link onClick={()=>this.changeNav(2)} to='/game'>Game</Link></NavItem>
                            <NavItem eventKey={3}><Link onClick={()=>this.changeNav(3)} to='/blog'>Blog</Link></NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
    
                <Route exact path='/' component={Home} />
                <Route path='/hello' component={Hello} />
                <Route path='/game' component={Game} />
                <Route path='/games/:id' component={Game} />
                <Route path='/blog' component={BlogIndex} />
            </div>
        </Router>
    }
}


render(<IndexPage />, document.getElementById('root'))

