import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component'
import SendAmountRow from './send-amount-row'
import SendGasRow from './send-gas-row'
import SendHexDataRow from './send-hex-data-row'
import SendAssetRow from './send-asset-row'
import Dialog from '../../../components/ui/dialog'

export default class SendContent extends Component {

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
    isEIP1559Active: PropTypes.bool.isRequired,
  }

  updateGas = (updateData) => this.props.updateGas(updateData)

  render () {
    const { isEIP1559Active } = this.props
    return (
      <PageContainerContent>
        <div className="send-v2__form">
          { this.maybeRenderContractWarning() }
          { this.maybeRenderAddContact() }
          <SendAssetRow />
          <SendAmountRow updateGas={this.updateGas} />
          { !isEIP1559Active && <SendGasRow /> }
          {
            this.props.showHexData && (
              <SendHexDataRow
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

  maybeRenderAddContact () {
    const { t } = this.context
    const { isOwnedAccount, showAddToAddressBookModal, contact = {} } = this.props

    if (isOwnedAccount || contact.name) {
      return
    }

    return (
      <Dialog
        type="message"
        className="send__dialog"
        onClick={showAddToAddressBookModal}
      >
        {t('newAccountDetectedDialogMessage')}
      </Dialog>
    )
  }
}
