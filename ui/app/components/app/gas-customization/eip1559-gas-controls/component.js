import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PageContainer from '../../../ui/page-container'
import { Tabs, Tab } from '../../../ui/tabs'
import BasicTabContent from './basic-tab-content'

export default class EIP1559GasControlsModal extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    cancelAndClose: PropTypes.func.isRequired,
    hideBasic: PropTypes.bool.isRequired,
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
  }

  renderTabs () {
    const { t } = this.context

    const {
      hideBasic,
      gasPriceButtonGroupProps,
      infoRowProps: {
        newTotalFiat,
        newTotalEth,
        sendAmount,
        maxPriorityFee,
        maxFee,
      },
    } = this.props

    let tabsToRender = [
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
        content: <p>World</p>,
      },
    ]

    if (hideBasic) {
      tabsToRender = tabsToRender.slice(1)
    }

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
            <span className="gas-modal-content__info-row__transaction-info__label">{t('maxPriorityFee')}</span>
            <span className="gas-modal-content__info-row__transaction-info__value">{maxPriorityFee}</span>
          </div>

          <div className="gas-modal-content__info-row__transaction-info">
            <span className="gas-modal-content__info-row__transaction-info__label">{t('maxFee2')}</span>
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
    const { t } = this.context
    const {
      cancelAndClose,
    } = this.props

    return (
      <div className="gas-modal-page-container">
        <PageContainer
          title={t('editPriority')}
          subtitle={t('editPrioritySubTitle')}
          tabsComponent={this.renderTabs()}
          disabled={false}
          onCancel={() => cancelAndClose()}
          onClose={() => cancelAndClose()}
          onSubmit={() => {
            alert('Clicked on submit')
          }}
          submitText={t('save')}
          headerCloseText={t('close')}
          hideCancel
        />
      </div>
    )
  }
}
