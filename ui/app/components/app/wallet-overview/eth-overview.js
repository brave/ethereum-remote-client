import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'

import Button from '../../ui/button'
import Identicon from '../../ui/identicon'
import { I18nContext } from '../../../contexts/i18n'
import WalletOverview from './wallet-overview'
import { SEND_ROUTE, SWAP_ROUTE } from '../../../helpers/constants/routes'
import { useMetricEvent } from '../../../hooks/useMetricEvent'
import Tooltip from '../../ui/tooltip-v2'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common'
import { showModal } from '../../../store/actions'
import {
  getNetworkIdentifier,
  getSelectedAccount,
  getShouldShowFiat,
  isBalanceCached,
} from '../../../selectors/selectors'
import PaperAirplane from '../../ui/icon/paper-airplane-icon'
import Interaction from '../../ui/icon/interaction-icon.component'
import { MAINNET, ROPSTEN } from '../../../../../app/scripts/controllers/network/enums'

const EthOverview = ({ className }) => {
  const dispatch = useDispatch()
  const t = useContext(I18nContext)
  const sendEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Eth',
    },
  })
  const depositEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Deposit',
    },
  })
  const swapEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Swap',
    },
  })
  const history = useHistory()
  const balanceIsCached = useSelector(isBalanceCached)
  const showFiat = useSelector(getShouldShowFiat)
  const selectedAccount = useSelector(getSelectedAccount)
  const { balance } = selectedAccount
  const networkIdentifier = useSelector(getNetworkIdentifier)

  const isSwapAvailable = [MAINNET, ROPSTEN].includes(networkIdentifier)

  return (
    <WalletOverview
      balance={(
        <Tooltip position="top" title={t('balanceOutdated')} disabled={!balanceIsCached}>
          <div className="eth-overview__balance">
            <div className="eth-overview__primary-container">
              <UserPreferencedCurrencyDisplay
                className={classnames('eth-overview__primary-balance', {
                  'eth-overview__cached-balance': balanceIsCached,
                })}
                data-testid="eth-overview__primary-currency"
                value={balance}
                type={PRIMARY}
                ethNumberOfDecimals={4}
                hideTitle
              />
              {
                balanceIsCached ? <span className="eth-overview__cached-star">*</span> : null
              }
            </div>
            {
              showFiat && (
                <UserPreferencedCurrencyDisplay
                  className={classnames({
                    'eth-overview__cached-secondary-balance': balanceIsCached,
                    'eth-overview__secondary-balance': !balanceIsCached,
                  })}
                  data-testid="eth-overview__secondary-currency"
                  value={balance}
                  type={SECONDARY}
                  ethNumberOfDecimals={4}
                  hideTitle
                />
              )
            }
          </div>
        </Tooltip>
      )}
      buttons={(
        <>
          <Button
            type="primary"
            className="eth-overview__button"
            rounded
            onClick={() => {
              depositEvent()
              dispatch(showModal({ name: 'DEPOSIT_ETHER' }))
            }}
          >
            { t('buy') }
          </Button>
          <Button
            type="secondary"
            className="eth-overview__button"
            rounded
            icon={<PaperAirplane color="#037DD6" size={20} />}
            onClick={() => {
              sendEvent()
              history.push(SEND_ROUTE)
            }}
            data-testid="eth-overview-send"
          >
            {t('send')}
          </Button>
          <Tooltip
            position="bottom"
            title={t('availableOnMainnetRopsten')}
            disabled={isSwapAvailable}
            distance={-30}
            style={{
              position: 'relative',
              paddingLeft: '90px',
              top: '-20px',
            }}
          >
            <Button
              type="secondary"
              className="eth-overview__button"
              rounded
              icon={<Interaction color="#037DD6" size={20} />}
              onClick={() => {
                swapEvent()
                history.push(SWAP_ROUTE)
              }}
              data-testid="eth-overview-swap"
              disabled={!isSwapAvailable}
            >
              { t('swap') }
            </Button>
          </Tooltip>
        </>
      )}
      className={className}
      icon={<Identicon diameter={32} />}
    />
  )
}

EthOverview.propTypes = {
  className: PropTypes.string,
}

EthOverview.defaultProps = {
  className: undefined,
}

export default EthOverview
