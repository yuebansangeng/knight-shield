
import HARReader from './har-reader'
import httpsHarJson from './https.json'

export const adapterFeth = () => {
  let native = window.fetch

  window.fetch = function (url, options) {

    return new Promise((resolve, reject) => {

      const har = new HARReader({ 'har': httpsHarJson, 'filters': [] })
      const http = har.get(url)

      if (http) {
        let { status, content, headers } = http.response
        let { mimeType, text } = content

        let resHeaders = {}
        headers.forEach(head => resHeaders[head.name] = head.value)
        let response = new Response(text, {
          'headers': resHeaders
        })

        return resolve(response)
      }

      return native.apply(this, [].slice.call(arguments))
    })
  }
}

// TODO:
export const adapterXHR = () => {
  // let native = window.XMLHttpRequest.prototype.open

  // window.XMLHttpRequest.prototype.open = function () {

  //   const har = new HARReader({ 'har': httpsHarJson, 'filters': [] })
  //   const http = har.get(url)

  //   if (http) {
      
  //   }

  //   return native.apply(this, [].slice.call(arguments))
  // }
}
