
let log = (x) => {console.log(x); return x}

export default class API {
  constructor (profile) {
    this.profile = profile
  }

  get(route) {
    console.log(` API GET: ${route}`)
    return fetch(route)
      /** Parse the result */
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else throw new Error('GET RESPONSE not ok')
      })
      /** Something went wrong */
      .catch(err => { console.error(err) })
  }
 
  post(route, obj) {
    console.log(route, JSON.stringify(obj))
    return fetch(route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj)
    })
    .then(response => {
      if (response.ok) return response.json()
      else {
        console.log(response)
        throw new Error('POST RESPONSE not ok')}
    })
    /** Something went wrong */
    .catch(err => { console.error(err) })
  }
}