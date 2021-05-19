import PropTypes from 'prop-types'

export const AssetPropTypes = PropTypes.shape({
  address: PropTypes.string,
  decimals: PropTypes.number,
  symbol: PropTypes.string,
  name: PropTypes.string.isRequired,
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
