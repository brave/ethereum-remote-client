import React from 'react'
import Modal from '../../../../../../../ui/app/components/app/modal'
import ConfirmRemoveAccount from '../../../../../../../ui/app/components/app/modals/confirm-remove-account/confirm-remove-account.component'

module.exports = class BraveConfirmRemoveAccount extends ConfirmRemoveAccount {

  render () {
    const { t } = this.context

    return (
      <Modal
        headerText={`${t('removeAccount')}?`}
        onClose={this.handleCancel}
        onSubmit={this.handleRemove}
        onCancel={this.handleCancel}
        submitText={t('remove')}
        cancelText={t('nevermind')}
        submitType="secondary"
      >
        <div>
          { this.renderSelectedAccount() }
          <div className="confirm-remove-account__description">
            { t('removeAccountDescription') }
            <a
              className="confirm-remove-account__link"
              rel="noopener noreferrer"
              target="_blank"
              href="https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-"
            >
              { t('learnMore') }
            </a>
          </div>
        </div>
      </Modal>
    )
  }
}
