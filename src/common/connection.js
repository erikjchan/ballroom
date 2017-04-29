import { connect } from 'react-redux'


export default (component) => connect((state) => {
  const { quotes, auth } = state
  const { quote, authenticated } = quotes
  const { isAuthenticated, errorMessage, profile, isAdmin } = auth
  return {
    // Sample, unused
    quote,
    isSecretQuote: authenticated,
    errorMessage,
    isAuthenticated,
    isAdmin,
    profile
    
  }
})(component)
