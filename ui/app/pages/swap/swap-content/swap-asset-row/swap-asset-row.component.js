import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapRowWrapper from '../swap-row-wrapper'
import Identicon from '../../../../components/ui/identicon/identicon.component'
import TokenBalance from '../../../../components/ui/token-balance'
import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'

export default class SwapAssetRow extends Component {
  static propTypes = {
    tokensFrom: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string,
        decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        symbol: PropTypes.string,
      }),
    ).isRequired,
    accounts: PropTypes.object.isRequired,
    selectedAddress: PropTypes.string.isRequired,
    swapFromTokenAddress: PropTypes.string,
    swapToTokenAddress: PropTypes.string,
    setSwapFromToken: PropTypes.func.isRequired,
    setSwapToToken: PropTypes.func.isRequired,
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

  selectTokenFrom = (token) => {
    this.setState({
      isShowingDropdownFrom: false,
    }, () => {
      this.context.metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Swap Screen',
          name: 'User clicks "Assets" dropdown',
        },
        customVariables: {
          assetSelected: token ? 'ERC20' : 'ETH',
        },
      })
      this.props.setSwapFromToken(token)
    })
  }

  selectTokenTo = (token) => {
    this.setState({
      isShowingDropdownTo: false,
    }, () => {
      this.context.metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Swap Screen',
          name: 'User clicks "Assets" dropdown',
        },
        customVariables: {
          assetSelected: token ? 'ERC20' : 'ETH',
        },
      })
      this.props.setSwapToToken(token)
    })
  }

  render () {
    const { t } = this.context
    console.log(this.props)

    return (
    <div>
      <SwapRowWrapper label={`${t('from')}:`}>
        <div className="swap-v2__asset-dropdown">
          { this.renderSwapTokenFrom() }
          { this.props.tokensFrom.length > 0 ? this.renderAssetDropdownFrom() : null }
        </div>
      </SwapRowWrapper>
      <SwapRowWrapper label={`${t('to')}:`}>
      <div className="swap-v2__asset-dropdown">
        { this.renderSwapTokenTo() }
        { this.props.tokensTo.length > 0 ? this.renderAssetDropdownTo() : null }
      </div>
    </SwapRowWrapper>
    </div>
    )
  }

  renderSwapTokenFrom () {
    const { swapTokenFromAddress } = this.props
    const token = this.props.tokensFrom.find(({ address }) => address === swapTokenFromAddress)
    return (
      <div
        className="swap-v2__asset-dropdown__input-wrapper"
        onClick={this.openDropdownFrom}
      >
        { token ? this.renderAssetFrom(token) : this.renderEthFrom() }
      </div>
    )
  }

  renderSwapTokenTo () {
    const { swapToTokenAddress } = this.props
    const token = this.props.tokensTo.find(({ address }) => address === swapToTokenAddress)
    return (
      <div
        className="swap-v2__asset-dropdown__input-wrapper"
        onClick={this.openDropdownTo}
      >
        { token ? this.renderAssetTo(token) : this.renderEthTo() }
      </div>
    )
  }

  renderAssetDropdownFrom () {
    return this.state.isShowingDropdownFrom && (
      <div>
        <div
          className="swap-v2__asset-dropdown__close-area"
          onClick={this.closeDropdownFrom}
        />
        <div className="swap-v2__asset-dropdown__list">
          { this.renderEthFrom(true) }
          { this.props.tokensFrom.map((token) => this.renderAssetFrom(token, true)) }
        </div>
      </div>
    )
  }

  renderAssetDropdownTo () {
    return this.state.isShowingDropdownTo && (
      <div>
        <div
          className="swap-v2__asset-dropdown__close-area"
          onClick={this.closeDropdownTo}
        />
        <div className="swap-v2__asset-dropdown__list">
          { this.renderEthTo(true) }
          { this.props.tokensTo.map((token) => this.renderAssetTo(token, true)) }
        </div>
      </div>
    )
  }

  renderEthFrom (insideDropdown = false) {
    const { t } = this.context
    const { accounts, selectedAddress } = this.props

    const balanceValue = accounts[selectedAddress] ? accounts[selectedAddress].balance : ''

    return (
      <div
        className={ this.props.tokensFrom.length > 0 ? 'swap-v2__asset-dropdown__asset' : 'swap-v2__asset-dropdown__single-asset' }
        onClick={() => this.selectTokenFrom()}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">ETH</div>
          <div className="swap-v2__asset-dropdown__name">
            <span className="swap-v2__asset-dropdown__name__label">{`${t('balance')}:`}</span>
            <UserPreferencedCurrencyDisplay
              value={balanceValue}
              type={PRIMARY}
            />
          </div>
        </div>
        { !insideDropdown && this.props.tokensFrom.length > 0 && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }

  renderEthTo (insideDropdown = false) {
    const { t } = this.context
    const { accounts, selectedAddress } = this.props

    const balanceValue = accounts[selectedAddress] ? accounts[selectedAddress].balance : ''

    return (
      <div
        className={ this.props.tokensTo.length > 0 ? 'swap-v2__asset-dropdown__asset' : 'swap-v2__asset-dropdown__single-asset' }
        onClick={() => this.selectTokenFrom()}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">ETH</div>
          <div className="swap-v2__asset-dropdown__name">
            <span className="swap-v2__asset-dropdown__name__label">{`${t('balance')}:`}</span>
            <UserPreferencedCurrencyDisplay
              value={balanceValue}
              type={PRIMARY}
            />
          </div>
        </div>
        { !insideDropdown && this.props.tokensTo.length > 0 && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }

  renderAssetFrom (token, insideDropdown = false) {
    const { address, symbol } = token
    const { t } = this.context

    return (
      <div
        key={address}
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectTokenFrom(token)}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon address={address} diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">
            { symbol }
          </div>
          <div className="swap-v2__asset-dropdown__name">
            <span className="swap-v2__asset-dropdown__name__label">{`${t('balance')}:`}</span>
            <TokenBalance
              token={token}
            />
          </div>
        </div>
        { !insideDropdown && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }
  
  renderAssetTo (token, insideDropdown = false) {
    const { address, symbol } = token
    const { t } = this.context
  
    return (
      <div
        key={address}
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectTokenTo(token)}
      >
        <div className="swap-v2__asset-dropdown__asset-icon">
          <Identicon address={address} diameter={36} />
        </div>
        <div className="swap-v2__asset-dropdown__asset-data">
          <div className="swap-v2__asset-dropdown__symbol">
            { symbol }
          </div>
          <div className="swap-v2__asset-dropdown__name">
            <span className="swap-v2__asset-dropdown__name__label">{`${t('balance')}:`}</span>
            <TokenBalance
              token={token}
            />
          </div>
        </div>
        { !insideDropdown && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }
}



