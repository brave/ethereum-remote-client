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
    hideModal: PropTypes.func.isRequired,
    hideBasic: PropTypes.bool.isRequired,
    gasPriceButtonGroupProps: PropTypes.object.isRequired,
  }

  renderTabs () {
    const { t } = this.context

    const {
      hideBasic,
      gasPriceButtonGroupProps,
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
            </div>
          </Tab>
        ))}
      </Tabs>
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
