import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import {Nav, NavItem, Navbar, NavDropdown} from 'react-bootstrap'
import { Game } from './game'
// import { BlogList } from './blog/blog'
import { BlogIndex } from './blog'
import {LoginView} from "./account/login"
import { Fetch } from './mylib'


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
            auth: {
                auth: false,
                username: "",
            }
        }
    }

    componentDidMount() {
        this.onAuth()
    }

    changeNav(index) {
        this.setState({activeNav: index});
    }

    onAuth() {
        Fetch('/account/profile/').then(res=>res.json()).then(res=>{
            this.setState({auth: {
                auth: !!(res.username),
                username: res.username
            }})
        })
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
                        <Nav pullRight>
                            {this.state.auth.auth?
                            <NavItem eventKey={1}><Link onClick={()=>this.changeNav(3)} to='/login'>{this.state.auth.username}</Link></NavItem>
                            :<NavItem eventKey={1}><Link onClick={()=>this.changeNav(3)} to='/login'>Login</Link></NavItem>}
                            
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Route exact path='/' component={Home} />
                <Route path='/hello' component={Hello} />
                <Route path='/game' component={Game} />
                <Route path='/blog' component={BlogIndex} />
                <Route path='/login' component={LoginView} />
            </div>
        </Router>
    }
}


render(<IndexPage />, document.getElementById('root'))

