import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class CoinbaseSubmit extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render () {
    const { text, onClick } = this.props

    return (
      <div className="coinbase-submit">
        <button
          className="coinbase-submit__button"
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    )
  }
}
