import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class PermissionsConnectFooter extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    const { t } = this.context
    return (
      <div className="permissions-connect-footer">
        <div className="permissions-connect-footer__text">
          <div>{ t('onlyConnectTrust') }</div>
          <div
            className="permissions-connect-footer__text--link"
            onClick={() => {
              global.platform.openTab({ url: 'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-' })
            }}
          >{ t('learnMore') }
          </div>
        </div>
      </div>
    )
  }
}
