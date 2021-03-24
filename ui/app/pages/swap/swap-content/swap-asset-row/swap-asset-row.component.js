import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwapRowWrapper from '../swap-row-wrapper'
import Identicon from '../../../../components/ui/identicon/identicon.component'
import TokenBalance from '../../../../components/ui/token-balance'
import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../helpers/constants/common'

export default class SwapAssetRow extends Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string,
        decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        symbol: PropTypes.string,
      }),
    ).isRequired,
    accounts: PropTypes.object.isRequired,
    selectedAddress: PropTypes.string.isRequired,
    swapTokenAddress: PropTypes.string,
    setSwapToken: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  state = {
    isShowingDropdown: false,
  }

  openDropdown = () => this.setState({ isShowingDropdown: true })

  closeDropdown = () => this.setState({ isShowingDropdown: false })

  selectToken = (token) => {
    this.setState({
      isShowingDropdown: false,
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
      this.props.setSwapToken(token)
    })
  }

  render () {
    const { t } = this.context

    return (
      <SwapRowWrapper label={`${t('asset')}:`}>
        <div className="swap-v2__asset-dropdown">
          { this.renderSwapToken() }
          { this.props.tokens.length > 0 ? this.renderAssetDropdown() : null }
        </div>
      </SwapRowWrapper>
    )
  }

  renderSwapToken () {
    const { swapTokenAddress } = this.props
    const token = this.props.tokens.find(({ address }) => address === swapTokenAddress)
    return (
      <div
        className="swap-v2__asset-dropdown__input-wrapper"
        onClick={this.openDropdown}
      >
        { token ? this.renderAsset(token) : this.renderEth() }
      </div>
    )
  }

  renderAssetDropdown () {
    return this.state.isShowingDropdown && (
      <div>
        <div
          className="swap-v2__asset-dropdown__close-area"
          onClick={this.closeDropdown}
        />
        <div className="swap-v2__asset-dropdown__list">
          { this.renderEth(true) }
          { this.props.tokens.map((token) => this.renderAsset(token, true)) }
        </div>
      </div>
    )
  }

  renderEth (insideDropdown = false) {
    const { t } = this.context
    const { accounts, selectedAddress } = this.props

    const balanceValue = accounts[selectedAddress] ? accounts[selectedAddress].balance : ''

    return (
      <div
        className={ this.props.tokens.length > 0 ? 'swap-v2__asset-dropdown__asset' : 'swap-v2__asset-dropdown__single-asset' }
        onClick={() => this.selectToken()}
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
        { !insideDropdown && this.props.tokens.length > 0 && (
          <i className="fa fa-caret-down fa-lg simple-dropdown__caret" />
        )}
      </div>
    )
  }


  renderAsset (token, insideDropdown = false) {
    const { address, symbol } = token
    const { t } = this.context

    return (
      <div
        key={address}
        className="swap-v2__asset-dropdown__asset"
        onClick={() => this.selectToken(token)}
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
