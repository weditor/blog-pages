import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as BS from 'react-bootstrap'
import { Fetch } from '../mylib'


class LoginView extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
        }
    }

    componentDidMount() {
        // if (props.auth.is_authenticated) {
        //     console.log(props.auth)
        //     this.props.auth.updateAuth()
        //     return
        // }
    }

    onLogin() {
        let formData = new FormData()
        formData.append('username', this.state.username)
        formData.append('password', this.state.password)
        Fetch('/account/login/', 'post', formData)
        .then(res=>res.json())
        .then(res=>{
            if (!res.is_authenticated) {
                // console.log(res)
                alert("登录失败")
                return
            }
            this.props.history.push('/')
            this.props.auth.updateAuth()
        })
    }

    render() {
        return <div id="login-form">
            <BS.Grid>
                <BS.Row>
                    <BS.Col sm={6} smOffset={3} md={4} mdOffset={4}>
                        <form>
                            <BS.FormGroup>
                                <BS.ControlLabel>用户名</BS.ControlLabel>
                                <BS.FormControl name="username" onChange={(e)=>this.setState({username: e.target.value})} value={this.state.username}></BS.FormControl>
                            </BS.FormGroup>
                            <BS.FormGroup>
                                <BS.ControlLabel>密码</BS.ControlLabel>
                                <BS.FormControl name="password" type="password" onChange={(e)=>this.setState({password: e.target.value})} value={this.state.password}></BS.FormControl>
                            </BS.FormGroup>
                            <BS.Button bsStyle="primary" block onClick={()=>this.onLogin()}>登录</BS.Button>
                        </form>
                    </BS.Col>
                </BS.Row>
            </BS.Grid>
        </div>
    }
}


export {LoginView}

