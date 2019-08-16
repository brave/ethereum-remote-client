const MetaMaskActions = require('../../../../ui/app/store/actions')

MetaMaskActions.addToken = addToken
MetaMaskActions.setBatTokenAdded = setBatTokenAdded
MetaMaskActions.SET_BAT_TOKEN_ADDED = 'SET_BAT_TOKEN_ADDED'
MetaMaskActions.TOGGLE_PROVIDER = 'TOGGLE_PROVIDER'
MetaMaskActions.PROVIDER_SET_SELECTED_ACCOUNT = 'PROVIDER_SET_SELECTED_ACCOUNT'
MetaMaskActions.providerSetSelectedAccount = providerSetSelectedAccount
MetaMaskActions.PROVIDER_SET_VIEW = 'PROVIDER_SET_VIEW'
MetaMaskActions.providerSetView = providerSetView

MetaMaskActions.showModal = showModal

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

function providerSetSelectedAccount (accountId) {
  return {
    type: MetaMaskActions.PROVIDER_SET_SELECTED_ACCOUNT,
    value: accountId,
  }
}

function providerSetView (view) {
  return {
    type: MetaMaskActions.PROVIDER_SET_VIEW,
    value: view,
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

  // XXX for testing
  if (payload.name === 'ACCOUNT_DETAILS') {
    return {
      type: MetaMaskActions.TOGGLE_PROVIDER,
    }
  }

  return {
    type: MetaMaskActions.MODAL_OPEN,
    payload,
  }
}

module.exports = MetaMaskActions
