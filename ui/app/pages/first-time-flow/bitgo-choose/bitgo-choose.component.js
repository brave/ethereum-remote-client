import React, { useCallback, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import {
  INITIALIZE_SELECT_ACTION_ROUTE,
  BRAVE_BITGO_WALLET_INDEX,
} from '../../../helpers/constants/routes'

import {
  createBitGoWallet,
} from '../../../store/actions'

import { I18nContext } from '../../../contexts/i18n'
import BitGoLogoIcon from '../../../../../brave/ui/app/components/app/dropdowns/assets/bitgo-logo'
import { supportedCoins } from '../../../../../app/scripts/controllers/bitgo'

import Button from '../../../components/ui/button'
import CheckBox from '../../../components/ui/check-box'
import AssetImage from '../../../components/ui/asset-image'

const Asset = ({ asset, checked, name, onClick, ...props }) => {
  const wallet = useSelector(({ brave }) => brave.bitGoCreatedWallets[asset])
  const exists = !!(wallet && wallet.address)

  return (
    <div className="__bitgo-wallet-item" {...props}>
      <CheckBox
        checked={checked}
        disabled={exists}
        onClick={onClick}
        id={`${asset}-check`} />
      <div className="__asset-icon">
        <AssetImage asset={asset} />
      </div>
      <div className="__asset-name">
        {name}
      </div>
      <div className="__asset-generate">
        {exists && wallet.address}
      </div>
    </div>
  )
}

const BitGoChoose = () => {
  const t = useContext(I18nContext)
  const history = useHistory()
  const dispatch = useDispatch()
  const [toCreate, setToCreate] = useState([])

  const handleBack = useCallback((e) => {
    e.preventDefault()
    history.push(INITIALIZE_SELECT_ACTION_ROUTE)
  }, [history])

  const handleAssetToggled = useCallback((asset) => {
    const i = toCreate.indexOf(asset)
    if (i >= 0) {
      toCreate.splice(i, 1)
    } else {
      toCreate.push(asset)
    }

    setToCreate([...toCreate])
  }, [toCreate, setToCreate])

  const handleCreate = useCallback((event) => {
    event.preventDefault()

    for (const asset of toCreate) {
      dispatch(createBitGoWallet(asset))
    }

    history.push(BRAVE_BITGO_WALLET_INDEX)
  }, [dispatch])

  return (
    <div className="first-time-flow__wrapper">
      <div>
        <div className="first-time-flow__create-back">
          <a onClick={handleBack} href="#">
            {`< Back`}
          </a>
        </div>
        <div className="first-time-flow__header">
          Create BitGo Wallets
        </div>
        <BitGoLogoIcon className="bitgo-logo" />
        <div className="first-time-flow__text-block">
          A new wallet address will be generated for each coin. One of three private keys are stored on BitGo. The other two keys will be stored securely in Brave.
        </div>
        <form
          className="first-time-flow__form"
          onSubmit={handleCreate}
        >
          <div className="__wallets-area">
            {Object.keys(supportedCoins).map((key) => (
              <Asset
                key={`asset-${key}`}
                asset={key}
                name={supportedCoins[key]}
                checked={toCreate.includes(key)}
                onClick={() => handleAssetToggled(key)}
              />
            ))}
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            disabled={toCreate.length === 0}
            onClick={handleCreate}
          >
            { t('create') }
          </Button>
        </form>
      </div>
    </div>
  )
}

export default BitGoChoose
