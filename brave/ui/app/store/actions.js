const MetaMaskActions = require('../../../../ui/app/store/actions')

MetaMaskActions.addToken = addToken
MetaMaskActions.setBatTokenAdded = setBatTokenAdded
MetaMaskActions.SET_BAT_TOKEN_ADDED = 'SET_BAT_TOKEN_ADDED'

MetaMaskActions.setHardwareConnect = setHardwareConnect
MetaMaskActions.setRewardsDisclosureAccepted = setRewardsDisclosureAccepted

MetaMaskActions.showModal = showModal

// BitGo
MetaMaskActions.createBitGoWallet = createBitGoWallet
MetaMaskActions.getBitGoWalletBalance = getBitGoWalletBalance
MetaMaskActions.getBitGoWalletTransfers = getBitGoWalletTransfers
MetaMaskActions.sendBitGoTransaction = sendBitGoTransaction

MetaMaskActions.SET_BITGO_BALANCE = 'SET_BITGO_BALANCE'
MetaMaskActions.SET_BITGO_TRANSFERS = 'SET_BITGO_TRANSFERS'

var background = null // eslint-disable-line no-var
const parentSetBackground = MetaMaskActions._setBackgroundConnection

function setBackgroundConnection (newConnection) {
  parentSetBackground(newConnection)
  background = newConnection
}

MetaMaskActions._setBackgroundConnection = setBackgroundConnection

function createBitGoWallet (coin) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.createBitGoWallet(coin, (err) => {
        if (err) {
          dispatch(MetaMaskActions.displayWarning(err.message))
          return reject(err)
        }
        resolve()
      })
    })
  }
}

function getBitGoWalletBalance (coin) {
  return (dispatch) => {
    background.getBitGoWalletBalance(coin, (err, balance) => {
      if (err) {
        log.error(err)
        return dispatch(actions.displayWarning(`Could not get BitGo balances for ${coin}`))
      }
      dispatch({
        coin,
        balance,
        type: MetaMaskActions.SET_BITGO_BALANCE
      })
    })
  }
}

function getBitGoWalletTransfers (coin) {
  return (dispatch) => {
    background.getBitGoWalletTransfers(coin, (err, transfers) => {
      if (err) {
        log.error(err)
        return dispatch(actions.displayWarning(`Could not get BitGo transfers for ${coin}`))
      }
      dispatch({
        coin,
        transfers,
        type: MetaMaskActions.SET_BITGO_TRANSFERS
      })
    })
  }
}

function sendBitGoTransaction (coin, amount, recipientAddress) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.sendBitGoTransaction(coin, amount, recipientAddress, (err) => {
        if (err) {
          dispatch(MetaMaskActions.displayWarning(err.message))
          return reject(err)
        }
        resolve()
      })
    })
  }
}

function setBatTokenAdded () {
  return (dispatch) => {
    background.setBatTokenAdded((err) => {
      if (err) {
        return dispatch(MetaMaskActions.displayWarning(err.message))
      }
    })
    dispatch({
      type: MetaMaskActions.SET_BAT_TOKEN_ADDED,
      value: true,
    })
  }
}

function setRewardsDisclosureAccepted () {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.setRewardsDisclosureAccepted((err) => {
        if (err) {
          dispatch(MetaMaskActions.displayWarning(err.message))
          return reject(err)
        }
        return MetaMaskActions.forceUpdateMetamaskState(dispatch).then(() => resolve())
      })
    })
  }
}

function setHardwareConnect (value) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.setHardwareConnect(value, (err) => {
        if (err) {
          dispatch(MetaMaskActions.displayWarning(err.message))
          return reject(err)
        }
        return MetaMaskActions.forceUpdateMetamaskState(dispatch).then(() => resolve())
      })
    })
  }
}

function addToken (address, symbol, decimals, image) {
  return (dispatch) => {
    dispatch(MetaMaskActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.addToken(address, symbol, decimals, image, (err, tokens) => {
        dispatch(MetaMaskActions.hideLoadingIndication())
        if (err) {
          dispatch(MetaMaskActions.displayWarning(err.message))
          reject(err)
        } else if (symbol === 'BAT') {
          dispatch(MetaMaskActions.setBatTokenAdded())
        }
        dispatch(MetaMaskActions.updateTokens(tokens))
        resolve(tokens)
      })
    })
  }
}

function showModal (payload) {
  if (payload.name === 'METAMETRICS_OPT_IN_MODAL') {
    return {
      type: '',
      payload: {},
    }
  }

  return {
    type: MetaMaskActions.MODAL_OPEN,
    payload,
  }
}

module.exports = MetaMaskActions
