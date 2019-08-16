import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class ProviderSubmit extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render () {
    const { text, onClick } = this.props

    return (
      <div className="provider-submit">
        <button
          className="provider-submit__button"
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    )
  }
}
