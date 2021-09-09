import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PageContainer from '../../../ui/page-container'
import { Tabs, Tab } from '../../../ui/tabs'
import BasicTabContent from './basic-tab-content'
import AdvancedTabContent from './advanced-tab-content'

export default class EIP1559GasControlsModal extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    gasPriceButtonGroupProps: PropTypes.object.isRequired,
    infoRowProps: PropTypes.shape({
      originalTotalFiat: PropTypes.string,
      originalTotalEth: PropTypes.string,
      newTotalFiat: PropTypes.string,
      newTotalEth: PropTypes.string,
      sendAmount: PropTypes.string,
      maxPriorityFee: PropTypes.string,
      maxFee: PropTypes.string,
    }),
    customModalMaxPriorityFeePerGasInHex: PropTypes.string.isRequired,
    customModalMaxFeePerGasInHex: PropTypes.string.isRequired,
    customModalGasLimitInHex: PropTypes.string.isRequired,
    isSpeedUp: PropTypes.bool.isRequired,
    isRetry: PropTypes.bool.isRequired,
    insufficientBalance: PropTypes.bool.isRequired,
    isCustomMaxPriorityFeePerGasSafe: PropTypes.bool,
    disableSave: PropTypes.bool.isRequired,

    // action dispatchers
    cancelAndClose: PropTypes.func.isRequired,
    updateCustomMaxPriorityFeePerGas: PropTypes.func.isRequired,
    updateCustomMaxFeePerGas: PropTypes.func.isRequired,
    updateCustomGasLimit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    fetchBasicGasAndTimeEstimates: PropTypes.func.isRequired,
    fetchGasEstimates: PropTypes.func.isRequired,
  }

  componentDidMount () {
    const promise = this.props.fetchBasicGasAndTimeEstimates()
      .then((basicEstimates) => basicEstimates.blockTime)

    promise
      .then((blockTime) => {
        this.props.fetchGasEstimates(blockTime)
      })
  }

  renderTabs () {
    const { t } = this.context

    const {
      gasPriceButtonGroupProps,
      infoRowProps: {
        newTotalFiat,
        newTotalEth,
        sendAmount,
        maxPriorityFee,
        maxFee,
      },
    } = this.props

    const tabsToRender = [
      {
        name: t('basic'),
        content: (
          <BasicTabContent
            gasPriceButtonGroupProps={gasPriceButtonGroupProps}
          />
        ),
      },
      {
        name: t('advanced'),
        content: this.renderAdvancedTabContent(),
      },
    ]

    return (
      <Tabs>
        {tabsToRender.map(({ name, content }, i) => (
          <Tab name={name} key={`gas-modal-tab-${i}`}>
            <div className="gas-modal-content">
              { content }
              { this.renderInfoRows(newTotalFiat, newTotalEth, sendAmount, maxPriorityFee, maxFee) }
            </div>
          </Tab>
        ))}
      </Tabs>
    )
  }

  renderAdvancedTabContent () {
    const {
      updateCustomMaxPriorityFeePerGas,
      updateCustomMaxFeePerGas,
      updateCustomGasLimit,
      customModalMaxPriorityFeePerGasInHex,
      customModalMaxFeePerGasInHex,
      customModalGasLimitInHex,
      insufficientBalance,
      isCustomMaxPriorityFeePerGasSafe,
      isSpeedUp,
      isRetry,
    } = this.props

    return (
      <AdvancedTabContent
        updateCustomMaxPriorityFeePerGas={updateCustomMaxPriorityFeePerGas}
        updateCustomMaxFeePerGas={updateCustomMaxFeePerGas}
        updateCustomGasLimit={updateCustomGasLimit}
        customModalMaxPriorityFeePerGasInHex={customModalMaxPriorityFeePerGasInHex}
        customModalGasLimitInHex={customModalGasLimitInHex}
        customModalMaxFeePerGasInHex={customModalMaxFeePerGasInHex}
        insufficientBalance={insufficientBalance}
        isCustomMaxPriorityFeePerGasSafe={isCustomMaxPriorityFeePerGasSafe}
        isSpeedUp={isSpeedUp}
        isRetry={isRetry}
      />
    )
  }

  renderInfoRows (newTotalFiat, newTotalEth, sendAmount, maxPriorityFee, maxFee) {
    const { t } = this.context

    return (
      <div className="gas-modal-content__info-row-wrapper">
        <div className="gas-modal-content__info-row">
          <div className="gas-modal-content__info-row__send-info">
            <span className="gas-modal-content__info-row__send-info__label">{t('sendAmount')}</span>
            <span className="gas-modal-content__info-row__send-info__value">{sendAmount}</span>
          </div>

          <div className="gas-modal-content__info-row__transaction-info">
            <span className="gas-modal-content__info-row__transaction-info__label">{t('maxPriorityFeePerGas')}</span>
            <span className="gas-modal-content__info-row__transaction-info__value">{maxPriorityFee}</span>
          </div>

          <div className="gas-modal-content__info-row__transaction-info">
            <span className="gas-modal-content__info-row__transaction-info__label">{t('maxFeePerGas')}</span>
            <span className="gas-modal-content__info-row__transaction-info__value">{maxFee}</span>
          </div>

          <div className="gas-modal-content__info-row__total-info">
            <span className="gas-modal-content__info-row__total-info__label">{t('newTotal')}</span>
            <span className="gas-modal-content__info-row__total-info__value">{newTotalEth}</span>
          </div>
          <div className="gas-modal-content__info-row__fiat-total-info">
            <span className="gas-modal-content__info-row__fiat-total-info__value">{newTotalFiat}</span>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { t, metricsEvent } = this.context
    const {
      cancelAndClose,
      disableSave,
      onSubmit,
      isSpeedUp,
      customModalGasLimitInHex,
      customModalMaxPriorityFeePerGasInHex,
      customModalMaxFeePerGasInHex,
    } = this.props

    return (
      <div className="gas-modal-page-container">
        <PageContainer
          title={t('editPriority')}
          subtitle={t('editPrioritySubTitle')}
          tabsComponent={this.renderTabs()}
          disabled={disableSave}
          onCancel={cancelAndClose}
          onClose={cancelAndClose}
          onSubmit={() => {
            if (isSpeedUp) {
              metricsEvent({
                eventOpts: {
                  category: 'Navigation',
                  action: 'Activity Log',
                  name: 'Saved "Speed Up"',
                },
              })
            }
            onSubmit({
              gasLimit: customModalGasLimitInHex,
              maxFeePerGas: customModalMaxFeePerGasInHex,
              maxPriorityFeePerGas: customModalMaxPriorityFeePerGasInHex,
            })
          }}
          submitText={t('save')}
          headerCloseText={t('close')}
          hideCancel
        />
      </div>
    )
  }
}
