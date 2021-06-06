// Actions
const UPDATE_SWAP_ERRORS = 'metamask/swap/UPDATE_SWAP_ERRORS'
const RESET_SWAP_STATE = 'metamask/swap/RESET_SWAP_STATE'

const initState = {
  errors: {},
}

// Reducer
export default function reducer (state = initState, action) {
  switch (action.type) {
    case UPDATE_SWAP_ERRORS:
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.value,
        },
      }
    case RESET_SWAP_STATE:
      return { ...initState }
    default:
      return state
  }
}

// Action Creators
export function updateSwapErrors (errorObject) {
  return {
    type: UPDATE_SWAP_ERRORS,
    value: errorObject,
  }
}

export function resetSwapState () {
  return { type: RESET_SWAP_STATE }
}
