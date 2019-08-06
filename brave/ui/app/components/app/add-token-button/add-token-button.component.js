import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Balance from '../../../../../../ui/app/components/app/add-token-button'

export default class BraveAddTokenButton extends PureComponent {
  static propTypes = {
    viewingCoinbase: PropTypes.bool.isRequired,
  }

  render () {
    const {
      viewingCoinbase,
      ...metamaskProps
    } = this.props

    if (!viewingCoinbase) {
      return (
        <Balance {...metamaskProps} />
      )
    }

    return null
  }
}
