import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import CheckBox from '../../ui/check-box'
import BitGoLogoIcon from '../../../../../brave/ui/app/components/app/dropdowns/assets/bitgo-logo'
import CloseIcon from '../../ui/icon/close-icon'
import CloseIconDark from '../../ui/icon/close-icon-dark'

import { createBitGoWallet } from '../../../store/actions'
import { supportedCoins } from '../../../../../app/scripts/controllers/bitgo'

const INITIAL_CHECKED_ASSETS = new Map(
  Object.entries(supportedCoins).map(([k, v]) => [k, false])
)

export function CryptoImage({ asset }) {
  // temporary
  if (asset === 'bsv' || asset === 'btg' || asset === 'eos' || asset === 'algo' || asset == 'tbtc') {
    asset = 'btc'
  }

  return <img src={`images/${asset}-small.png`} />
}

export function Asset({ asset, name, ...props }) {
  const wallet = useSelector(({ brave }) => brave.bitGoCreatedWallets[asset])
  const exists = !!(wallet && wallet.address)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [willCreate, setWillCreate] = useState(false)

  const handleGenerateWallet = useCallback(() => {
    setLoading(true)
    dispatch(createBitGoWallet(asset))
  }, [dispatch])

  const handleCheckAsset = useCallback(() => {
    setWillCreate(!willCreate)
  })

  return (
    <div className={'__bitgo-wallet-item'} {...props}>
      <CheckBox
        checked={willCreate || exists}
        disabled={exists}
        onClick={handleCheckAsset}
        id={`${asset}-check`} />
      <div className="__asset-icon">
        <CryptoImage asset={asset} />
      </div>
      <div className="__asset-name">
        {name}
      </div>
      <div className="__asset-generate">
        {exists ? (
          wallet.address
         ) : (
          loading ? (
            <img src="images/loading.svg" width="24" height="24" />
          ) : (
            <a href='#' onClick={handleGenerateWallet}>{'Generate Wallet'}</a>
          )
         )}
      </div>
    </div>
  )
}

export default function BitGoModal({
  onClose,
  onCreate,
}) {

  function handleDone() {
    //const toCreate = [...checkedAssets.keys()].filter(k => checkedAssets.get(k))
    //return onCreate(toCreate)
    onClose()
  }

  return (
    <div className="bitgo-modal">
      <div className="__modal">
        <div className="__close" onClick={onClose}>
          <div className="close-light">
            <CloseIcon />
          </div>
          <div className="close-dark">
            <CloseIconDark />
          </div>
        </div>
        <div className="__content __bitgo" style={{ textAlign: 'left' }}>
          <BitGoLogoIcon className="bitgo-logo" />
          <h3>
            {'Generate Crypto Wallets'}
          </h3>
          <p>{'A new wallet address will be generated for each coin. One of three private keys are stored on BitGo. The other two keys will be stored securely in Brave.'}</p>
          <div className="__wallets-area">
            {Object.keys(supportedCoins).map(key => (
              <Asset key={`asset-${key}`}
                     asset={key}
                     name={supportedCoins[key]} />
            ))}
          </div>
        </div>
        <div className="__button-container">
          <button type="__button-create" onClick={handleDone}>
            {'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}

BitGoModal.propTypes = {
  hideAssets: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
}

BitGoModal.defaultProps = {
  hideAssets: [],
}
