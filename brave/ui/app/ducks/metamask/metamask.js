const reduceMetamask = require('../../../../../ui/app/ducks/metamask/metamask')

module.exports = function (state, action) {
  const newState = reduceMetamask(state, action)
  newState.batTokenAdded = newState.batTokenAdded || false

  if (action.type === 'SET_BAT_TOKEN_ADDED') {
    newState.batTokenAdded = action.value
  }

  return newState
}
