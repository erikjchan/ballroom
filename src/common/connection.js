import { connect } from 'react-redux'

/**
 * This connects our component to redux,
 * which is primarily used for authentication
 * with Auth0; the user profile and its roles
 * are in the Redux store.
 * It could be further extended to handle other
 * state.
 */
export default (component) => connect((state) => {
  const { auth, app, selected } = state
  const { isAuthenticated, errorMessage, isAdmin } = auth
  const profile = auth.profile || {}
  const role = (auth.profile && Object.keys(auth.profile.roles)[0]) || 'none'
  profile.role = role

  return {
    errorMessage,
    isAuthenticated,
    isAdmin,
    profile,
    app,
    selected
  }
})(component)
