import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from '../../ui/button'
import Identicon from '../../ui/identicon'
import CurrencyDisplay from '../../ui/currency-display'
import { I18nContext } from '../../../contexts/i18n'
import WalletOverview from './wallet-overview'
import { SEND_ROUTE, SWAP_ROUTE } from '../../../helpers/constants/routes'
import { useMetricEvent } from '../../../hooks/useMetricEvent'
import { useTokenTracker } from '../../../hooks/useTokenTracker'
import { useTokenFiatAmount } from '../../../hooks/useTokenFiatAmount'
import { getAssetImages, getNetworkIdentifier } from '../../../selectors/selectors'
import { updateSendToken, updateSwapFromAsset } from '../../../store/actions'
import PaperAirplane from '../../ui/icon/paper-airplane-icon'
import Interaction from '../../ui/icon/interaction-icon.component'
import Tooltip from '../../ui/tooltip-v2'
import { MAINNET, ROPSTEN } from '../../../../../app/scripts/controllers/network/enums'

const TokenOverview = ({ className, token }) => {
  const dispatch = useDispatch()
  const t = useContext(I18nContext)
  const sendTokenEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Token',
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
  const assetImages = useSelector(getAssetImages)
  const { tokensWithBalances } = useTokenTracker([token])
  const balance = tokensWithBalances[0]?.string
  const formattedFiatBalance = useTokenFiatAmount(token.address, balance, token.symbol)
  const networkIdentifier = useSelector(getNetworkIdentifier)

  const isSwapAvailable = [MAINNET, ROPSTEN].includes(networkIdentifier)

  return (
    <WalletOverview
      balance={(
        <div className="token-overview__balance">
          <CurrencyDisplay
            className="token-overview__primary-balance"
            displayValue={balance}
            suffix={token.symbol}
          />
          {
            formattedFiatBalance
              ? (
                <CurrencyDisplay
                  className="token-overview__secondary-balance"
                  displayValue={formattedFiatBalance}
                  hideLabel
                />
              )
              : null
          }
        </div>
      )}
      buttons={(
        <>
          <Button
            type="secondary"
            className="token-overview__button"
            rounded
            icon={<PaperAirplane color="#037DD6" size={20} />}
            onClick={() => {
              sendTokenEvent()
              dispatch(updateSendToken(token))
              history.push(SEND_ROUTE)
            }}
          >
            { t('send') }
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
              className="token-overview__button"
              rounded
              icon={<Interaction color="#037DD6" size={20} />}
              onClick={() => {
                dispatch(updateSwapFromAsset(token))
                swapEvent()
                history.push(SWAP_ROUTE)
              }}
              data-testid="token-overview__button"
              disabled={!isSwapAvailable}
            >
              { t('swap') }
            </Button>
          </Tooltip>
        </>
      )}
      className={className}
      icon={(
        <Identicon
          diameter={32}
          address={token.address}
          image={assetImages[token.address]}
        />
      )}
    />
  )
}

TokenOverview.propTypes = {
  className: PropTypes.string,
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
  }).isRequired,
}

TokenOverview.defaultProps = {
  className: undefined,
}

export default TokenOverview
