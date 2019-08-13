import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ExchangeArrows from './exchange-arrows'
import TextField from '../../../../../../ui/app/components/ui/text-field'

export default class CurrencyInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    exchangeRate: PropTypes.number.isRequired, // left = exchange rate * right
    leftExtra: PropTypes.shape({
      button: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }).isRequired,
    rightExtra: PropTypes.shape({
      button: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }).isRequired,
  }

  state = {
    left: {
      value: '',
      valid: true,
    },
    right: {
      value: '',
      valid: true,
    }
  }

  preventAlpha (event) {
    const key = String.fromCharCode(event.which)
    console.log(event.which, key)
    if (!key.match(/[0-9.]/)) {
      event.preventDefault()
    }
  }

  onChange (which, event) {
    console.log(this.state)
    console.log(event.target.value, event.target.validity.valid)
    const newState = {
      [which]: {
        value: event.target.value,
        valid: event.target.validity.valid,
      },
    }
    const value = Number.parseFloat(event.target.value)
    if (!Number.isNaN(value)) {
      const { exchangeRate } = this.props
      switch (which) {
        case 'left':
          newState['right'] = {
            value: (value / exchangeRate).toString(),
            valid: true,
          }
          break
        case 'right':
          newState['left'] = {
            value: (value * exchangeRate).toString(),
            valid: true,
          }
          break
      }
    }
    this.setState(newState)
  }

  extraElem (spec) {
    const { button, text, onClick } = spec
    if (!button) {
      return <span>{ text }</span>
    }

    return (
      <button
        onClick={onClick}
      >
        { text }
      </button>
    )
  }

  render () {
    const { left, right } = this.state
    const { leftExtra, rightExtra } = this.props

    return (
      <div className="currency-input">
        <div className={classnames({
          'currency-input__textbox': true,
          'currency-input__textbox__invalid': !left.valid,
        })}>
          <input
            type="text"
            pattern="\d*\.?\d*"
            placeholder="0.00"
            onKeyPress={this.preventAlpha}
            onChange={e => this.onChange('left', e)}
            value={left.value}
          />
          { this.extraElem(leftExtra) }
        </div>
        <div className="currency-input__arrows">
          <ExchangeArrows />
        </div>
        <div className={classnames({
          'currency-input__textbox': true,
          'currency-input__textbox__invalid': !right.valid,
        })}>
          <input
            type="text"
            pattern="\d*\.?\d*"
            placeholder="0.00"
            onKeyPress={this.preventAlpha}
            onChange={e => this.onChange('right', e)}
            value={right.value}
          />
          { this.extraElem(rightExtra) }
        </div>
      </div>
    )
  }
}
