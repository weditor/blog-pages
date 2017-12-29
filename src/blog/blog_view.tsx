import * as React from 'react'
import {findDOMNode} from 'react-dom'
import { Button, Form, Table, FormControl, FormGroup, ControlLabel, InputGroup, ListGroup, ListGroupItem, MenuItem, Clearfix } from 'react-bootstrap'
import { Affix, AutoAffix, Position } from 'react-overlays'
import { Fetch, markdown } from '../mylib'
import { debounce } from 'lodash'
import {TypeAhead, AsyncTypeahead} from 'react-bootstrap-typeahead'


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
            show_category: false,
        }
    }

    componentDidMount() {
        this.refresh_article(false)
    }

    refresh_article(edit=undefined) {
        if (edit == undefined){
            edit = this.state.edit;
        }
        Fetch(`/api/blog/article/${this.props.match.params.blog_id}/`).then(res=>res.json())
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
            return <div id="preview-item">
                <MarkdownView ref="md_view" content={this.state.content} md={markdown} />
            </div>
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
        Fetch(`/api/blog/article/${this.props.match.params.blog_id}/`, 'PUT', {
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
                    <div id="markdown-toc-header" ></div>
                    {this.render_body()}
                    {this.render_tag()}
                    {this.render_button()}
                </form>
            </div>
        )
    }
}


class BlogCreate extends React.Component<any, any> {

    constructor(props){
        super(props);
        // console.log(props)
        this.state = {
            title: "",
            content: "",
            tags: [],
            tag_list: ["List 1", "List 2"],
            tag_loading: false,
        }
    }

    componentDidMount() {
    }
    
    query_tag_list(value) {
        value = (value || "")
        this.setState({tag_loading: true})
        fetch(`/api/blog/tag/?name__icontains=${value}`)
        .then(req=>req.json())
        .then(data=>{
            console.log(data)
            this.setState({tag_list: data.map(item=>item.name), tag_loading: false})
        }).catch(e=>{
            this.setState({tag_loading: false})
        })
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
        return <AsyncTypeahead
            multiple
            allowNew
            bsSize="sm"
            isLoading={this.state.tag_loading}
            options={this.state.tag_list}
            labelKey="add label"
            minLength={1}
            onSearch={(value)=>this.query_tag_list(value)}
            placeholder="增加标签"
            newSelectionPrefix="+ 新标签:  "
            onChange={item=>this.setState({tags: item})}
        />
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
        Fetch(`/api/blog/article/`, 'post', {
            'title': this.state.title,
            'content': this.state.content,
            'tags': this.state.tags,
        })
        .then(res=>res.json())
        .then(res=>{
            this.props.history.push(`/api/blog/view/${res.id}/`);
        })
    }
    
    onCancel() {
        this.props.history.push(`/api/blog/`);
    }

    render() {
        return (
            <div>
                {this.render_title()}
                <div id="markdown-toc-header"></div>
                {this.render_body()}
                {this.render_tag()}
                {this.render_button()}
            </div>
        )
    }
}

declare var MathJax:any;
declare var mermaid:any;

export { BlogView, BlogCreate }
