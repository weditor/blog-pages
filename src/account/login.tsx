import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as BS from 'react-bootstrap'


class LoginView extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
        }
    }

    render() {
        return <div>
            <form>
                <BS.FormGroup>
                    <BS.ControlLabel>用户名</BS.ControlLabel>
                    <BS.FormControl name="username"></BS.FormControl>
                </BS.FormGroup>
                <BS.FormGroup>
                    <BS.ControlLabel>密码</BS.ControlLabel>
                    <BS.FormControl name="password"></BS.FormControl>
                </BS.FormGroup>
                <BS.Button bsStyle="primary">登录</BS.Button>
            </form>
        </div>
    }
}


export {LoginView}

