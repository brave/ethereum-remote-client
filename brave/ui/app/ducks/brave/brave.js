const extend = require('extend')
const actionConstants = require('../../../../../ui/app/store/actionConstants')

export default function reduceBrave (state = {}, action) {
  const newState = Object.assign({
    batTokenAdded: false,
    rewardsDiscolusreAccepted: false,
    bitGoBalances: {},
    bitGoTransfers: {},
    bitGoCreatedWallets: [],
  }, state)

  switch (action.type) {
    case actionConstants.SET_BAT_TOKEN_ADDED:
      return extend(newState, {
        batTokenAdded: action.value,
      })
    case actionConstants.SET_BITGO_BALANCE:
      const updatedBitGoBalances = {
        ...newState.bitGoBalances
      }

      updatedBitGoBalances[action.coin] = action.balance

      return extend(newState, {
        bitGoBalances: updatedBitGoBalances
      })
    case actionConstants.SET_BITGO_TRANSFERS:
      const updatedBitGoTransfers = {
        ...newState.bitGoTransfers
      }

      updatedBitGoTransfers[action.coin] = action.transfers

      return extend(newState, {
        bitGoTransfers: updatedBitGoTransfers
      })

    case actionConstants.SET_BITGO_WALLET_CREATED:
      const updatedBitGoCreatedWallets = newState.bitGoCreatedWallets.push(action.coin)

      return extend(newState, {
        bitGoCreatedWallets: updatedBitGoCreatedWallets
      })
    default:
      return newState
  }
}
