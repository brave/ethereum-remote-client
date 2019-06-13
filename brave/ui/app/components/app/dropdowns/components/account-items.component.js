import React, { PureComponent } from 'react'

import Tooltip from '../../../../../../../ui/app/components/ui/tooltip'
import Identicon from '../../../../../../../ui/app/components/ui/identicon'

import UserPreferencedCurrencyDisplay from '../../../../../../../ui/app/components/app/user-preferenced-currency-display'
import { PRIMARY } from '../../../../../../../ui/app/helpers/constants/common'

export default class BraveAccountItems extends PureComponent {

  renderAccountItems = () => {
    const {
      identities,
      accounts,
      keyrings,
      showAccountDetail,
    } = this.props
  
    const accountOrder = keyrings.reduce((list, keyring) => list.concat(keyring.accounts), [])

    return accountOrder.filter(address => !!identities[address]).map(address => {
      const identity = identities[address]

      const balanceValue = accounts[address] ? accounts[address].balance : ''
      const simpleAddress = identity.address.substring(2).toLowerCase()

      const keyring = keyrings.find(kr => {
        return kr.accounts.includes(simpleAddress) || kr.accounts.includes(identity.address)
      })

      return (
        <div
          className="account-menu__account menu__item--clickable"
          onClick={() => {
            showAccountDetail(identity.address)
          }}
          key={identity.address}
        >
          <Identicon
            address={identity.address}
            diameter={24}
          />
          <div className="account-menu__account-info" style={{ margin: '-10px 0px 0px 15px' }}>
            <div className="account-menu__name" style={{ color: '#000' }}>
              { identity.name || '' }
            </div>
            <UserPreferencedCurrencyDisplay
              className="account-menu__balance"
              value={balanceValue}
              type={PRIMARY}
            />
          </div>
          { this.renderKeyringType(keyring) }
          { this.renderRemoveAccount(keyring, identity) }
        </div>
      )
    })
  }

  render () {
    return (
      <div>{this.renderAccountItems()}</div>
    )
  }

  renderRemoveAccount (keyring, identity) {
    const { t } = this.context
    const { type } = keyring
    const isRemovable = type !== 'HD Key Tree'

    return isRemovable && (
      <Tooltip
        title={t('removeAccount')}
        position="bottom"
      >
        <a
          className="remove-account-icon"
          onClick={e => this.removeAccount(e, identity)}
        />
      </Tooltip>
    )
  }

  removeAccount (e, identity) {
    e.preventDefault()
    e.stopPropagation()
    const { showRemoveAccountConfirmationModal } = this.props
    showRemoveAccountConfirmationModal(identity)
  }

  renderKeyringType (keyring) {
    const { t } = this.context

    if (!keyring) {
      return null
    }

    const { type } = keyring
    let label

    switch (type) {
      case 'Trezor Hardware':
      case 'Ledger Hardware':
        label = t('hardware')
        break
      case 'Simple Key Pair':
        label = t('imported')
        break
    }

    return label && (
      <div className="keyring-label allcaps">
        { label }
      </div>
    )
  }
}
