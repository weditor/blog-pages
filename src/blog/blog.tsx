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

    render() {
        return (<Table responsive>
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
                            <td><Link to={this.props.match.url+'/' + item.id} >
                                { item["title"] }
                            </Link></td>
                            <td>{ item["create_time"] }</td>
                        </tr>
                    )
                }) }
            </tbody>
        </Table>)
    }
}


export {BlogList}

