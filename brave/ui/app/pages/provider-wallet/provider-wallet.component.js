import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

module.exports = class BraveProviderWallet extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    bitGoBalances: PropTypes.object,
    bitGoTransfers: PropTypes.object,
    bitGoCreatedWallets: PropTypes.array,
    getBitGoWalletBalance: PropTypes.func,
    getBitGoWalletTransfers: PropTypes.func,
    sendBitGoTransaction: PropTypes.func,
  }

  constructor (props) {
    super (props)

    this.refreshTimer = null

    const { bitGoCreatedWallets } = this.props
    const currentAsset = bitGoCreatedWallets.length ? bitGoCreatedWallets[0] : ''

    this.state = {
      currentAsset
    }
  }

  componentDidMount () {
    this.updateBitGoInfo()
    this.refreshTimer = setInterval(this.updateBitGoInfo, 150000)
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer)
  }

  updateBitGoInfo = () => {
    const {
      getBitGoWalletBalance,
      getBitGoWalletTransfers,
    } = this.props

    getBitGoWalletBalance()
    getBitGoWalletTransfers()
  }

  getCryptoIcon = (asset, large = true) => {
    const ext = large ? 'large' : 'small'

    return (
      <img src={`images/${asset}-${ext}.png`} />
    )
  }

  renderAssetList = () => {
    const {
      bitGoBalances,
      bitGoCreatedWallets,
    } = this.props

    return (
      <div className="__asset-list">
        {bitGoCreatedWallets.map((asset) => {
          const balance = bitGoBalances[asset] || '0.00'
          const activeClass = this.state.currentAsset === asset ? 'active' : ''

          return (
            <div key={`asset-${asset}`} className={`__asset ${activeClass}`}>
              <div className="__logo">
                {this.getCryptoIcon(asset)}
              </div>
              <span className="__ticker">{`${balance} ${asset.toUpperCase()}`}</span>
            </div>
          )
        })}
      </div>
    )
  }

  renderTransactions = () => {
    const { bitGoTransfers } = this.props
    return null
  }

  render () {
    return (
      <div className="provider-wallet">
        <div className="__info-column">
          <div className="__account-balance">
            <div className="__account-info">
              <span className="__value">Total Value</span>
              <span className="__balance">$0.00</span>
            </div>
          </div>
          {this.renderAssetList()}
        </div>
        <div className="__activity-pane">
          {this.renderTransactions()}
        </div>
      </div>
    )
  }
}
