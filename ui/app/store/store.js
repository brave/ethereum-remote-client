import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools'
import rootReducer from '../ducks'


export default function configureStore (initialState) {
  const composeEnhancers = composeWithDevTools({
    name: 'MetaMask',
    hostname: 'localhost',
    port: 8000,
    realtime: Boolean(process.env.METAMASK_DEBUG),
    trace: true, 
    traceLimit: 25,
  })
  return createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
    ),
  ))
}

