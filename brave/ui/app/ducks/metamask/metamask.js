const reduceMetamask = require('../../../../../ui/app/ducks/metamask/metamask')

module.exports = function (state, action) {
  const newState = reduceMetamask(state, action)
  newState.batTokenAdded = newState.batTokenAdded || false

  newState.externalProvider = newState.externalProvider || {
    accounts: {
      '0c14e346-9e7f-4d6f-8eb7-d07a02e6ccdd': {
        currency: 'BAT',
        currencyName: 'Basic Attention Token',
        balance: '0.2323',
        exchangeRate: {
          amount: 0.30,
          currency: 'USD',
        },
        transactions: [
          { // example from Coinbase API docs
            'id': '57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
            'type': 'send',
            'status': 'completed',
            'amount': {
              'amount': '-0.00100000',
              'currency': 'BTC',
            },
            'native_amount': {
              'amount': '-0.01',
              'currency': 'USD',
            },
            'description': null,
            'created_at': '2015-03-11T13:13:35-07:00',
            'updated_at': '2015-03-26T15:55:43-07:00',
            'resource': 'transaction',
            'resource_path': '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
            'network': {
              'status': 'off_blockchain',
              'name': 'bitcoin',
            },
            'to': {
              'id': 'a6b4c2df-a62c-5d68-822a-dd4e2102e703',
              'resource': 'user',
              'resource_path': '/v2/users/a6b4c2df-a62c-5d68-822a-dd4e2102e703',
            },
            'instant_exchange': false,
            'details': {
              'title': 'Sent bitcoin',
              'subtitle': 'to User 2',
            },
          },
        ],
      },
      'a1e2b76f-9dfc-469c-83f3-b3c191fd2333': {
        currency: 'ETH',
        currencyName: 'Ether',
        balance: '0.2323',
        exchangeRate: {
          amount: 400,
          currency: 'USD',
        },
        transactions: [],
      },
      '113137dc-0f16-4358-be7a-7fc5ee9eb159': {
        currency: 'IDK',
        currencyName: 'i dunno',
        balance: '34.00',
        exchangeRate: {
          amount: 11.3,
          currency: 'USD',
        },
        transactions: [],
      },
    },
    selectedAccount: '0c14e346-9e7f-4d6f-8eb7-d07a02e6ccdd',
  }

  switch (action.type) {
    case 'SET_BAT_TOKEN_ADDED':
      newState.batTokenAdded = action.value
      return newState

    case 'PROVIDER_SET_SELECTED_ACCOUNT':
      newState.externalProvider.selectedAccount = action.value
      return newState

    default:
      return newState
  }
}
