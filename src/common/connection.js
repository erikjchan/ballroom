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
  const { quotes, auth, app } = state
  const { quote, authenticated } = quotes
  const { isAuthenticated, errorMessage, profile, isAdmin } = auth
  return {
    // Sample, unused
    quote,
    isSecretQuote: authenticated,
    errorMessage,
    isAuthenticated,
    isAdmin,
    profile,
    app
  }
})(component)
