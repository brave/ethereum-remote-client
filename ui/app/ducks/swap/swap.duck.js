// Actions
const OPEN_TO_DROPDOWN = 'metamask/swap/OPEN_TO_DROPDOWN'
const CLOSE_TO_DROPDOWN = 'metamask/swap/CLOSE_TO_DROPDOWN'
const UPDATE_SWAP_ERRORS = 'metamask/swap/UPDATE_SWAP_ERRORS'
const RESET_SWAP_STATE = 'metamask/swap/RESET_SWAP_STATE'
const SHOW_GAS_BUTTON_GROUP = 'metamask/swap/SHOW_GAS_BUTTON_GROUP'
const HIDE_GAS_BUTTON_GROUP = 'metamask/swap/HIDE_GAS_BUTTON_GROUP'

const initState = {
  toDropdownOpen: false,
  gasButtonGroupShown: true,
  errors: {},
}

// Reducer
export default function reducer (state = initState, action) {
  switch (action.type) {
    case OPEN_TO_DROPDOWN:
      return {
        ...state,
        toDropdownOpen: true,
      }
    case CLOSE_TO_DROPDOWN:
      return {
        ...state,
        toDropdownOpen: false,
      }
    case UPDATE_SWAP_ERRORS:
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.value,
        },
      }
    case SHOW_GAS_BUTTON_GROUP:
      return {
        ...state,
        gasButtonGroupShown: true,
      }
    case HIDE_GAS_BUTTON_GROUP:
      return {
        ...state,
        gasButtonGroupShown: false,
      }
    case RESET_SWAP_STATE:
      return { ...initState }
    default:
      return state
  }
}

// Action Creators
export function openToDropdown () {
  return { type: OPEN_TO_DROPDOWN }
}

export function closeToDropdown () {
  return { type: CLOSE_TO_DROPDOWN }
}

export function showGasButtonGroup () {
  return { type: SHOW_GAS_BUTTON_GROUP }
}

export function hideGasButtonGroup () {
  return { type: HIDE_GAS_BUTTON_GROUP }
}

export function updateSwapErrors (errorObject) {
  return {
    type: UPDATE_SWAP_ERRORS,
    value: errorObject,
  }
}

export function resetSwapState () {
  return { type: RESET_SWAP_STATE }
}
