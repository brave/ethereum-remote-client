const extend = require('extend')
const actions = require('../../store/actions')
const reduceMetamask = require('../../../../../ui/app/ducks/metamask/metamask')

module.exports = function (state, action) {
  const newState = reduceMetamask(state, action)

  newState.batTokenAdded = newState.batTokenAdded || false
  newState.rewardsDisclosureAccepted = newState.rewardsDisclosureAccepted || false

  newState.coinbase = newState.coinbase || {
    accounts: {
      '0c14e346-9e7f-4d6f-8eb7-d07a02e6ccdd': {
        currency: 'BAT',
        balance: '0.2323',
        exchangeRate: {
          amount: 0.30,
          currency: 'USD',
        },
      },
      'a1e2b76f-9dfc-469c-83f3-b3c191fd2333': {
        currency: 'ETH',
        balance: '0.2323',
        exchangeRate: {
          amount: 400,
          currency: 'USD',
        },
      },
      '113137dc-0f16-4358-be7a-7fc5ee9eb159': {
        currency: 'IDK',
        balance: '34.00',
        exchangeRate: {
          amount: 11.3,
          currency: 'USD',
        },
      },
    },
    selectedAccount: '0c14e346-9e7f-4d6f-8eb7-d07a02e6ccdd',
  }

  switch (action.type) {
    case actions.SET_BAT_TOKEN_ADDED:
      return extend(newState, {
        batTokenAdded: action.value,
      })
  }

  switch (action.type) {
    case 'SET_BAT_TOKEN_ADDED':
      newState.batTokenAdded = action.value
      return newState

    case 'COINBASE_SET_SELECTED_ACCOUNT':
      newState.coinbase.selectedAccount = action.value
      return newState

    default:
      return newState
  }
}
