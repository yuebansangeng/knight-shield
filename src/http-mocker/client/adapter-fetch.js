
export default class FetchAdapter {

  onConnect () {
    this.native = window.fetch
    window.fetch = (url, options = {}) => {
      let adapter_url = `http://localhost:9002`
      return this.native({
        adapter_url,
        options
      })
    }
  }

  onDisconnect () {
    window.fetch = this.native
    this.native = null
  }
}
