import * as React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import {Nav, NavItem, Navbar, NavDropdown, MenuItem} from 'react-bootstrap'
import { Game } from './game'
// import { BlogList } from './blog/blog'
import { BlogIndex } from './blog'
import {LoginView} from "./account/login"
import { Fetch, wrapComponent } from './mylib'


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
                is_authenticated: false,
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
            // console.log(res)
            res.updateAuth = ()=>this.onAuth()
            this.setState({auth: res})
        })
    }

    onLogout() {
        Fetch('/account/logout/').then(res=>res.json()).then(res=>{
            if (res.status != 0){
                alert(res.message)
                return
            }
            this.onAuth()
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
                            <NavItem eventKey={3}><Link onClick={()=>this.changeNav(3)} to='/blog'>博客</Link></NavItem>
                            <NavDropdown eventKey={4} id="links-drop" title={"链接"}>
                                <MenuItem eventKey={4.1}><a onClick={()=>console.log(this.props)} href='http://opengrok.zeroswan.com/source/xref/' target="_blank"><div>OpenGrok</div></a></MenuItem>
                                {/* <MenuItem eventKey={4.2} onClick={()=>{this.onLogout()}}><div>退出</div></MenuItem> */}
                            </NavDropdown>
                        </Nav>
                        <Nav pullRight>
                            {this.state.auth.is_authenticated?
                            <NavDropdown eventKey={1} id="account-drop" title={this.state.auth.username}>
                                <MenuItem eventKey={1.1}><Link to='/login'><div>用户信息</div></Link></MenuItem>
                                <MenuItem eventKey={1.2} onClick={()=>{this.onLogout()}}><div>退出</div></MenuItem>
                            </NavDropdown>
                            :<NavItem eventKey={1}><Link to='/login'>Login</Link></NavItem>}
                            
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Route exact path='/' component={Home} />
                <Route path='/hello' component={()=><Hello />} />
                <Route path='/game' component={wrapComponent(Game, this.state.auth)} />
                <Route path='/blog' component={wrapComponent(BlogIndex, this.state.auth)} />
                <Route path='/login' component={wrapComponent(LoginView, this.state.auth)} />
            </div>
        </Router>
    }
}


render(<IndexPage />, document.getElementById('root'))

