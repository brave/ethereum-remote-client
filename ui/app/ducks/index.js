import { combineReducers } from 'redux'
import metamaskReducer from './metamask/metamask'
import localeMessagesReducer from './locale/locale'
import sendReducer from './send/send.duck'
import swapReducer from './swap/swap.duck'
import appStateReducer from './app/app'
import confirmTransactionReducer from './confirm-transaction/confirm-transaction.duck'
import gasReducer from './gas/gas.duck'
import { invalidCustomNetwork, unconnectedAccount } from './alerts'
import historyReducer from './history/history'
import { ALERT_TYPES } from '../../../app/scripts/controllers/alert'

export default combineReducers({
  [ALERT_TYPES.invalidCustomNetwork]: invalidCustomNetwork,
  [ALERT_TYPES.unconnectedAccount]: unconnectedAccount,
  activeTab: (s) => (s === undefined ? null : s),
  metamask: metamaskReducer,
  appState: appStateReducer,
  history: historyReducer,
  send: sendReducer,
  swap: swapReducer,
  confirmTransaction: confirmTransactionReducer,
  gas: gasReducer,
  localeMessages: localeMessagesReducer,
})
