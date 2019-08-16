const reduceMetamaskApp = require('../../../../../ui/app/ducks/app/app')
const actions = require('../../store/actions')

module.exports = function (state, action) {
  const newState = reduceMetamaskApp(state, action)
  newState.providerShown = newState.providerShown || false
  newState.providerView = newState.providerView || null

  switch (action.type) {
    case actions.TOGGLE_PROVIDER:
      newState.providerShown = !newState.providerShown
      return newState

    case actions.PROVIDER_SET_VIEW:
      newState.providerView = action.value
      return newState

    default:
      return newState
  }
}
