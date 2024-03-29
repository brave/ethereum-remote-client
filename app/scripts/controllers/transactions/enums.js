const TRANSACTION_TYPE_CANCEL = 'cancel'
const TRANSACTION_TYPE_RETRY = 'retry'
const TRANSACTION_TYPE_STANDARD = 'standard'

const TRANSACTION_STATUS_APPROVED = 'approved'
const TRANSACTION_STATUS_CONFIRMED = 'confirmed'

const TRANSACTION_ENVELOPE_TYPES = {
  LEGACY: '0x0',
  ACCESS_LIST: '0x1',
  FEE_MARKET: '0x2',
}

export {
  TRANSACTION_TYPE_CANCEL,
  TRANSACTION_TYPE_RETRY,
  TRANSACTION_TYPE_STANDARD,
  TRANSACTION_STATUS_APPROVED,
  TRANSACTION_STATUS_CONFIRMED,
  TRANSACTION_ENVELOPE_TYPES,
}
