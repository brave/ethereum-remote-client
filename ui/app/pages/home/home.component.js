import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import AssetList from '../../components/app/asset-list'
import HomeNotification from '../../components/app/home-notification'
import MultipleNotifications from '../../components/app/multiple-notifications'
import TransactionList from '../../components/app/transaction-list'
import MenuBar from '../../components/app/menu-bar'
import Popover from '../../components/ui/popover'
import Button from '../../components/ui/button'
import ConnectedSites from '../connected-sites'
import ConnectedAccounts from '../connected-accounts'
import { Tabs, Tab } from '../../components/ui/tabs'
import { EthOverview } from '../../components/app/wallet-overview'

import {
  ASSET_ROUTE,
  RESTORE_VAULT_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
  CONNECT_ROUTE,
  CONNECTED_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  CONNECT_HARDWARE_ROUTE,
} from '../../helpers/constants/routes'

const LEARN_MORE_URL = 'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-'

export default class Home extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    forgottenPassword: PropTypes.bool,
    suggestedTokens: PropTypes.object,
    unconfirmedTransactionsCount: PropTypes.number,
    shouldShowSeedPhraseReminder: PropTypes.bool,
    isPopup: PropTypes.bool,
    isNotification: PropTypes.bool.isRequired,
    firstPermissionsRequestId: PropTypes.string,
    totalUnapprovedCount: PropTypes.number.isRequired,
    setConnectedStatusPopoverHasBeenShown: PropTypes.func,
    connectedStatusPopoverHasBeenShown: PropTypes.bool,
    defaultHomeActiveTabName: PropTypes.string,
    onTabClick: PropTypes.func.isRequired,
    hardwareConnect: PropTypes.bool,
    setHardwareConnect: PropTypes.func,
  }

  state = {
    mounted: false,
  }

  componentDidMount () {
    const {
      firstPermissionsRequestId,
      history,
      isNotification,
      suggestedTokens = {},
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
      hardwareConnect,
    } = this.props

    this.setState({ mounted: true })
    if (isNotification && totalUnapprovedCount === 0) {
      global.platform.closeCurrentWindow()
    } else if (firstPermissionsRequestId) {
      history.push(`${CONNECT_ROUTE}/${firstPermissionsRequestId}`)
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE)
    } else if (Object.keys(suggestedTokens).length > 0) {
      history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE)
    }

    if (hardwareConnect) {
      this.props.setHardwareConnect(false)
      this.props.history.push(CONNECT_HARDWARE_ROUTE)
    }
  }

  static getDerivedStateFromProps (
    {
      firstPermissionsRequestId,
      isNotification,
      suggestedTokens,
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
    },
    { mounted },
  ) {
    if (!mounted) {
      if (isNotification && totalUnapprovedCount === 0) {
        return { closing: true }
      } else if (firstPermissionsRequestId || unconfirmedTransactionsCount > 0 || Object.keys(suggestedTokens).length > 0) {
        return { redirecting: true }
      }
    }
    return null
  }

  componentDidUpdate (_prevProps, prevState) {
    if (!prevState.closing && this.state.closing) {
      global.platform.closeCurrentWindow()
    }
  }

  renderNotifications () {
    const { t } = this.context
    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
    } = this.props

    return (
      <MultipleNotifications>
        {
          shouldShowSeedPhraseReminder && !isPopup
            ? (
              <HomeNotification
                descriptionText={t('backupApprovalNotice')}
                acceptText={t('backupNow')}
                onAccept={() => {
                  history.push(INITIALIZE_BACKUP_SEED_PHRASE_ROUTE)
                }}
                infoText={t('backupApprovalInfo')}
                key="home-backupApprovalNotice"
              />
            )
            : null
        }
      </MultipleNotifications>
    )
  }
  renderPopover = () => {
    const { setConnectedStatusPopoverHasBeenShown } = this.props
    const { t } = this.context
    return (
      <Popover
        title={ t('whatsThis') }
        onClose={setConnectedStatusPopoverHasBeenShown}
        className="home__connected-status-popover"
        showArrow
        CustomBackground={({ onClose }) => {
          return (
            <div
              className="home__connected-status-popover-bg-container"
              onClick={onClose}
            >
              <div className="home__connected-status-popover-bg" />
            </div>
          )
        }}
        footer={(
          <>
            <a
              href={LEARN_MORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              { t('learnMore') }
            </a>
            <Button
              type="primary"
              onClick={setConnectedStatusPopoverHasBeenShown}
            >
              { t('dismiss') }
            </Button>
          </>
        )}
      >
        <main className="home__connect-status-text">
          <div>{ t('metaMaskConnectStatusParagraphOne') }</div>
          <div>{ t('metaMaskConnectStatusParagraphTwo') }</div>
          <div>{ t('metaMaskConnectStatusParagraphThree') }</div>
        </main>
      </Popover>
    )
  }

  render () {
    const { t } = this.context
    const {
      defaultHomeActiveTabName,
      onTabClick,
      forgottenPassword,
      history,
      connectedStatusPopoverHasBeenShown,
      isPopup,
    } = this.props

    if (forgottenPassword) {
      return <Redirect to={{ pathname: RESTORE_VAULT_ROUTE }} />
    } else if (this.state.closing || this.state.redirecting) {
      return null
    }

    return (
      <div className="main-container">
        <Route path={CONNECTED_ROUTE} component={ConnectedSites} exact />
        <Route path={CONNECTED_ACCOUNTS_ROUTE} component={ConnectedAccounts} exact />
        <div className="home__container">
          { isPopup && !connectedStatusPopoverHasBeenShown ? this.renderPopover() : null }
          <div className="home__main-view">
            <MenuBar />
            <div className="home__balance-wrapper">
              <EthOverview />
            </div>
            <Tabs defaultActiveTabName={defaultHomeActiveTabName} onTabClick={onTabClick} tabsClassName="home__tabs">
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__asset-tab"
                name={t('assets')}
              >
                <AssetList
                  onClickAsset={(asset) => history.push(`${ASSET_ROUTE}/${asset}`)}
                />
              </Tab>
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__activity-tab"
                name={t('activity')}
              >
                <TransactionList />
              </Tab>
            </Tabs>
          </div>
          { this.renderNotifications() }
        </div>
      </div>
    )
  }
}
