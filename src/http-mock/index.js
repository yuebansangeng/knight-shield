
import HARReader from './har-reader'
import httpsHarJson from './https.json'

export const adapterFeth = () => {
  let native = window.fetch

  window.fetch = function (url, options) {

    return new Promise((resolve, reject) => {
      const har = new HARReader({
        'har': httpsHarJson,
        'filters': []
      })

      const http = har.get(url)
      if (http) {
        return resolve(http)  
      }

      return native(url, options)
    })
  }
}
