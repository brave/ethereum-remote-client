import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class SwapRowErrorMessage extends Component {

  static propTypes = {
    errors: PropTypes.object,
    errorType: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    const { errors, errorType } = this.props

    const errorMessage = errors[errorType]

    return (
      errorMessage
        ? <div className={classnames('swap-v2__error', { 'swap-v2__error-amount': errorType === 'amount' })}>{this.context.t(errorMessage)}</div>
        : null
    )
  }

}
