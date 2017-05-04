export const BASE_URL = 'http://localhost:8080/api/'
export const CALL_API = Symbol('Call API')

const post = (url, obj, headers = {}) => new Promise((res, rej) => {
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.responseType = 'json'
  xhr.onload = function () { res(this.response) }
  xhr.onerror = () => rej(`XHR error: POST to ${url}`)
  Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
  xhr.send(JSON.stringify(obj))
})


const callApi = (request, role) => {

  const { endpoint, method = 'GET', data } = request
  const token = localStorage.getItem('id_token') || null
  const config = (token && { headers: { 'Authorization': `Bearer ${token}` }}) || {}
  if (role && !token) throw "No token saved!"

  const url = BASE_URL + endpoint

  // POST
  if (method.toLowerCase() === 'post') return post(url, data, config.headers)
  
  // GET
  else return fetch(BASE_URL + endpoint, config)
    .then(response =>
      response.json()
      .then(text => ({ text, response }))
    )
    .then(({ text, response }) =>
      response.ok ? text : Promise.reject(text)
    )
}

/** The middleware */
export default store => next => action => {
  const callAPI = action[CALL_API]

  
  // So the middleware doesn't get applied to every single action
  // If no CALL_API on the action do nothing
  if (typeof callAPI === 'undefined') return next(action)
  
  const { request, types, role, key } = callAPI
  const [ requestType, successType, errorType ] = types

  console.log(key)

  // Passing the role string back in our data will 
  // let us distinguish between normal and secret quotes
  return callApi(request, role)
    .then(response => next({
      response,
      key,
      type: successType
    }))
    .catch(error => next({
      error: error.message || 'There was an error.',
      key,
      type: errorType
    }))
}