import Context from './help'
// import { getBSGlobal } from '../helper'

let getBSGlobal = (name) => window.BSGlobal && window.BSGlobal[name]

let BaseUrl = `//cloud.${getBSGlobal("webPath")}/AssessMRest/100000`
let defaultHeaders = {
    "Content-Type": "application/json",
    'Accept': 'application/json, application/xml, text/play, text/html, *.*'
}
/**
 * 
 * @param {*} param0 
 */
async function fetchData({
    url,
    params = {},
    method = 'get',
    headers = {},
    mode = 'cors',
    credentials = 'include'
}) {
    
    let options = {
        method,
        mode,
        credentials
    }

    url = BaseUrl + url
    headers = Object.assign({}, defaultHeaders, headers)

    if (method.toLowerCase() === 'post') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        options['headers'] = headers
    }

    //参数格式化
    if (Object.keys(params).length != 0) {
        if (method.toLowerCase() === 'get') {
            url += `?${Context.paramSerializa(params)}`
        } else {
            options['body'] = Context.paramSerializa(params)
        }
    }

    return fetch(url, options).then(resp => {
        debugger
        if (resp.status === 200) return resp.json()
        //错误抛出
        throw Error(`错误状态码为${resp.status}`)
    })
}


export default fetchData