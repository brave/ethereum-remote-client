import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
    const { t } = this.context

    const errorMessage = errors[errorType]

    return (
      errorMessage
        ? <div className="swap-v2__error">{t(errorMessage)}</div>
        : null
    )
  }

}
