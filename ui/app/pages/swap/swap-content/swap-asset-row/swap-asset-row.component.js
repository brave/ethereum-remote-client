import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Identicon from '../../../../components/ui/identicon/identicon.component'
import TokenBalance from '../../../../components/ui/token-balance'
import CurrencyDisplay from '../../../../components/ui/currency-display'
import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'
import { calcTokenAmount } from '../../../../helpers/utils/token-util'

import SwapAmountRow from '../swap-amount-row'
import SwapRowErrorMessage from '../swap-row-wrapper/swap-row-error-message'

const AssetPropTypes = PropTypes.shape({
  address: PropTypes.string,
  decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  symbol: PropTypes.string,
})

export default class SwapAssetRow extends Component {
  static propTypes = {
    assets: PropTypes.arrayOf(AssetPropTypes).isRequired,
    accounts: PropTypes.object.isRequired,
    selectedAddress: PropTypes.string.isRequired,
    fromAsset: AssetPropTypes.isRequired,
    toAsset: AssetPropTypes.isRequired,
    setFromAsset: PropTypes.func.isRequired,
    setToAsset: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  state = {
    isShowingDropdownTo: false,
    isShowingDropdownFrom: false,
  }

  openDropdownTo = () => this.setState({ isShowingDropdownTo: true })

  closeDropdownTo = () => this.setState({ isShowingDropdownTo: false })

  openDropdownFrom = () => this.setState({ isShowingDropdownFrom: true })

  closeDropdownFrom = () => this.setState({ isShowingDropdownFrom: false })

  selectFromAsset = (asset) => {
    const { setFromAsset, setToAsset, toAsset } = this.props

    this.setState(
      {
        isShowingDropdownFrom: false,
      },
      () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Swap',
            action: 'Swap Screen',
            name: 'User clicks "Assets" dropdown',
          },
          customVariables: {
            assetSelected: asset?.symbol,
          },
        })

        setFromAsset(asset)
        toAsset &&
          toAsset.address === asset.address &&
          toAsset.symbol === asset.symbol &&
          setToAsset()
      },
    )
  }

  selectToAsset = (asset) => {
    const { setFromAsset, setToAsset, fromAsset } = this.props

    this.setState(
      {
        isShowingDropdownTo: false,
      },
      () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Swap',
            action: 'Swap Screen',
            name: 'User clicks "Assets" dropdown',
          },
          customVariables: {
            assetSelected: asset?.symbol,
          },
        })

        setToAsset(asset)
        fromAsset &&
          fromAsset.address === asset.address &&
          fromAsset.symbol === asset.symbol &&
          setFromAsset()
      },
    )
  }

  render () {
    const { t } = this.context
    const { fromAsset, assets } = this.props

    return (
      <div>
        <div className="swap-v2__form-row">
          <span className="swap-v2__form-row-label">{`${t('from')}`}</span>
        </div>

        <div className="swap-v2__form-row">
          <div className="swap-v2__asset-dropdown">
            {this.renderSwapFromAsset()}
            {assets.length > 0 && this.renderFromAssetDropdown()}
          </div>
          <div
            className={
              fromAsset ? 'swap-v2__from-amount-box' : 'swap-v2__to-amount-box'
            }
          >
            <SwapAmountRow /> {/** TODO (@onyb): add updateGas prop */}
          </div>
        </div>

        <div className="swap-v2__form-row-full">
          <SwapRowErrorMessage errorType="amount" />
        </div>

        {fromAsset && (
          <div className="swap-v2__form-row-full">
            <span>{`${t('balance')}:`}</span>
            <span>{this.renderFromBalance()}</span>
          </div>
        )}

        <div className="swap-v2__form-row">
          <span className="swap-v2__form-row-label">{`${t('to')}`}</span>
        </div>

        <div className="swap-v2__form-row">
          <div className="swap-v2__asset-dropdown">
            {this.renderSwapToAsset()}
            {assets.length > 0 && this.renderToAssetDropdown()}
          </div>
          <div className="swap-v2__to-amount-box">
            {this.renderToAmount()}
          </div>
        </div>
      </div>
    )
  }

  getSelectedETHAccountBalance () {
    const { accounts, selectedAddress } = this.props
    return accounts[selectedAddress] ? accounts[selectedAddress].balance : ''
  }

  renderToAmount () {
    const { toAsset, quote } = this.props

    if (!toAsset || !quote) {
      return
    }

    const amount = calcTokenAmount(quote.buyAmount, toAsset.decimals).toFixed(4)
    return <CurrencyDisplay displayValue={amount} suffix={toAsset.symbol} />
  }

  renderFromBalance () {
    const { fromAsset } = this.props
    const balanceValue = this.getSelectedETHAccountBalance()

    return fromAsset.address ? (
      <TokenBalance token={fromAsset} />
    ) : (
      <UserPreferencedCurrencyDisplay value={balanceValue} type={PRIMARY} />
    )
  }

  renderSwapFromAsset () {
    const { fromAsset } = this.props
    return (
      <div
        className="swap-v2__asset-dropdown__input-wrapper"
        onClick={this.openDropdownFrom}
      >
        {fromAsset
          ? fromAsset.address
            ? this.renderFromAsset(fromAsset)
            : this.renderFromEth(fromAsset)
          : this.renderUnselectedAsset()}
      </div>
    )
  }

  renderSwapToAsset () {
    const { toAsset } = this.props

    return (
      <div
        className="swap-v2__asset-dropdown__input-wrapper"
        onClick={this.openDropdownTo}
      >
        {toAsset
          ? toAsset.address
            ? this.renderToAsset(toAsset)
            : this.renderToEth(toAsset)
          : this.renderUnselectedAsset()}
      </div>
    )
  }

  renderUnselectedAsset () {
    return (
      <div className="swap-v2__asset-dropdown__asset">
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">Select asset</div>
        </div>
        <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
      </div>
    )
  }

  renderFromAssetDropdown () {
    return (
      this.state.isShowingDropdownFrom && (
        <div>
          <div
            className="swap-v2__asset-dropdown__close-area"
            onClick={this.closeDropdownFrom}
          />
          <div className="swap-v2__asset-dropdown__list">
            {this.props.assets.map((asset) =>
              (asset.address
                ? this.renderFromAsset(asset, true)
                : this.renderFromEth(asset, true)),
            )}
          </div>
        </div>
      )
    )
  }

  renderToAssetDropdown () {
    return (
      this.state.isShowingDropdownTo && (
        <div>
          <div
            className="swap-v2__asset-dropdown__close-area"
            onClick={this.closeDropdownTo}
          />
          <div className="swap-v2__asset-dropdown__list">
            {this.props.assets.map((asset) =>
              (asset.address
                ? this.renderToAsset(asset, true)
                : this.renderToEth(asset, true)),
            )}
          </div>
        </div>
      )
    )
  }

  renderFromEth (asset, insideDropdown = false) {
    const { t } = this.context

    const balanceValue = this.getSelectedETHAccountBalance()

    return (
      <div
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectFromAsset(asset)}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">ETH</div>
          {insideDropdown && (
            <div className="swap-v2__asset-dropdown__name">
              <span className="swap-v2__asset-dropdown__name__label">
                {`${t('balance')}:`}
              </span>
              <UserPreferencedCurrencyDisplay value={balanceValue} type={PRIMARY} />
            </div>
          )}
        </div>
        {!insideDropdown && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }

  renderToEth (asset, insideDropdown = false) {
    const { t } = this.context

    const balanceValue = this.getSelectedETHAccountBalance()

    return (
      <div
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectToAsset(asset)}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">ETH</div>
          {insideDropdown && (
            <div className="swap-v2__asset-dropdown__name">
              <span className="swap-v2__asset-dropdown__name__label">
                {`${t('balance')}:`}
              </span>
              <UserPreferencedCurrencyDisplay value={balanceValue} type={PRIMARY} />
            </div>
          )}
        </div>
        {!insideDropdown && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }

  renderFromAsset (asset, insideDropdown = false) {
    const { address, symbol } = asset
    const { t } = this.context

    return (
      <div
        key={address}
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectFromAsset(asset)}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon address={address} diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">{symbol}</div>
          {insideDropdown && (
            <div className="swap-v2__asset-dropdown__name">
              <span className="swap-v2__asset-dropdown__name__label">
                {`${t('balance')}:`}
              </span>
              <TokenBalance token={asset} />
            </div>
          )}
        </div>
        {!insideDropdown && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }

  renderToAsset (asset, insideDropdown = false) {
    const { address, symbol } = asset
    const { t } = this.context

    return (
      <div
        key={address}
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectToAsset(asset)}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon address={address} diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">{symbol}</div>
          {insideDropdown && (
            <div className="swap-v2__asset-dropdown__name">
              <span className="swap-v2__asset-dropdown__name__label">
                {`${t('balance')}:`}
              </span>
              <TokenBalance token={asset} />
            </div>
          )}
        </div>
        {!insideDropdown && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }
}
