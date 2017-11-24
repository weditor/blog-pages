import * as React from 'react'
import { HashRouter as Router, Link, Route, history } from 'react-router-dom'
import {BlogList} from './blog'
import {BlogView, BlogCreate} from './blog_view'
import { Fetch } from '../mylib'

function InnerHello(){
    return <div>myHello</div>
}

function BlogIndex(props) {
    return <Router>
        <div>
            <Route exact path={props.match.url+'/'} component={BlogList} />
            <Route exact path={props.match.url+'/create'} component={BlogCreate} />
            <Route exact path={props.match.url+'/view/:blog_id'} component={BlogView} />
        </div>
    </Router>
}

export { BlogIndex }

