const MetaMaskActions = require('../../../../ui/app/store/actions')

MetaMaskActions.addToken = addToken
MetaMaskActions.setBatTokenAdded = setBatTokenAdded
MetaMaskActions.SET_BAT_TOKEN_ADDED = 'SET_BAT_TOKEN_ADDED'

MetaMaskActions.showModal = showModal

function setBatTokenAdded () {
  return (dispatch) => {
    background.setBatTokenAdded((err) => {
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
    })
    dispatch({
      type: actions.SET_BAT_TOKEN_ADDED,
      value: true
    })
  }
}

function addToken (address, symbol, decimals, image) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.addToken(address, symbol, decimals, image, (err, tokens) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        } else if (symbol === 'BAT') {
          dispatch(actions.setBatTokenAdded())
        }
        dispatch(actions.updateTokens(tokens))
        resolve(tokens)
      })
    })
  }
}

function showModal (payload) {
  if (payload.name === 'METAMETRICS_OPT_IN_MODAL') {
    return {
      type: '',
      payload: {}
    }
  }

  return {
    type: actions.MODAL_OPEN,
    payload,
  }
}

module.exports = MetaMaskActions
