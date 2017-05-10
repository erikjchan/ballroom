// The middleware to call the API for quotes
import { CALL_API } from './middleware/ballroom_api'
import { browserHistory } from 'react-router';

/*********************************** Login ***********************************/

// There are two possible states for our login
// process and we need actions for each of them.
//
// We also need one to show the Lock widget.
export const SHOW_LOCK = 'SHOW_LOCK'
export const LOCK_SUCCESS = 'LOCK_SUCCESS'
export const LOCK_ERROR = 'LOCK_ERROR'

const showLock    = () => ({ type: SHOW_LOCK })
const lockSuccess = (profile, token) => ({ type: LOCK_SUCCESS, profile, token })
const lockError   = (err) => ({ type: LOCK_ERROR, err })

// Opens the Lock widget and
// dispatches actions along the way
export const login = () => {
  const lock = new Auth0Lock('Dl30IRGbXkkPlENLT4nR9QIWLHiMAxxF', 'mrkev.auth0.com');
  return dispatch => {
    lock.show((err, profile, token, access_token) => {
      profile.access_token = access_token
      profile.competitor_id = profile.app_metadata.competitor_id
      if (err) { console.error(err)
        dispatch(lockError(err))
        return
      }
      // console.log(profile, token)
      localStorage.setItem('profile', JSON.stringify(profile))
      localStorage.setItem('id_token', token)
      dispatch(lockSuccess(profile, token))
      browserHistory.push('/')
    })
  }
}


// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

const requestLogout = () => ({ type: LOGOUT_REQUEST, isFetching: true, isAuthenticated: true})
const receiveLogout = () => ({ type: LOGOUT_SUCCESS, isFetching: false, isAuthenticated: false})

// Logs the user out
export const logoutUser = () => dispatch => {
  dispatch(requestLogout())
  localStorage.removeItem('id_token')
  localStorage.removeItem('profile')
  dispatch(receiveLogout())
}

/*********************************** Quotes ***********************************/

export const QUOTE_REQUEST = 'QUOTE_REQUEST'
export const QUOTE_SUCCESS = 'QUOTE_SUCCESS'
export const QUOTE_FAILURE = 'QUOTE_FAILURE'

// Uses the API middlware to get a quote
export function fetchQuote() {
  return {
    [CALL_API]: {
      endpoint: 'random-quote',
      types: [QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE]
    }
  }
}

// Same API middlware is used to get a 
// secret quote, but we set authenticated
// to true so that the auth header is sent
export function fetchSecretQuote() {
  return {
    [CALL_API]: {
      endpoint: 'protected/random-quote',
      authenticated: true,
      types: [QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE]
    }
  }
}

export const SELECT_COMPETITION = 'SELECT_COMPETITION'
export function selectCompetition(competition) {
  return {
    type: SELECT_COMPETITION,
    competition: Object.assign({}, competition),
  }
}

/************************************ API ************************************/

export const API_REQUEST = 'API_REQUEST'
export const API_SUCCESS = 'API_SUCCESS'
export const API_FAILURE = 'API_FAILURE'

// // Uses the API middlware to get user profile
// export function getUnauth() {
//   return {
//     [CALL_API]: {
//       endpoint: 'random-quote',
//       role: null,
//       types: [API_REQUEST, API_SUCCESS, API_FAILURE]
//     }
//   }
// }

// Same API middlware is used to get a 
// secret quote, but we set authenticated
// to true so that the auth header is sent
export function apiRequest(key, request) {
  // Request is { endpoint, method, data }
  return {
    [CALL_API]: {
      request,
      key,
      role: 'competitor',
      types: [API_REQUEST, API_SUCCESS, API_FAILURE]
    }
  }
}

// // Same API middlware is used to get a 
// // secret quote, but we set authenticated
// // to true so that the auth header is sent
// export function getAdmin() {
//   return {
//     [CALL_API]: {
//       endpoint: 'protected/random-quote',
//       role: 'admin', // unused?
//       types: [API_REQUEST, API_SUCCESS, API_FAILURE]
//     }
//   }
// }



