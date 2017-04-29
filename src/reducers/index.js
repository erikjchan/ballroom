import { combineReducers } from 'redux'
import {
  LOCK_SUCCESS, LOCK_ERROR, LOGOUT_SUCCESS,
  QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE
} from '../actions'

// Get saved authentication info for state initalization
const { profile, isAuthenticated } = (() => {
  let isAuthenticated = localStorage.getItem('id_token') ? true : false;
  let profile;
  try {
    profile = JSON.parse(localStorage.getItem('profile'))
  } catch (e) { isAuthenticated = false }
  return { profile, isAuthenticated }
})()



// The auth reducer. The starting state sets authentication
// based on a token being in local storage. 
// TODO: check if the token is expired.
function auth(state = {
    isFetching: false,
    isAuthenticated: isAuthenticated,
    isAdmin: profile && profile.app_metadata && profile.app_metadata.roles && !!profile.app_metadata.roles.admin,
    profile: profile,
  }, action) {
  switch (action.type) {
    case LOCK_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        profile: action.profile
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        profile: null
      })
    case LOCK_ERROR: {
        console.error('ERRORR', action.err)
        return state
    } break;
    default:
      return state
    }
}

// The quotes reducer
function quotes(state = {
    isFetching: false,
    quote: '',
    authenticated: false
  }, action) {
  switch (action.type) {
    case QUOTE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case QUOTE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        quote: action.response,
        authenticated: action.authenticated || false
      })
    case QUOTE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false
      })
    default:
      return state
  }
}

// We combine the reducers here so that they
// can be left split apart above
const quotesApp = combineReducers({
  auth,
  quotes
})

export default quotesApp