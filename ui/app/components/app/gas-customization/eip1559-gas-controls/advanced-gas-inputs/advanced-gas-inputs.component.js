import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { debounce } from 'lodash'
import { addCurrencies, conversionLessThan } from '../../../../../helpers/utils/conversion-util'
import { decGWEIToHexWEI, hexWEIToDecGWEI } from '../../../../../helpers/utils/conversions.util'

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
    baseFeePerGas: PropTypes.string,
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
    const { baseFeePerGas } = this.props
    const maxPriorityFeePerGasInDec = e.target.value || '0'

    this.props.updateCustomMaxPriorityFeePerGas(Number(maxPriorityFeePerGasInDec))
    const maxPriorityFeePerGas = decGWEIToHexWEI(maxPriorityFeePerGasInDec)

    const maxFeePerGas = addCurrencies(
      baseFeePerGas,
      maxPriorityFeePerGas === '0' ? '0x0' : maxPriorityFeePerGas, {
        aBase: 16,
        bBase: 16,
        toNumericBase: 'hex',
      },
    )
    this.onChangeMaxFeePerGas({ target: { value: hexWEIToDecGWEI(maxFeePerGas) } })
  }

  onChangeMaxFeePerGas = (e) => {
    this.setState({ maxFeePerGas: e.target.value })
    this.changeMaxFeePerGas({ target: { value: e.target.value } })
  }

  changeMaxFeePerGas = (e) => {
    this.props.updateCustomMaxFeePerGas(Number(e.target.value))
  }

  maxPriorityFeePerGasError () {
    const { t } = this.context
    const {
      insufficientBalance,
      isSpeedUp,
      isCustomMaxPriorityFeePerGasSafe,
    } = this.props

    const { maxPriorityFeePerGas } = this.state

    if (insufficientBalance) {
      return {
        errorText: t('insufficientBalance'),
        errorType: 'error',
      }
    }

    if (isSpeedUp && maxPriorityFeePerGas === 0) {
      return {
        errorText: t('zeroMaxPriorityFeeOnSpeedUpError'),
        errorType: 'error',
      }
    }

    if (!isCustomMaxPriorityFeePerGasSafe) {
      return {
        errorText: t('maxPriorityFeePerGasExtremelyLow'),
        errorType: 'warning',
      }
    }

    return {}
  }

  maxFeePerGasError () {
    const { t } = this.context
    const {
      insufficientBalance,
      baseFeePerGas,
    } = this.props
    const { maxFeePerGas: maxFeePerGasInDecGwei } = this.state

    if (insufficientBalance) {
      return {
        errorText: t('insufficientBalance'),
        errorType: 'error',
      }
    }

    const maxFeePerGas = decGWEIToHexWEI(maxFeePerGasInDecGwei)

    const maxFeePerGasLowerThanBaseFeePerGas = conversionLessThan(
      { value: maxFeePerGas, fromNumericBase: 'hex' },
      { value: baseFeePerGas, fromNumericBase: 'hex' },
    )

    if (maxFeePerGasLowerThanBaseFeePerGas) {
      return {
        errorText: t('maxFeePerGasLessThanBaseFeePerGas'),
        errorType: 'error',
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
    } = this.maxPriorityFeePerGasError()
    const maxPriorityFeePerGasErrorComponent = maxPriorityFeePerGasErrorType ? (
      <div className={`advanced-gas-inputs__gas-edit-row__${maxPriorityFeePerGasErrorType}-text`}>
        {maxPriorityGasPerGasErrorText}
      </div>
    ) : null

    const {
      errorText: maxFeePerGasErrorText,
      errorType: maxFeePerGasErrorType,
    } = this.maxFeePerGasError()
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
            label: t('maxPriorityFeePerGas'),
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
            label: t('maxFeePerGas'),
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
