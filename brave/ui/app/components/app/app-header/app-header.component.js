const NetworkIndicator = require('../../../../../../ui/app/components/app/network')

import React from 'react'
import classnames from 'classnames'

import {
  DEFAULT_ROUTE,
  CONNECT_HARDWARE_ROUTE,
  NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
  BRAVE_CONNECT_WALLETS_ROUTE
} from '../../../../../../ui/app/helpers/constants/routes'
import { Item } from '../dropdowns/components/menu'
import AppHeader from '../../../../../../ui/app/components/app/app-header/app-header.component'

import ImportIcon from '../dropdowns/assets/import-icon'
import PlusIcon from '../dropdowns/assets/plus-icon'
import BitGoLogoIcon from '../dropdowns/assets/bitgo-logo'
import BraveAccountItems from '../dropdowns/components/account-items.component'
import BraveDropdownHeader from '../dropdowns/brave-dropdown-header.component'
import BraveDropdownItems from '../dropdowns/brave-dropdown-items.component'

module.exports = class BraveAppHeader extends AppHeader {
  constructor(props) {
    super(props)
  }

  state = {
    activeDropdown: ''
  }

  get styles () {
    return {
      connectItem: {
        margin: '0 auto',
        padding: '5px 10px'
      },
      connectImg: {
        width: '95px'
      }
    }
  }

  handleClick = (index) => {
    if (this.props.isUnlocked) {
      this.setState({ activeDropdown: index })
    }
  }

  handleMouseLeave = (selector, { target }) => {
    const dropdownItems = document.querySelector(selector)
    if (dropdownItems && !dropdownItems.contains(target)) {
      this.setState({ activeDropdown: '' })
    }
  }

  onCreateAccount = () => {
    this.setState({ activeDropdown: '' })
    this.props.history.push(NEW_ACCOUNT_ROUTE)
  }

  onImportAccount = () => {
    this.setState({ activeDropdown: '' })
    this.props.history.push(IMPORT_ACCOUNT_ROUTE)    
  }

  onHardwareConnect = () => {
    this.setState({ activeDropdown: '' })
    this.props.history.push(CONNECT_HARDWARE_ROUTE)
  }

  get itemStyle () {
    return {
      fontWeight: 'bold',
      color: 'rgb(59, 62, 79)',
      borderTop: '1px solid #dedede'
    }
  }

  get browserItems () {
    return [
      {
        markup: (
          <BraveAccountItems {...this.props} />
        )
      },
      {
        markup: (
          <Item
            icon={<PlusIcon />}
            onClick={this.onCreateAccount}
            text={this.context.t('createAccount')}
          />
        ),
        style: this.itemStyle
      },
      {
        markup: (
          <Item
            icon={<ImportIcon />}
            onClick={this.onImportAccount}
            text={this.context.t('importAccount')}
          />
        ),
        style: this.itemStyle
      }
    ]
  }

  get connectItems () {
    return [
      {
        markup: (
          <div onClick={() => {}} style={this.styles.connectItem}>
            <BitGoLogoIcon />
          </div>
        ),
        onClick: () => {}
      },
      {
        markup: (
          <div onClick={this.onHardwareConnect} style={this.styles.connectItem}>
            <img style={this.styles.connectImg} src={'images/ledger-logo.svg'} />
          </div>
        ),
        onClick: this.onHardwareConnect
      },
      {
        markup: (
          <div onClick={this.onHardwareConnect} style={this.styles.connectItem}>
            <img style={this.styles.connectImg} src={'images/trezor-logo.svg'} />
          </div>
        ),
        onClick: this.onHardwareConnect,
        style: this.itemStyle
      }
    ]
  }

  render() {
    const {
      network,
      provider,
      hideNetworkIndicator,
      disabled,
      isUnlocked,
      history
    } = this.props

    return (
      <div>
        <div className={'brave-dropdown-items'}>
          <BraveDropdownItems
            type={'browser'}
            items={this.browserItems}
            isOpen={this.state.activeDropdown === 'browser'}
            onMouseLeave={this.handleMouseLeave.bind(this, 'browser-dropdown')}
          />
          <BraveDropdownItems
            type={'connect'}
            items={this.connectItems}
            isOpen={this.state.activeDropdown === 'connect'}
            onMouseLeave={this.handleMouseLeave.bind(this, 'connect-dropdown')}
          />
        </div>
        <div
          className={classnames('app-header', {
            'app-header--back-drop': isUnlocked
          })}
        >
          <div className='app-header__contents'>
            <BraveDropdownHeader
              type={'browser'}
              title={'Crypto Wallet'}
              onClick={() => { history.push(DEFAULT_ROUTE) }}
              onMouseEnter={this.handleClick.bind(this, 'browser')}
              onMouseLeave={this.handleMouseLeave.bind(this, 'brave-browser-menu')}
              active={this.state.activeDropdown === 'browser'}
            />
            <BraveDropdownHeader
              type={'connect'}
              isConnect={true}
              title={'Connect Wallet'}
              onClick={() => {
                this.setState({ activeDropdown: '' })
                history.push(BRAVE_CONNECT_WALLETS_ROUTE)
              }}
              onMouseEnter={this.handleClick.bind(this, 'connect')}
              onMouseLeave={this.handleMouseLeave.bind(this, 'brave-connect-menu')}
              active={this.state.activeDropdown === 'connect'}
            />
            <div className='app-header__account-menu-container'>
              {!hideNetworkIndicator && (
                <div className='app-header__network-component-wrapper'>
                  <NetworkIndicator
                    network={network}
                    provider={provider}
                    onClick={event => this.handleNetworkIndicatorClick(event)}
                    disabled={disabled}
                  />
                </div>
              )}
              {this.renderAccountMenu()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
