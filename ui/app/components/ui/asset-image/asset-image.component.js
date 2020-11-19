import React from 'react'
import PropTypes from 'prop-types'

function getImageName(asset) {
  switch (asset.toLowerCase()) {
    // Testnet coins
    case 'talgo':
    case 'tbch':
    case 'tbtc':
    case 'tdash':
    case 'teos':
    case 'teth':
    case 'thbar':
    case 'tltc':
    case 'ttrx':
    case 'txlm':
    case 'txrp':
    case 'tzec':
    case 'tbtc':
      return asset.substr(1)

    case 'bsv':
    case 'btg':
    case 'eos':
    case 'algo':
      return 'btc'

    default:
      return asset
  }
}

const AssetImage = ({ asset, size, ...props }) => {
  let imageName = getImageName(asset.toLowerCase());
  return <img src={`images/${imageName}-${size}.png`} {...props} />
}

AssetImage.propTypes = {
  asset: PropTypes.string,
  size: PropTypes.oneOf(['small']),
}

AssetImage.defaultProps = {
  size: 'small',
}

export default AssetImage
