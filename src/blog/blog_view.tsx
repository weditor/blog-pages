import * as React from 'react'
import { render } from 'react-dom'
import { Button, Table, FormControl } from 'react-bootstrap'
import * as MarkdownIt from 'markdown-it'


class BlogView extends React.Component<any, any> {
    md = MarkdownIt()
    constructor(props){
        super(props);
        console.log(props)
        this.state = {
            article: {}
        }
    }

    componentDidMount() {
        fetch('/blog/article/'+this.props.match.params.blog_id).then(res=>res.json())
        .then(res=>{
            this.setState({'article': res})
        })
    }

    render() {
        return (
            <div>
                <FormControl value={this.state.article.title} disabled/>
                <div dangerouslySetInnerHTML={{ __html: this.state.article.content?this.md.render(this.state.article.content):"" }} />
            </div>
        )
    }
}


export { BlogView }
