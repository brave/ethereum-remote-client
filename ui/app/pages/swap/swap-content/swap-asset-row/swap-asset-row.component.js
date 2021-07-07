import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { Tooltip as ReactTippy } from 'react-tippy'
import InputAdornment from '@material-ui/core/InputAdornment'
import Fuse from 'fuse.js'

import Identicon from '../../../../components/ui/identicon/identicon.component'
import TokenBalance from '../../../../components/ui/token-balance'
import CurrencyDisplay from '../../../../components/ui/currency-display'
import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'
import { calcTokenAmount } from '../../../../helpers/utils/token-util'
import { conversionGTE } from '../../../../helpers/utils/conversion-util'
import TextField from '../../../../components/ui/text-field'
import { MAINNET, ROPSTEN } from '../../../../../../app/scripts/controllers/network/enums'
import SwapAmountRow from '../swap-amount-row'
import SwapRowErrorMessage from '../swap-error-message'
import { AssetPropTypes, QuotePropTypes } from '../../prop-types'
import assetsMap from '../../assets'
import AmountMaxButton from '../amount-max-button'
import { hexAmountToDecimal } from '../../swap.utils'

const fuseFactory = (network) =>
  new Fuse(assetsMap[network], {
    shouldSort: true,
    threshold: 0.45,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'symbol', weight: 0.5 },
    ],
  })

const fuseDB = {
  [MAINNET]: fuseFactory(MAINNET),
  [ROPSTEN]: fuseFactory(ROPSTEN),
}

export default class SwapAssetRow extends Component {
  static propTypes = {
    selectedAccount: PropTypes.object.isRequired,
    fromAsset: AssetPropTypes,
    fromTokenAssetBalance: PropTypes.string,
    fromTokenAssetAllowance: PropTypes.string,
    toAsset: AssetPropTypes,
    quote: QuotePropTypes,
    setFromAsset: PropTypes.func.isRequired,
    setToAsset: PropTypes.func.isRequired,
    refreshQuote: PropTypes.func.isRequired,
    amount: PropTypes.string,
    setAllowance: PropTypes.func.isRequired,
    customAllowance: PropTypes.string,
    setCustomAllowance: PropTypes.func.isRequired,
    network: PropTypes.string.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  state = {
    isShowingDropdownTo: false,
    isShowingDropdownFrom: false,
    searchQuery: '',
    searchResults: [],
  }

  debouncedRefreshQuote = debounce(this.props.refreshQuote, 400)

  getPopularAssets () {
    const { network } = this.props
    return assetsMap[network].slice(0, 10)
  }

  openDropdownTo = () => {
    this.setState({
      isShowingDropdownTo: true,
      searchResults: this.getPopularAssets(),
      searchQuery: '',
    })
  }

  openDropdownFrom = () => {
    this.setState({
      isShowingDropdownFrom: true,
      searchResults: this.getPopularAssets(),
      searchQuery: '',
    })
  }

  selectFromAsset = (asset) => {
    const { setFromAsset, setToAsset, toAsset, refreshQuote } = this.props

    this.setState(
      {
        isShowingDropdownFrom: false,
        searchResults: [],
        searchQuery: '',
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
        searchResults: [],
        searchQuery: '',
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

  renderAllowanceButton () {
    const { setAllowance, fromTokenAssetAllowance, amount, customAllowance, setCustomAllowance } =
      this.props
    const { t } = this.context

    if (!fromTokenAssetAllowance) {
      return null
    }

    const hasSufficientAllowance = conversionGTE(
      {
        value: fromTokenAssetAllowance,
        fromNumericBase: 'hex',
      },
      {
        value: amount,
        fromNumericBase: 'hex',
      },
    )

    if (fromTokenAssetAllowance !== '0' && hasSufficientAllowance) {
      return null
    }

    return (
      <div
        className="swap-v2__form-row-secondary-right"
        onClick={() => setAllowance(customAllowance, setCustomAllowance)}
      >
        {t('setAllowance')}
        {fromTokenAssetAllowance !== '0' && (
          <ReactTippy
            style={{
              paddingLeft: '5px',
            }}
            html={(
              <p
                style={{
                  textAlign: 'left',
                  width: '200px',
                  fontSize: 'small',
                }}
              >
                { t('swapApprovalSecurityMsg') }
              </p>
            )}
            distance={26}
            animation="none"
            position="top"
            arrow
          >
            <i className="fas fa-info-circle" style={{ color: 'orange' }} />
          </ReactTippy>
        )}
      </div>
    )
  }

  renderToAmount () {
    const { toAsset, quote } = this.props

    if (!toAsset || !quote) {
      return
    }

    const amount = calcTokenAmount(quote.buyAmount, toAsset.decimals).toFixed(4)
    return amount ? <CurrencyDisplay displayValue={amount} suffix={toAsset.symbol} /> : null
  }

  renderAssetBalance (asset, insideDropdown = false) {
    const { selectedAccount, fromTokenAssetBalance } = this.props

    return asset.address ? (
      insideDropdown ? (
        <TokenBalance token={asset} />
      ) : fromTokenAssetBalance === '0' ? (
        `0 ${asset.symbol}`
      ) : (
        <CurrencyDisplay
          displayValue={hexAmountToDecimal(fromTokenAssetBalance, asset)}
          suffix={asset.symbol}
        />
      )
    ) : (
      <UserPreferencedCurrencyDisplay value={selectedAccount?.balance} type={PRIMARY} />
    )
  }

  renderSwapFromAssetRow () {
    const { fromAsset } = this.props
    const { isShowingDropdownFrom } = this.state
    return (
      !isShowingDropdownFrom && (
        <div className="swap-v2__form-row">
          <div className="swap-v2__asset-dropdown">
            <div className="swap-v2__asset-dropdown__input-wrapper" onClick={this.openDropdownFrom}>
              {fromAsset
                ? this.renderAsset(fromAsset, this.selectFromAsset)
                : this.renderUnselectedAsset()}
            </div>
          </div>
          <div className={fromAsset ? 'swap-v2__from-amount-box' : 'swap-v2__to-amount-box'}>
            <SwapAmountRow refreshQuote={this.debouncedRefreshQuote} />
          </div>
        </div>
      )
    )
  }

  renderSwapToAssetRow () {
    const { toAsset } = this.props
    const { isShowingDropdownTo } = this.state

    return (
      !isShowingDropdownTo && (
        <div className="swap-v2__form-row">
          <div className="swap-v2__asset-dropdown">
            <div className="swap-v2__asset-dropdown__input-wrapper" onClick={this.openDropdownTo}>
              {toAsset
                ? this.renderAsset(toAsset, this.selectToAsset)
                : this.renderUnselectedAsset()}
            </div>
          </div>
          <div className="swap-v2__to-amount-box">{this.renderToAmount()}</div>
        </div>
      )
    )
  }

  renderUnselectedAsset () {
    const { t } = this.context

    return (
      <div className="swap-v2__asset-dropdown__asset">
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">
            { t('selectAsset') }
          </div>
        </div>
        <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
      </div>
    )
  }

  handleSearch (searchQuery) {
    const { network } = this.props
    const fuse = fuseDB[network]

    this.setState({ searchQuery }, () => {
      const fuseSearchResult = fuse.search(searchQuery)
      this.setState({
        searchResults: fuseSearchResult,
      })
    })
  }

  renderAssetDropdown (fromOrTo) {
    const { isShowingDropdownFrom, isShowingDropdownTo, searchQuery, searchResults } = this.state
    const { t } = this.context

    const isShowingDropdown = fromOrTo === 'from' ? isShowingDropdownFrom : isShowingDropdownTo

    const selector = fromOrTo === 'from' ? this.selectFromAsset : this.selectToAsset

    return (
      isShowingDropdown && (
        <div className="swap-v2__form-row">
          <TextField
            placeholder={t('searchAssets')}
            type="text"
            value={searchQuery}
            onChange={(e) => this.handleSearch(e.target.value)}
            startAdornment={(
              <InputAdornment position="start" style={{ marginRight: '12px' }}>
                <img src="images/search.svg" />
              </InputAdornment>
            )}
            onBlur={() =>
              setTimeout(
                () =>
                  this.setState({
                    isShowingDropdownFrom: false,
                    isShowingDropdownTo: false,
                    searchQuery: '',
                    searchResults: [],
                  }),
                250,
              )
            }
            autoFocus
            fullWidth
          />

          {searchResults.length !== 0 && (
            <div className="swap-v2__asset-dropdown__list">
              {searchResults.map((asset) => this.renderAsset(asset, selector, true))}
            </div>
          )}
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
              <span className="swap-v2__asset-dropdown__name__label">{`${t('balance')}:`}</span>
              {this.renderAssetBalance(asset, insideDropdown)}
            </div>
          )}
        </div>
        {!insideDropdown && <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />}
      </div>
    )
  }

  render () {
    const { t } = this.context
    const { fromAsset, refreshQuote } = this.props

    return (
      <div>
        <div className="swap-v2__form-row">
          <span className="swap-v2__form-row-header-left">{`${t('from')}`}</span>
          <AmountMaxButton refreshQuote={refreshQuote} />
        </div>

        {this.renderSwapFromAssetRow()}
        {this.renderAssetDropdown('from')}

        <div className="swap-v2__form-row-full" style={{ display: 'block' }}>
          <SwapRowErrorMessage errorType="amount" />
          <SwapRowErrorMessage errorType="gasFee" />
          <SwapRowErrorMessage errorType="quote" />
        </div>

        {fromAsset && (
          <div className="swap-v2__form-row">
            <div className="swap-v2__form-row-secondary-left">
              <span>{`${t('balance')}:`}</span>
              <span>{this.renderAssetBalance(fromAsset)}</span>
            </div>
            {this.renderAllowanceButton()}
          </div>
        )}

        <div className="swap-v2__form-row">
          <span className="swap-v2__form-row-header-left">{`${t('to')}`}</span>
        </div>

        {this.renderSwapToAssetRow()}
        {this.renderAssetDropdown('to')}
      </div>
    )
  }
}
