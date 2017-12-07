import * as React from 'react'
import {findDOMNode} from 'react-dom'
import { Button, Table, FormControl, FormGroup, ControlLabel } from 'react-bootstrap'
import { Fetch, markdown } from '../mylib'


class MarkdownView extends React.Component<any, any> {
    constructor() {
        super()
    }

    componentDidMount() {
        // console.log('mount makrdown')
        // MathJax.Hub.Queue(["Typeset",MathJax.Hub, findDOMNode(this)]);
    }

    render() {
        return <div dangerouslySetInnerHTML={{ __html: this.props.content?this.props.md.render(this.props.content):"" }} />
    }
}

class BlogView extends React.Component<any, any> {
    md = markdown
    constructor(props){
        super(props);
        console.log(props)
        this.state = {
            show_edit: false,
            edit: false,
            title: "",
            content: "",
        }
    }

    componentDidMount() {
        this.refresh_article(false)
    }

    refresh_article(edit=undefined) {
        if (edit == undefined){
            edit = this.state.edit;
        }
        Fetch(`/blog/article/${this.props.match.params.blog_id}/`).then(res=>res.json())
        .then(res=>{
            this.setState({
                'title': res.title,
                'content': res.content,
                'edit': edit
            }, ()=>{
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, findDOMNode(this.refs['md_view'])]);
                mermaid.init();
            })
        })
    }

    render_title() {
        if (this.state.edit){
            return <FormGroup>
                <ControlLabel>标题</ControlLabel>
                <FormControl onChange={(e)=>this.setState({title: e.target.value})} value={this.state.title}/>
            </FormGroup>
        } else {
            return <div>
                <div >
                    <span className="h2" style={{fontWeight: "bolder"}}>{this.state.title}</span>
                    {
                        this.props.auth.is_authenticated?
                        <i className="fa fa-pencil-square-o edit-btn" onClick={()=>this.onEditClick()}></i>
                        :""
                    }
                </div>
                <hr />
            </div>
        }
        
    }

    render_body() {
        if(this.state.edit) {
            return <FormGroup>
                <ControlLabel>内容</ControlLabel>
                <FormControl componentClass="textarea" rows="20" onChange={(e)=>this.setState({content: e.target.value})} value={this.state.content}/>
            </FormGroup>
        } else {
            return <MarkdownView ref="md_view" content={this.state.content} md={markdown} />
        }
    }

    render_tag() {
        return <div>
            </div>
    }

    render_button() {
        if (!this.state.edit) {
            return <div>
                </div>
        }
        return <div>
            <div className="op-btn-group">
                <Button bsStyle="danger" onClick={()=>this.onCancel()}>取消</Button>
                <Button bsStyle="primary" onClick={()=>this.onSave()}>保存</Button>
            </div>
        </div>
    }

    onEditClick() {
        if (this.state.edit) {
            return
        }
        this.setState({edit: true, })
    }

    onSave() {
        if (!this.state.edit) {
            return
        }
        
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        Fetch(`/blog/article/${this.props.match.params.blog_id}/`, 'PUT', {
                'title': this.state.title,
                'content': this.state.content,
            }
        )
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            this.setState({
                'title': res.title,
                'content': res.content,
                'edit': false
            }, ()=>{
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, findDOMNode(this.refs['md_view'])]);
                mermaid.init();
            })
        })
        // this.setState({edit: false, })
    }
    
    onCancel() {
        if (!this.state.edit) {
            return
        }
        this.refresh_article(false);
    }

    render() {
        return (
            <div>
                <form>
                    {this.render_title()}
                    {this.render_body()}
                    {this.render_tag()}
                    {this.render_button()}
                    {/* <div dangerouslySetInnerHTML={{ __html: this.state.article.content?this.md.render(this.state.article.content):"" }} /> */}
                </form>
            </div>
        )
    }
}


// class BlogCreate extends BlogView {
//     componentDidMount() {
        
//     }
// }

class BlogCreate extends React.Component<any, any> {
    constructor(props){
        super(props);
        // console.log(props)
        this.state = {
            title: "",
            content: "",
        }
    }

    componentDidMount() {
    }

    render_title() {
        return <FormGroup>
            <ControlLabel>标题</ControlLabel>
            <FormControl onChange={(e)=>this.setState({title: e.target.value})} value={this.state.title}/>
        </FormGroup>
    }

    render_body() {
        return <FormGroup>
            <ControlLabel>内容</ControlLabel>
            <FormControl componentClass="textarea" rows="20" onChange={(e)=>this.setState({content: e.target.value})} value={this.state.content}/>
        </FormGroup>
    }

    render_tag() {
        return <div>
            </div>
    }

    render_button() {
        return <div>
            <div className="op-btn-group">
                <Button bsStyle="danger" onClick={()=>this.onCancel()}>取消</Button>
                <Button bsStyle="primary" onClick={()=>this.onSave()}>保存</Button>
            </div>
        </div>
    }

    onSave() {
        // fetch(`/blog/article/`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         'title': this.state.title,
        //         'content': this.state.content,
        //     })
        // })
        Fetch(`/blog/article/`, 'post', {
            'title': this.state.title,
            'content': this.state.content,
        })
        .then(res=>res.json())
        .then(res=>{
            this.props.history.push(`/blog/view/${res.id}/`);
        })
    }
    
    onCancel() {
        this.props.history.push(`/blog/`);
    }

    render() {
        return (
            <div>
                <form>
                    {this.render_title()}
                    {this.render_body()}
                    {this.render_tag()}
                    {this.render_button()}
                </form>
            </div>
        )
    }
}

declare var MathJax:any;
declare var mermaid:any;

export { BlogView, BlogCreate }
