import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'
import SwapAmountRow from './swap-amount-row'
import SwapGasRow from './swap-gas-row'
import SwapHexDataRow from './swap-hex-data-row'
import SwapAssetRow from './swap-asset-row'
import Dialog from '../../../components/ui/dialog'


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
    isContractAddress: PropTypes.bool,
    sellAmount: PropTypes.number,
    buyToken: PropTypes.string,
    // sellToken: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      quoteResult: undefined,
    }
  }

  updateGas = (updateData) => this.props.updateGas(updateData)

  swapQuotes = () => {
    const { sellAmount, buyToken, getSwapQuotes } = this.props
    // getSwapQuotes(parseInt(sellAmount, 16), buyToken).then((resp) => resp.json()).then((result) => {
    //   console.log('This is the Quote', result)
    // })
    getSwapQuotes(parseInt(sellAmount, 16), buyToken).then((data) => {
      console.log('This Is The Quote', data)
      this.setState({ quoteResult: data.quotes })
    })
  }

  // componentDidMount() {
  //   const { amount, toToken } = this.props
  //   this.getSwapQuotes(amount, "ETH", toToken).then((res) => { res.json()
  //     return res.json
  //   })
  //   .then(json => this.setState({ data: json }));
  // }

  render () {
    // console.log(`The swap component props are ${JSON.stringify(this.props)}`)
    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          {this.maybeRenderContractWarning()}
          <SwapAssetRow />
          <SwapAmountRow updateGas={this.updateGas} />
          <span onClick={() => this.swapQuotes()}>Get Quote</span>
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
    // console.log(`Local Props are : ${JSON.stringify(this.props)}`)
    const { sellAmount } = this.props
    // this.getSwapQuotes = this.getSwapQuotes.bind(this)
    // console.log(`The amount is ${sellAmount}`)
    // console.log(`The buy token is ${JSON.stringify(buyToken)}`)

    if (sellAmount === '0') {
      return
    }
    this.swapQuotes()
    return (
      <>
        {this.state.quoteResult !== undefined ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
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
