import * as React from 'react'
import { HashRouter as Router, Link, Route, history } from 'react-router-dom'
import {BlogList} from './blog'
import {BlogView, BlogEdit } from './blog_view'
import { Fetch, wrapComponent } from '../mylib'


function InnerHello(){
    return <div>myHello</div>
}

function BlogIndex(props) {
    console.log(props)
    return <Router>
        <div>
            <Route exact path={props.match.url+'/'} component={wrapComponent(BlogList, props.auth)} />
            {props.auth.is_authenticated?<Route exact path={props.match.url+'/create'} component={wrapComponent(BlogEdit, props.auth)} />:""}
            <Route exact path={props.match.url+'/view/:blog_id'} component={wrapComponent(BlogView, props.auth)} />
            {props.auth.is_authenticated?<Route exact path={props.match.url+'/edit/:blog_id'} component={wrapComponent(BlogEdit, props.auth)} />:""}
        </div>
    </Router>
}

export { BlogIndex }

