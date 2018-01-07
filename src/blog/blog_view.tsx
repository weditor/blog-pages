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
        this.state = {
            show_edit: false,
            title: "",
            content: "",
            show_category: false,
        }
    }

    componentDidMount() {
        this.refresh_article(false)
    }

    refresh_article(edit=undefined) {
        Fetch(`/api/blog/article/${this.props.match.params.blog_id}/`).then(res=>res.json())
        .then(res=>{
            this.setState({
                'title': res.title,
                'content': res.content,
            }, ()=>{
                MathJax.Hub.Queue(["Typeset",MathJax.Hub, findDOMNode(this.refs['md_view'])]);
                mermaid.init();
            })
        })
    }

    render_title() {
        return <div>
            <div className="article-head">
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

    render_body() {
        return <div id="preview-item" className="article-body">
            <MarkdownView ref="md_view" content={this.state.content} md={markdown} />
        </div>
    }

    render_tag() {
        return <div>
            </div>
    }

    onEditClick() {
        this.props.history.push(`/blog/edit/${this.props.match.params.blog_id}/`);
    }
    
    render() {
        return (
            <div>
                <form>
                    {this.render_title()}
                    <div id="markdown-toc-header" ></div>
                    {this.render_body()}
                    {this.render_tag()}
                </form>
            </div>
        )
    }
}


class BlogEdit extends React.Component<any, any> {

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
        console.log('fuckyou didmount')
        console.log(this.blog_id())
        if (this.blog_id()) {
            Fetch(`/api/blog/article/${this.blog_id()}/`).then(res=>res.json())
            .then(res=>{
                this.setState({
                    'title': res.title,
                    'content': res.content,
                    'tags': res.tags.map(item=>item.name),
                }, ()=>{
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub, findDOMNode(this.refs['md_view'])]);
                    mermaid.init();
                })
            })
        }
    }
    
    blog_id() {
        return this.props.match.params.blog_id
    }

    query_tag_list(value) {
        value = (value || "")
        this.setState({tag_loading: true})
        fetch(`/api/blog/tag/?search=${value}`)
        .then(req=>req.json())
        .then(data=>{
            console.log(data)
            this.setState({tag_list: data.map(item=>`${item.name}--${item.pinyin}`), tag_loading: false})
        }).catch(e=>{
            this.setState({tag_loading: false})
        })
    }

    render_title() {
        return <FormGroup className="article-head">
            <ControlLabel>标题</ControlLabel>
            <FormControl onChange={(e)=>this.setState({title: e.target.value})} value={this.state.title}/>
        </FormGroup>
    }

    render_body() {
        return <FormGroup className="article-body">
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
        console.log(this.blog_id())
        let url = this.blog_id()?`/api/blog/article/${this.blog_id()}/`:`/api/blog/article/`
        let method = this.blog_id()?'put': 'post'
        Fetch(url, method, {
            'title': this.state.title,
            'content': this.state.content,
            'tags': this.state.tags,
        })
        .then(res=>res.json())
        .then(res=>{
            this.props.history.push(`/blog/view/${res.id}/`);
        })
    }
    
    onCancel() {
        if(this.blog_id()) {
            this.props.history.push(`/blog/view/${this.blog_id()}/`);
        } else {
            this.props.history.push(`/blog`);
        }
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

export { BlogView, BlogEdit }
