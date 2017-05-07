
export default class API {
  constructor (profile) {
    this.profile = profile
    console.log("New API with profile", profile)
  }

  get(route) {
    return fetch(route)
      /** Parse the result */
      .then(response => response.json())
      /** Something went wrong */
      .catch(err => { alert(err); console.log(err)})
  }

  post(route, obj) {
    return fetch(route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj)
    })
    /** Something went wrong */
    .catch(err => { alert(err); console.log(err)})
  }
}