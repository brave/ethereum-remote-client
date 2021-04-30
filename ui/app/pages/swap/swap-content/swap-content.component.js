import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'
import SwapAmountRow from './swap-amount-row'
import SwapGasRow from './swap-gas-row'
import SwapHexDataRow from './swap-hex-data-row'
import SwapAssetRow from './swap-asset-row'
import Dialog from '../../../components/ui/dialog'
import Button from '../../../components/ui/button'
import { ethers } from 'ethers'



export default class SwapContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    updateGas: PropTypes.func,
    // showAddToAddressBookModal: PropTypes.func,
    showHexData: PropTypes.bool,
    // contact: PropTypes.object,
    // isOwnedAccount: PropTypes.bool,
    // toToken: PropTypes.string,
    // toFrom: PropTypes.string,
    getSwapQuotes: PropTypes.func,
    updateSwapQuote: PropTypes.func,
    isContractAddress: PropTypes.bool,
    sellAmount: PropTypes.string,
    buyToken: PropTypes.string,
    // sellToken: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      quoteResult: undefined,
      updatedQuote: undefined,
      quoteStatus: undefined,
    }
  }

  updateGas = (updateData) => this.props.updateGas(updateData)

  // updateQuote = (quote) => this.props.updateSwapQuote(quote)

  swapQuotes = () => {
    const { sellAmount, buyToken, getSwapQuotes } = this.props
      getSwapQuotes().then((data) => {
      this.setState({ quoteResult: data.quotes , quoteStatus: 'QUOTED'})
    })
  }

  fillOrder = () => {
    const { quote , fillOrder } = this.props
    fillOrder().then((data) => {
      console.log('This Is The Quote', data)
      this.setState({ quoteStatus: data })
    })

  }

  render () {
    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          {this.maybeRenderContractWarning()}
          <SwapAssetRow />
          <SwapAmountRow updateGas={this.updateGas} />
          <br></br>
          <Button onClick={() => this.swapQuotes()}> Get Quote</Button>
          <br></br>
          {this.renderQuote()}
          <SwapGasRow />
          {
            this.props.showHexData && (
              <SwapHexDataRow
                updateGas={this.updateGas}
              />
            )
          }
        </div>
      </PageContainerContent>
    )
  }

  renderQuote () {
    const { sellAmount } = this.props

    if (sellAmount === '0') {
      return
    }
    // this.swapQuotes()
    return (
      <>
        {this.state.quoteResult !== undefined ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span>Sell Amount: {this.state.quoteResult.sellAmount}</span>
            <span>Buy Amount: {this.state.quoteResult.buyAmount}</span>
            <span>Rate: {this.state.quoteResult.buyTokenToEthRate}</span>
            <span>Estimated Gas: {this.state.quoteResult.estimatedGas}</span>
            <span>Gas: {this.state.quoteResult.gas}</span>
            <span>Gas Price: {this.state.quoteResult.gasPrice}</span>
            <span>Guaranteed Price: {this.state.quoteResult.guaranteedPrice}</span>
          </div>
        ) : (
          <div>Loading....</div>
        )}
      </>
    )
  }

  maybeRenderContractWarning () {
    const { t } = this.context
    const { isContractAddress } = this.props

    if (!isContractAddress) {
      return
    }

    return (
      <div className="contract-error-dialog">
        <Dialog
          type="error"
          className="error__dialog"
          onClick={undefined}
        >
          {t('contractErrorMessage')}
        </Dialog>
      </div>
    )
  }
}
