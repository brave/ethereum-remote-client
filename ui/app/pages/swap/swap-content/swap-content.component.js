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
    showAddToAddressBookModal: PropTypes.func,
    showHexData: PropTypes.bool,
    contact: PropTypes.object,
    isOwnedAccount: PropTypes.bool,
    isContractAddress: PropTypes.bool,
  }

  updateGas = (updateData) => this.props.updateGas(updateData)

  render () {
    return (
      <PageContainerContent>
        <div className="swap-v2__form">
          { this.maybeRenderContractWarning() }
          <SwapAssetRow />
          <SwapAmountRow updateGas={this.updateGas} />
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

  // maybeRenderAddContact () {
  //   const { t } = this.context
  //   const { isOwnedAccount, showAddToAddressBookModal, contact = {} } = this.props

  //   if (isOwnedAccount || contact.name) {
  //     return
  //   }

  //   return (
  //     <Dialog
  //       type="message"
  //       className="swap__dialog"
  //       onClick={showAddToAddressBookModal}
  //     >
  //       {t('newAccountDetectedDialogMessage')}
  //     </Dialog>
  //   )
  // }
}
