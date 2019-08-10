const reduceMetamaskApp = require('../../../../../ui/app/ducks/app/app')
const extend = require('xtend')
const actions = require('../../store/actions')

module.exports = function (state, action) {
  const newState = reduceMetamaskApp(state, action)
  newState.coinbaseShown = newState.coinbaseShown || false
  newState.coinbaseView = newState.coinbaseView || null

  switch (action.type) {
    case actions.TOGGLE_COINBASE:
      newState.coinbaseShown = !newState.coinbaseShown
      return newState

    case actions.COINBASE_SET_VIEW:
      newState.coinbaseView = action.value
      return newState

    default:
      return newState
  }
}
