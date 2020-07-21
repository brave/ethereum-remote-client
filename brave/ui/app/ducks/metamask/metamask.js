const extend = require('extend')
const actions = require('../../store/actions')
const reduceMetamask = require('../../../../../ui/app/ducks/metamask/metamask')

module.exports = function (state, action) {
  const newState = reduceMetamask(state, action)

  newState.batTokenAdded = newState.batTokenAdded || false
  newState.rewardsDisclosureAccepted = newState.rewardsDisclosureAccepted || false

  switch (action.type) {
    case actions.SET_BAT_TOKEN_ADDED:
      return extend(newState, {
        batTokenAdded: true,
      })
    default:
      return newState
  }
}
