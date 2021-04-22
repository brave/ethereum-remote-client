import React, { Component, ReactText } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'
import SwapAmountRow from './swap-amount-row'
import SwapGasRow from './swap-gas-row'
import SwapHexDataRow from './swap-hex-data-row'
import SwapAssetRow from './swap-asset-row'
import Dialog from '../../../components/ui/dialog'


export default class SwapContent extends Component {

  constructor(props){
    super(props);
    this.state = { response: [] };
}

  static contextTypes = {
    t: PropTypes.func,
  }
  


  static propTypes = {
    updateGas: PropTypes.func,
    showAddToAddressBookModal: PropTypes.func,
    showHexData: PropTypes.bool,
    contact: PropTypes.object,
    isOwnedAccount: PropTypes.bool,
    toToken: PropTypes.string,
    toFrom: PropTypes.string,
    getSwapQuotes: PropTypes.func,
    isContractAddress: PropTypes.bool,
  }

  updateGas = (updateData) => this.props.updateGas(updateData)
  
  getSwapQuotes = () => {
    const { amount, toToken } = this.props
    const info =  this.props.getSwapQuotes(amount, "ETH", toToken).then((data) => {
      return data
    })
    console.log("The data in the quote is ", info)
    info.then(function (result){
      console.log("This is the Quote", result)
    })
  }

  componentDidMount() {
    const { amount, toToken } = this.props
    this.getSwapQuotes(amount, "ETH", toToken).then((res) => { res.json()
      return res.json
    })
    .then(json => this.setState({ data: json }));
  }

  render () {
    console.log(`The swap component props are ${JSON.stringify(this.props)}`)
    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          { this.maybeRenderContractWarning() }
          <SwapAssetRow />
          <SwapAmountRow updateGas={this.updateGas} />
            {/* {this.renderQuote()} */}
            {JSON.stringify(this.state.response)}
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

  renderQuote(){
    console.log(`Local Props are : ${JSON.stringify(this.props)}`)
    const { amount, toToken } = this.props
    // this.getSwapQuotes = this.getSwapQuotes.bind(this)
    console.log(`The amount is ${amount}`)
    console.log(`The toToken is ${JSON.stringify(toToken)}`)
    console.log(`Swap  Quotes is : ${this.getSwapQuotes()}`)


    if (amount === "0"){
      return
    }
        return (
          <div>
            {this.getSwapQuotes()}
          </div>

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
