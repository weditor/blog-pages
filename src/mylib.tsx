

// var Cookies:any;
declare var Cookies:any

function Fetch(url, method="get", body=undefined, content_type='application/json') {
    let opt:RequestInit = {
        method: method,
        credentials: 'include',
    }
    if (body) {
        // body['csrfmiddlewaretoken'] = Cookies.get('csrftoken')
        opt.body = JSON.stringify(body)
        opt.headers = {
            "X-CSRFtoken": Cookies.get('csrftoken'),
            "content-type":content_type,
        }
    }
    return fetch(url, opt)
}

export {Fetch}
