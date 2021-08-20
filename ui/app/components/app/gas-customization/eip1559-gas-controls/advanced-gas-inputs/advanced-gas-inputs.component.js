import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { debounce } from 'lodash'

export default class AdvancedGasInputs extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    // Action dispatchers
    showMaxPriorityFeeInfoModal: PropTypes.func,
    showMaxFeeInfoModal: PropTypes.func,
    showGasLimitInfoModal: PropTypes.func,

    // Functions passed as props
    updateCustomMaxPriorityFeePerGas: PropTypes.func,
    updateCustomMaxFeePerGas: PropTypes.func,
    updateCustomGasLimit: PropTypes.func,

    // Value props
    customMaxPriorityFeePerGas: PropTypes.number.isRequired,
    customMaxFeePerGas: PropTypes.number.isRequired,
    customGasLimit: PropTypes.number.isRequired,
    insufficientBalance: PropTypes.bool,
    isCustomMaxPriorityFeePerGasSafe: PropTypes.bool,
    isSpeedUp: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = {
      maxPriorityFeePerGas: this.props.customMaxPriorityFeePerGas,
      maxFeePerGas: this.props.customMaxFeePerGas,
      gasLimit: this.props.customGasLimit,
    }
    this.changeMaxPriorityFeePerGas = debounce(this.changeMaxPriorityFeePerGas, 500)
    this.changeMaxFeePerGas = debounce(this.changeMaxFeePerGas, 500)
    this.changeGasLimit = debounce(this.changeGasLimit, 500)
  }

  componentDidUpdate (prevProps) {
    const {
      customMaxPriorityFeePerGas: prevCustomMaxPriorityFeePerFas,
      customMaxFeePerGas: prevCustomMaxFeePerGas,
      customGasLimit: prevCustomGasLimit,
    } = prevProps
    const { customMaxPriorityFeePerGas, customGasLimit, customMaxFeePerGas } = this.props
    const { maxPriorityFeePerGas, maxFeePerGas, gasLimit } = this.state

    if (customMaxPriorityFeePerGas !== prevCustomMaxPriorityFeePerFas && customMaxPriorityFeePerGas !== maxPriorityFeePerGas) {
      this.setState({ maxPriorityFeePerGas: customMaxPriorityFeePerGas })
    }

    if (customMaxFeePerGas !== prevCustomMaxFeePerGas && customMaxFeePerGas !== maxFeePerGas) {
      this.setState({ maxFeePerGas: customMaxFeePerGas })
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

  onChangeMaxPriorityFeePerGas = (e) => {
    this.setState({ maxPriorityFeePerGas: e.target.value })
    this.changeMaxPriorityFeePerGas({ target: { value: e.target.value } })
  }

  changeMaxPriorityFeePerGas = (e) => {
    this.props.updateCustomMaxPriorityFeePerGas(Number(e.target.value))
  }

  onChangeMaxFeePerGas = (e) => {
    this.setState({ maxFeePerGas: e.target.value })
    this.changeMaxFeePerGas({ target: { value: e.target.value } })
  }

  changeMaxFeePerGas = (e) => {
    this.props.updateCustomMaxFeePerGas(Number(e.target.value))
  }

  maxPriorityFeePerGasError ({ insufficientBalance, isCustomMaxPriorityFeePerGasSafe, isSpeedUp, maxPriorityFeePerGas }) {
    const { t } = this.context

    if (insufficientBalance) {
      return {
        errorText: t('insufficientBalance'),
        errorType: 'error',
      }
    } else if (isSpeedUp && maxPriorityFeePerGas === 0) {
      return {
        errorText: t('zeroGasPriceOnSpeedUpError'),
        errorType: 'error',
      }
    } else if (!isCustomMaxPriorityFeePerGasSafe) {
      return {
        errorText: t('gasPriceExtremelyLow'),
        errorType: 'warning',
      }
    }

    return {}
  }

  maxFeePerGasError ({ insufficientBalance, isCustomMaxPriorityFeePerGasSafe, isSpeedUp, maxFeePerGas }) {
    const { t } = this.context

    if (insufficientBalance) {
      return {
        errorText: t('insufficientBalance'),
        errorType: 'error',
      }
    } else if (isSpeedUp && maxFeePerGas === 0) {
      return {
        errorText: t('zeroGasPriceOnSpeedUpError'),
        errorType: 'error',
      }
    } else if (!isCustomMaxPriorityFeePerGasSafe) {
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
          <i className="fa fa-info-circle" onClick={infoOnClick} />
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
              <i className="fa fa-sm fa-angle-up" />
            </div>
            <div
              className="advanced-gas-inputs__gas-edit-row__input-arrows__i-wrap"
              onClick={() => onChange({ target: { value: Math.max(value - 1, 0) } })}
            >
              <i className="fa fa-sm fa-angle-down" />
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
      isCustomMaxPriorityFeePerGasSafe,
      isSpeedUp,
      showMaxPriorityFeeInfoModal,
      showMaxFeeInfoModal,
      showGasLimitInfoModal,
    } = this.props

    const {
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit,
    } = this.state

    const { t } = this.context

    const {
      errorText: maxPriorityGasPerGasErrorText,
      errorType: maxPriorityFeePerGasErrorType,
    } = this.maxPriorityFeePerGasError({ insufficientBalance, isCustomMaxPriorityFeePerGasSafe, isSpeedUp, maxPriorityFeePerGas })
    const maxPriorityFeePerGasErrorComponent = maxPriorityFeePerGasErrorType ? (
      <div className={`advanced-gas-inputs__gas-edit-row__${maxPriorityFeePerGasErrorType}-text`}>
        {maxPriorityGasPerGasErrorText}
      </div>
    ) : null

    const {
      errorText: maxFeePerGasErrorText,
      errorType: maxFeePerGasErrorType,
    } = this.maxFeePerGasError({ insufficientBalance, isCustomMaxPriorityFeePerGasSafe, isSpeedUp, maxFeePerGas })
    const maxFeePerGasErrorComponent = maxFeePerGasErrorType ? (
      <div className={`advanced-gas-inputs__gas-edit-row__${maxFeePerGasErrorType}-text`}>
        {maxFeePerGasErrorText}
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
      <>
        <div className="advanced-gas-inputs__gas-edit-rows">
          {this.renderGasInput({
            label: t('gasLimit'),
            value: gasLimit,
            onChange: this.onChangeGasLimit,
            errorComponent: gasLimitErrorComponent,
            errorType: gasLimitErrorType,
            infoOnClick: showGasLimitInfoModal,
          })}
          {this.renderGasInput({
            label: t('maxPriorityFee'),
            value: maxPriorityFeePerGas,
            onChange: this.onChangeMaxPriorityFeePerGas,
            errorComponent: maxPriorityFeePerGasErrorComponent,
            errorType: maxPriorityFeePerGasErrorType,
            infoOnClick: showMaxPriorityFeeInfoModal,
          })}
        </div>
        <br />
        <div className="advanced-gas-inputs__gas-edit-rows">
          {this.renderGasInput({
            label: t('maxFee'),
            value: maxFeePerGas,
            onChange: this.onChangeMaxFeePerGas,
            errorComponent: maxFeePerGasErrorComponent,
            errorType: maxFeePerGasErrorType,
            infoOnClick: showMaxFeeInfoModal,
          })}
        </div>
      </>
    )
  }
}
