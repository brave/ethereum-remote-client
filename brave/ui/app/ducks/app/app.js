const reduceMetamaskApp = require('../../../../../ui/app/ducks/app/app')
const extend = require('xtend')
const actions = require('../../store/actions')

module.exports = function (state, action) {
  const newState = reduceMetamaskApp(state, action)
  newState.coinbaseShown = newState.coinbaseShown || false

  if (action.type === actions.TOGGLE_COINBASE) {
    newState.coinbaseShown = !newState.coinbaseShown
  }

  return newState
}
