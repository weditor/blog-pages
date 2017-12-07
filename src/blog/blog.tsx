import * as React from 'react'
import { render } from 'react-dom'
import { Button, Table } from 'react-bootstrap'
import * as MarkdownIt from 'markdown-it'
import { Link } from 'react-router-dom'




class BlogList extends React.Component<any, any>{
    constructor() {
        super();
        this.state = {
            blog_list: [],
        }
        fetch('/blog/article/?format=json')
        .then(res=>res.json())
        .then(res=>{
            this.setState({'blog_list': res});
        })
    }

    componentDidMount(){
        console.log(this.props)
    }

    createBlog(){
        this.props.history.push(`${this.props.match.url}/create`)
    }

    render() {
        return (<div>
            { 
                (this.props.auth.is_authenticated)? 
                <Button bsStyle="primary" onClick={()=>this.createBlog()}><i className="fa fa-plus-circle"></i>新建</Button>
                :""
            }
            <Table responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>标题</th>
                    <th>发布时间</th>
                </tr>
                </thead>
                <tbody>
                    { this.state.blog_list.map((item,index)=>{
                        return(
                            <tr key={ item.id }>
                                <td>{ index+1 }</td>
                                <td><Link to={this.props.match.url+'/view/' + item.id} >
                                    { item["title"] }
                                </Link></td>
                                <td>{ item["create_time"] }</td>
                            </tr>
                        )
                    }) }
                </tbody>
            </Table>
        </div>)
    }
}


export {BlogList}

