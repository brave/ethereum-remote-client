import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

import Identicon from '../../../../components/ui/identicon/identicon.component'
import TokenBalance from '../../../../components/ui/token-balance'
import CurrencyDisplay from '../../../../components/ui/currency-display'
import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'
import { calcTokenAmount } from '../../../../helpers/utils/token-util'

import SwapAmountRow from '../swap-amount-row'
import SwapRowErrorMessage from '../swap-row-wrapper/swap-row-error-message'
import { AssetPropTypes, QuotePropTypes } from '../../prop-types'
import { assets } from '../../asset-registry'
import AmountMaxButton from '../amount-max-button'
import { hexAmountToDecimal } from '../swap.utils'


export default class SwapAssetRow extends Component {
  static propTypes = {
    selectedAccount: PropTypes.object.isRequired,
    fromAsset: AssetPropTypes,
    fromTokenAssetBalance: PropTypes.string,
    toAsset: AssetPropTypes,
    quote: QuotePropTypes,
    setFromAsset: PropTypes.func.isRequired,
    setToAsset: PropTypes.func.isRequired,
    refreshQuote: PropTypes.func.isRequired,
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

  debouncedRefreshQuote = debounce(this.props.refreshQuote, 400)

  selectFromAsset = (asset) => {
    const { setFromAsset, setToAsset, toAsset, refreshQuote } = this.props

    this.setState(
      {
        isShowingDropdownFrom: false,
      },
      () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Swap',
            action: 'Swap Screen',
            name: 'User clicks "From" dropdown',
          },
          customVariables: {
            assetSelected: asset?.symbol,
          },
        })

        setFromAsset(asset)
        toAsset?.address === asset?.address && toAsset?.symbol === asset?.symbol
          ? setToAsset()
          : refreshQuote(asset, toAsset)
      },
    )
  }

  selectToAsset = (asset) => {
    const { setFromAsset, setToAsset, fromAsset, refreshQuote } = this.props

    this.setState(
      {
        isShowingDropdownTo: false,
      },
      () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Swap',
            action: 'Swap Screen',
            name: 'User clicks "To" dropdown',
          },
          customVariables: {
            assetSelected: asset?.symbol,
          },
        })

        setToAsset(asset)
        fromAsset?.address === asset?.address && fromAsset?.symbol === asset?.symbol
          ? setFromAsset()
          : refreshQuote(fromAsset, asset)
      },
    )
  }

  render () {
    const { t } = this.context
    const { fromAsset } = this.props

    return (
      <div>
        <div className="swap-v2__form-row">
          <span className="swap-v2__form-row-label">{`${t('from')}`}</span>
          <AmountMaxButton />
        </div>

        <div className="swap-v2__form-row">
          <div className="swap-v2__asset-dropdown">
            {this.renderSwapFromAsset()}
            {this.renderFromAssetDropdown()}
          </div>
          <div
            className={
              fromAsset ? 'swap-v2__from-amount-box' : 'swap-v2__to-amount-box'
            }
          >
            <SwapAmountRow refreshQuote={this.debouncedRefreshQuote} /> {/** TODO (@onyb): add updateGas prop */}
          </div>
        </div>

        <div className="swap-v2__form-row-full">
          <SwapRowErrorMessage errorType="amount" />
        </div>

        {fromAsset && (
          <div className="swap-v2__form-row-full">
            <span>{`${t('balance')}:`}</span>
            <span>{this.renderAssetBalance(fromAsset)}</span>
          </div>
        )}

        <div className="swap-v2__form-row">
          <span className="swap-v2__form-row-label">{`${t('to')}`}</span>
        </div>

        <div className="swap-v2__form-row">
          <div className="swap-v2__asset-dropdown">
            {this.renderSwapToAsset()}
            {this.renderToAssetDropdown()}
          </div>
          <div className="swap-v2__to-amount-box">{this.renderToAmount()}</div>
        </div>
      </div>
    )
  }

  renderToAmount () {
    const { toAsset, quote } = this.props

    if (!toAsset || !quote) {
      return
    }

    const amount = calcTokenAmount(quote.buyAmount, toAsset.decimals).toFixed(4)
    return <CurrencyDisplay displayValue={amount} suffix={toAsset.symbol} />
  }

  renderAssetBalance (asset, insideDropdown = false) {
    const { selectedAccount, fromTokenAssetBalance } = this.props

    return asset.address ? (
      insideDropdown ? <TokenBalance token={asset} /> : (
        fromTokenAssetBalance === '0' ? `0 ${asset.symbol}`
          : (
            <CurrencyDisplay
              displayValue={hexAmountToDecimal(fromTokenAssetBalance, asset)}
              suffix={asset.symbol}
            />
          )
      )
    ) : (
      <UserPreferencedCurrencyDisplay value={selectedAccount?.balance} type={PRIMARY} />
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
          ? this.renderAsset(fromAsset, this.selectFromAsset)
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
          ? this.renderAsset(toAsset, this.selectToAsset)
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
            {assets.map((asset) =>
              this.renderAsset(asset, this.selectFromAsset, true),
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
            {assets.map((asset) =>
              this.renderAsset(asset, this.selectToAsset, true),
            )}
          </div>
        </div>
      )
    )
  }

  renderAsset (asset, onSelectAsset, insideDropdown = false) {
    const { address, symbol } = asset
    const { t } = this.context

    return (
      <div
        key={address || symbol}
        className="swap-v2__asset-dropdown__asset"
        onClick={() => insideDropdown && onSelectAsset(asset)}
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
              {this.renderAssetBalance(asset, insideDropdown)}
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
