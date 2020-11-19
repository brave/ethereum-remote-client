import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import CurrencyDisplay from '../../../../../../../ui/app/components/ui/currency-display'
import AssetImage from '../../../../../../../ui/app/components/ui/asset-image'

import { supportedCoins } from '../../../../../../../app/scripts/controllers/bitgo'

import {
  BRAVE_BITGO_WALLET_INDEX,
} from '../../../../../../../ui/app/helpers/constants/routes'

const BitGoWallets = () => {
  const { bitgoWallets } = useSelector(({ metamask: { BitGoController } }) => BitGoController)

  return (
    <div>
      {Object.entries(bitgoWallets).map(([id, wallet]) => (
        <BitGoWallet key={`bitgo-${id}`} wallet={wallet} />
      ))}
    </div>
  )
}

export default BitGoWallets

export const BitGoWallet = ({ wallet }) => {
  const history = useHistory()
  const handleClick = useCallback(() => {
    history.push(BRAVE_BITGO_WALLET_INDEX)
  }, [history])

  const { coin } = wallet
  const label = supportedCoins[coin.toLowerCase()]

  return (
    <div
      className="account-menu__account menu__item--clickable"
      onClick={handleClick}
    >
      <AssetImage className="identicon" asset={wallet.coin} style={{ width: '24px', height: '24px' }}/>
      <div className="account-menu__account-info" style={{ margin: '-10px 0px 0px 15px' }}>
        <div className="account-menu__name" style={{ color: '#000' }}>
          { label }
        </div>
        <CurrencyDisplay
          currency={wallet.coin.toUpperCase()}
          className="account-menu__balance"
          value={"0.0001"}
          numberOfDecimals={3}
        />
      </div>
    </div>
  )
}

