import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Balance from '../../../../../../ui/app/components/ui/balance'

export default class BraveBalance extends PureComponent {
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
