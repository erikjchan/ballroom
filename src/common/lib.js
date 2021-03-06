/**
 * A collection of useful functions and objects
 */

export default {

  /**
   * This is some JS magic that essentially
   * creates a virtual object where, if you
   * request to read any property, you get
   * the string "Loading...".
   *
   * This is useful for printing things while
   * our data loads from the server.
   */
  flat_loading_proxy : new Proxy({}, {
    get: _ => 'Loading...'
  }),

  /**
   * Posts json
   */
  post : (url, obj) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(obj))
  }
}