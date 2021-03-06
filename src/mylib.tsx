import * as MarkdownIt from 'markdown-it'
import * as Highlightjs from 'markdown-it-highlightjs'
import * as MarkdownMathjax from 'markdown-it-mathjax'
import markdownItMermaid from 'markdown-it-mermaid'
import * as MarkdownEmoji from 'markdown-it-emoji'
import markdownItTocAndAnchor from "markdown-it-toc-and-anchor"
import * as React from 'react'

// var Cookies:any;
declare var Cookies:any

function Fetch(url, method="get", body=undefined, content_type='application/json') {
    let opt:RequestInit = {
        method: method,
        credentials: 'include',
    }
    if (body instanceof FormData) {
        opt.body = body
        opt.headers = {
            "X-CSRFtoken": Cookies.get('csrftoken'),
            // "content-type":'application/json',
        }
    }
    else if (body) {
        // body['csrfmiddlewaretoken'] = Cookies.get('csrftoken')
        opt.body = JSON.stringify(body)
        opt.headers = {
            "X-CSRFtoken": Cookies.get('csrftoken'),
            "content-type":content_type,
        }
    }
    return fetch(url, opt)
}

function wrapComponent(Component, auth) {
    return ({...props})=>{
        return <Component auth={auth} {...props}/>
    }
}

function jump_anchor(links){
    for(var i=0;i<links.length;i++){
        links[i].onclick=function(e){
            e.preventDefault()
            let dom_a = (e.target as any)
            let target_id = decodeURI(dom_a.hash.replace("#",""))
            // console.log(target_id)
            let anchorElement = document.getElementById(target_id);
            // console.log(anchorElement)
            if(anchorElement) { anchorElement.scrollIntoView(); }
        }
    }
}

let markdown = MarkdownIt().use(Highlightjs)
.use(new MarkdownMathjax())
.use(markdownItMermaid)
.use(MarkdownEmoji)
.use(markdownItTocAndAnchor, {
    toc: false, 
    anchorLink: false,
    tocCallback: function(tocMarkdown, tocArray, tocHtml) {
        // console.log(tocMarkdown)
        // console.log(tocArray)
        // console.log(tocHtml)
        let toc_header = document.getElementById("markdown-toc-header")
        if (toc_header) {
            toc_header.innerHTML=tocHtml;
            // var links = toc_header.getElementsByTagName("a");
            jump_anchor(toc_header.getElementsByTagName("a"))
            // jump_anchor(document.getElementsByClassName('markdownIt-Anchor'))
            // var in_links = document.getElementsByClassName('markdownIt-Anchor');
            
        }
    }
})

export {Fetch, markdown, wrapComponent}
