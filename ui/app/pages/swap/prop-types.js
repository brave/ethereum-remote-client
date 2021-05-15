import PropTypes from 'prop-types'

export const AssetPropTypes = PropTypes.shape({
  address: PropTypes.string,
  decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  symbol: PropTypes.string,
})

export const QuotePropTypes = PropTypes.shape({
  price: PropTypes.string,
  to: PropTypes.string,
  data: PropTypes.string,
  value: PropTypes.string,
  gas: PropTypes.string,
  estimatedGas: PropTypes.string,
  gasPrice: PropTypes.string,
  buyAmount: PropTypes.string,
  sellAmount: PropTypes.string,
})
