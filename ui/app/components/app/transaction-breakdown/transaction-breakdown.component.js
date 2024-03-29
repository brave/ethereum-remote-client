import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TransactionBreakdownRow from './transaction-breakdown-row'
import CurrencyDisplay from '../../ui/currency-display'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import HexToDecimal from '../../ui/hex-to-decimal'
import { GWEI, PRIMARY, SECONDARY } from '../../../helpers/constants/common'

export default class TransactionBreakdown extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    className: PropTypes.string,
    nativeCurrency: PropTypes.string,
    showFiat: PropTypes.bool,
    nonce: PropTypes.string,
    gas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gasPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxPriorityFeePerGas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxFeePerGas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gasUsed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalInHex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasEIP1559GasFields: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    showFiat: true,
  }

  renderFees () {
    const { t } = this.context
    const { gasPrice, maxPriorityFeePerGas, maxFeePerGas, nativeCurrency, hasEIP1559GasFields } = this.props

    const gasPriceComponent = !hasEIP1559GasFields && (
      <TransactionBreakdownRow title={t('gasPrice')}>
        {typeof gasPrice !== 'undefined'
          ? (
            <CurrencyDisplay
              className="transaction-breakdown__value"
              data-testid="transaction-breakdown__gas-price"
              currency={nativeCurrency}
              denomination={GWEI}
              value={gasPrice}
              hideLabel
            />
          )
          : '?'
        }
      </TransactionBreakdownRow>
    )

    const maxPriorityFeePerGasComponent = hasEIP1559GasFields && (
      <TransactionBreakdownRow title={t('maxPriorityFeePerGas')}>
        {typeof maxPriorityFeePerGas !== 'undefined'
          ? (
            <CurrencyDisplay
              className="transaction-breakdown__value"
              data-testid="transaction-breakdown__gas-price"
              currency={nativeCurrency}
              denomination={GWEI}
              value={maxPriorityFeePerGas}
              hideLabel
            />
          )
          : '?'
        }
      </TransactionBreakdownRow>
    )

    const maxFeePerGasComponent = hasEIP1559GasFields && (
      <TransactionBreakdownRow title={t('maxFeePerGas')}>
        {typeof maxFeePerGas !== 'undefined'
          ? (
            <CurrencyDisplay
              className="transaction-breakdown__value"
              data-testid="transaction-breakdown__gas-price"
              currency={nativeCurrency}
              denomination={GWEI}
              value={maxFeePerGas}
              hideLabel
            />
          )
          : '?'
        }
      </TransactionBreakdownRow>
    )

    return (
      <>
        { gasPriceComponent }
        { maxPriorityFeePerGasComponent }
        { maxFeePerGasComponent }
      </>
    )
  }

  render () {
    const { t } = this.context
    const { gas, value, className, nonce, showFiat, totalInHex, gasUsed } = this.props
    return (
      <div className={classnames('transaction-breakdown', className)}>
        <div className="transaction-breakdown__title">
          { t('transaction') }
        </div>
        <TransactionBreakdownRow title="Nonce">
          {typeof nonce !== 'undefined'
            ? (
              <HexToDecimal
                className="transaction-breakdown__value"
                value={nonce}
              />
            ) : null
          }
        </TransactionBreakdownRow>
        <TransactionBreakdownRow title={t('amount')}>
          <UserPreferencedCurrencyDisplay
            className="transaction-breakdown__value"
            type={PRIMARY}
            value={value}
          />
        </TransactionBreakdownRow>
        <TransactionBreakdownRow
          title={`${t('gasLimit')} (${t('units')})`}
          className="transaction-breakdown__row-title"
        >
          {typeof gas !== 'undefined'
            ? (
              <HexToDecimal
                className="transaction-breakdown__value"
                value={gas}
              />
            )
            : '?'
          }
        </TransactionBreakdownRow>
        {
          typeof gasUsed === 'string' && (
            <TransactionBreakdownRow
              title={`${t('gasUsed')} (${t('units')})`}
              className="transaction-breakdown__row-title"
            >
              <HexToDecimal
                className="transaction-breakdown__value"
                value={gasUsed}
              />
            </TransactionBreakdownRow>
          )
        }
        { this.renderFees() }
        <TransactionBreakdownRow title={t('total')}>
          <div>
            <UserPreferencedCurrencyDisplay
              className="transaction-breakdown__value transaction-breakdown__value--eth-total"
              type={PRIMARY}
              value={totalInHex}
            />
            {
              showFiat && (
                <UserPreferencedCurrencyDisplay
                  className="transaction-breakdown__value"
                  type={SECONDARY}
                  value={totalInHex}
                />
              )
            }
          </div>
        </TransactionBreakdownRow>
      </div>
    )
  }
}
