import * as React from 'react'
import { render } from 'react-dom'
import { Button, Table, FormControl, FormGroup, ControlLabel } from 'react-bootstrap'
import * as MarkdownIt from 'markdown-it'


class BlogView extends React.Component<any, any> {
    md = MarkdownIt()
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
        fetch(`/blog/article/${this.props.match.params.blog_id}/`).then(res=>res.json())
        .then(res=>{
            this.setState({
                'title': res.title,
                'content': res.content,
                'edit': edit
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
                    <span className="h2">{this.state.title}</span>
                    <i className="fa fa-pencil-square-o edit-btn" onClick={()=>this.onEditClick()}></i>
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
            return <div dangerouslySetInnerHTML={{ __html: this.state.content?this.md.render(this.state.content):"" }} />
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
        fetch(`/blog/article/${this.props.match.params.blog_id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'title': this.state.title,
                'content': this.state.content,
            })
        })
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            this.setState({
                'title': res.title,
                'content': res.content,
                'edit': false
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


export { BlogView }
