
function Fetch(url, method="get") {
    return fetch(url, {
        method: method,
        credentials: 'include',
    })
}


export {Fetch}
