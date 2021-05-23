import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { debounce } from 'lodash'

export default class AdvancedGasInputs extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    updateCustomGasPrice: PropTypes.func,
    updateCustomGasLimit: PropTypes.func,
    customGasPrice: PropTypes.number.isRequired,
    customGasLimit: PropTypes.number.isRequired,
    insufficientBalance: PropTypes.bool,
    customPriceIsSafe: PropTypes.bool,
    isSpeedUp: PropTypes.bool,
    showGasPriceInfoModal: PropTypes.func,
    showGasLimitInfoModal: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      gasPrice: this.props.customGasPrice,
      gasLimit: this.props.customGasLimit,
    }
    this.changeGasPrice = debounce(this.changeGasPrice, 500)
    this.changeGasLimit = debounce(this.changeGasLimit, 500)
  }

  componentDidUpdate (prevProps) {
    const { customGasPrice: prevCustomGasPrice, customGasLimit: prevCustomGasLimit } = prevProps
    const { customGasPrice, customGasLimit } = this.props
    const { gasPrice, gasLimit } = this.state

    if (customGasPrice !== prevCustomGasPrice && customGasPrice !== gasPrice) {
      this.setState({ gasPrice: customGasPrice })
    }
    if (customGasLimit !== prevCustomGasLimit && customGasLimit !== gasLimit) {
      this.setState({ gasLimit: customGasLimit })
    }
  }

  onChangeGasLimit = (e) => {
    this.setState({ gasLimit: e.target.value })
    this.changeGasLimit({ target: { value: e.target.value } })
  }

  changeGasLimit = (e) => {
    this.props.updateCustomGasLimit(Number(e.target.value))
  }

  onChangeGasPrice = (e) => {
    this.setState({ gasPrice: e.target.value })
    this.changeGasPrice({ target: { value: e.target.value } })
  }

  changeGasPrice = (e) => {
    this.props.updateCustomGasPrice(Number(e.target.value))
  }

  gasPriceError ({ insufficientBalance, customPriceIsSafe, isSpeedUp, gasPrice }) {
    const { t } = this.context

    if (insufficientBalance) {
      return {
        errorText: t('insufficientBalance'),
        errorType: 'error',
      }
    } else if (isSpeedUp && gasPrice === 0) {
      return {
        errorText: t('zeroGasPriceOnSpeedUpError'),
        errorType: 'error',
      }
    } else if (!customPriceIsSafe) {
      return {
        errorText: t('gasPriceExtremelyLow'),
        errorType: 'warning',
      }
    }

    return {}
  }

  gasLimitError ({ insufficientBalance, gasLimit }) {
    const { t } = this.context

    if (insufficientBalance) {
      return {
        errorText: t('insufficientBalance'),
        errorType: 'error',
      }
    } else if (gasLimit < 21000) {
      return {
        errorText: t('gasLimitTooLow'),
        errorType: 'error',
      }
    }

    return {}
  }

  renderGasInput ({ value, onChange, errorComponent, errorType, infoOnClick, label }) {
    return (
      <div className="advanced-gas-inputs__gas-edit-row">
        <div className="advanced-gas-inputs__gas-edit-row__label">
          {label}
          <i className="fa fa-info-circle" onClick={infoOnClick}/>
        </div>
        <div className="advanced-gas-inputs__gas-edit-row__input-wrapper">
          <input
            className={classnames('advanced-gas-inputs__gas-edit-row__input', {
              'advanced-gas-inputs__gas-edit-row__input--error': errorType === 'error',
              'advanced-gas-inputs__gas-edit-row__input--warning': errorType === 'warning',
            })}
            type="number"
            min="0"
            value={value}
            onChange={onChange}
          />
          <div
            className={classnames('advanced-gas-inputs__gas-edit-row__input-arrows', {
              'advanced-gas-inputs__gas-edit-row__input--error': errorType === 'error',
              'advanced-gas-inputs__gas-edit-row__input--warning': errorType === 'warning',
            })}
          >
            <div
              className="advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap"
              onClick={() => onChange({ target: { value: value + 1 } })}
            >
              <i className="fa fa-sm fa-angle-up"/>
            </div>
            <div
              className="advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap"
              onClick={() => onChange({ target: { value: Math.max(value - 1, 0) } })}
            >
              <i className="fa fa-sm fa-angle-down"/>
            </div>
          </div>
          {errorComponent}
        </div>
      </div>
    )
  }

  render () {
    const {
      insufficientBalance,
      customPriceIsSafe,
      isSpeedUp,
      showGasPriceInfoModal,
      showGasLimitInfoModal,
    } = this.props
    const {
      gasPrice,
      gasLimit,
    } = this.state

    const {
      errorText: gasPriceErrorText,
      errorType: gasPriceErrorType,
    } = this.gasPriceError({ insufficientBalance, customPriceIsSafe, isSpeedUp, gasPrice })
    const gasPriceErrorComponent = gasPriceErrorType ? (
      <div className={`advanced-gas-inputs__gas-edit-row__${gasPriceErrorType}-text`}>
        {gasPriceErrorText}
      </div>
    ) : null

    const {
      errorText: gasLimitErrorText,
      errorType: gasLimitErrorType,
    } = this.gasLimitError({ insufficientBalance, gasLimit })
    const gasLimitErrorComponent = gasLimitErrorType ? (
      <div className={`advanced-gas-inputs__gas-edit-row__${gasLimitErrorType}-text`}>
        {gasLimitErrorText}
      </div>
    ) : null

    return (
      <div className="advanced-gas-inputs__gas-edit-rows">
        {this.renderGasInput({
          label: this.context.t('gasPrice'),
          value: this.state.gasPrice,
          onChange: this.onChangeGasPrice,
          errorComponent: gasPriceErrorComponent,
          errorType: gasPriceErrorType,
          infoOnClick: showGasPriceInfoModal,
        })}
        {this.renderGasInput({
          label: this.context.t('gasLimit'),
          value: this.state.gasLimit,
          onChange: this.onChangeGasLimit,
          errorComponent: gasLimitErrorComponent,
          errorType: gasLimitErrorType,
          infoOnClick: showGasLimitInfoModal,
        })}
      </div>
    )
  }
}
