const extend = require('extend')
const actionConstants = require('../../../../../ui/app/store/actionConstants')

export default function reduceBrave (state = {}, action) {
  const braveState = Object.assign({
    showHeaderMenu: false,
    bitGoBalances: {},
    bitGoTransfers: {},
    bitGoCreatedWallets: {},
  }, state)

  switch (action.type) {
    case actionConstants.OPEN_HEADER_DROPDOWN:
      return {
        ...braveState,
        headerOpenDropdown: action.id,
      }

    case actionConstants.CLOSE_HEADER_DROPDOWN:
      return {
        ...braveState,
        headerOpenDropdown: null,
      }

    case actionConstants.SET_BITGO_BALANCE:
      return {
        ...braveState,
        bitGoBalances: {
          ...braveState.bitGoBalances,
          [action.coin]: action.balance,
        },
      }

    case actionConstants.SET_BITGO_TRANSFERS:
      return {
        ...braveState,
        bitGoTransfers: {
          ...braveState.bitGoTransfers,
          [action.coin]: action.transfers,
        },
      }

    case actionConstants.SET_BITGO_WALLET_CREATED:
      return {
        ...braveState,
        bitGoCreatedWallets: {
          ...braveState.bitGoCreatedWallets,
          [action.coin]: { address: 'aBcDeFgHToDo' },
        },
      }

    default:
      return braveState
  }
}
