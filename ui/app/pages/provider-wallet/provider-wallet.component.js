import PropTypes from 'prop-types'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useHistory, useParams } from 'react-router-dom'
import { createSelector } from 'reselect'

import AssetImage from '../../components/ui/asset-image';
import { formatDateWithYearContext, shortenAddress } from '../../helpers/utils/util'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { I18nContext } from '../../contexts/i18n'
import {
  getBitGoWalletBalance,
  getBitGoWalletTransfers,
  sendBitGoTransaction
} from '../../store/actions'

import {
  getAllWallets,
  getAllBalances,
  getWalletInfo,
} from '../../selectors/bitgo'

import {
  getAllConversionRates,
  getCurrentConversionRate,
  currentCurrencySelector,
} from '../../selectors/confirm-transaction'

import {
  BRAVE_BITGO_WALLET_INDEX,
} from '../../helpers/constants/routes'

import Button from '../../components/ui/button'
import Tooltip from '../../components/ui/tooltip-v2'
import TransactionStatus from '../../components/app/transaction-status/transaction-status.component'
import TransactionIcon from '../../components/app/transaction-icon'
import {
  TRANSACTION_CATEGORY_RECEIVE,
  CONFIRMED_STATUS,
} from '../../helpers/constants/transactions'

import { Currency } from '../../../../app/scripts/lib/currency-util'

import Send from './send'

const AssetBalance = ({
  balance = {
    balance: '0',
    confirmedBalance: '0',
    spendableBalance: '0',
  },
  coin,
  subtitle,
}) => {

  const currency = Currency.from(coin)
  const conversionRate = useSelector(getCurrentConversionRate(currency.mainNet.id))
  const currentCurrency = useSelector(currentCurrencySelector)

  return (
    <div className="asset-balance">
      <div className="title">
        {(balance.balance / 1e8).toFixed(4)} {currency.id}
      </div>
      <div className="subtitle">
        {subtitle || (
          `$${(conversionRate * (balance.balance / 1e8)).toFixed(2)} ${currentCurrency.toUpperCase()}`
        )}
      </div>
    </div>
  )
}

const WalletMenuItem = ({ active, address, balance, coin, ...props }) => {
  const activeClass = active ? 'active' : ''

  return (
    <div className={`asset-info ${activeClass}`} {...props}>
      <div className="asset-logo">
        <AssetImage asset={coin} />
      </div>
      <AssetBalance balance={balance} coin={coin} subtitle={shortenAddress(address)} />
    </div>
  )
}

const WalletMenu = () => {
  const bitGoWallets = useSelector(getAllWallets)
  const bitGoBalances = useSelector(getAllBalances)
  const history = useHistory()

  const entries = Object.entries(bitGoWallets)

  return (
    <div className="__asset-list">
      {entries.map(([id, wallet]) => {
        const { coin } = wallet
        const balance = bitGoBalances[id]

        return (
          <WalletMenuItem
            active={history.location.pathname === `${BRAVE_BITGO_WALLET_INDEX}/${id}`}
            address={wallet.receiveAddress}
            balance={balance}
            coin={wallet.coin}
            key={`wallet-${id}`}
            onClick={() => history.push(`${BRAVE_BITGO_WALLET_INDEX}/${id}`)}
          />
        )
      })}
    </div>
  )
}

const Tx = ({ tx }) => {
  const category = TRANSACTION_CATEGORY_RECEIVE
  const status = CONFIRMED_STATUS

  return (
    <div className="asset-info tx" key={tx.txid}>
      <TransactionIcon
        category={category}
        status={status}
        className="asset-logo"
      />
      <div className="asset-balance">
        <div className="title">
          {(tx.valueString / 1e8).toFixed(4)} {tx.coin.toUpperCase()}
        </div>
        <div className="subtitle">
          {`$${tx.usd.toFixed(2)} USD`}
        </div>
      </div>
      <div className="tx-info">
        <div className="title">
          {formatDateWithYearContext(new Date(tx.date).valueOf())}
        </div>
        <div className="subtitle">
        </div>
      </div>
    </div>
  )
}

const Wallet = () => {
  const t = useContext(I18nContext)
  const { id } = useParams()
  const history = useHistory()

  const { wallet, balance, transfers } = useSelector(getWalletInfo(id))
  const [copied, handleCopy] = useCopyToClipboard()

  return (<>
    <div className="header">
      <div className="asset-info">
        <div className="asset-logo">
          <AssetImage asset={wallet.coin} />
        </div>
        <AssetBalance balance={balance} coin={wallet.coin} />
      </div>
      <div className="buttons">
        <Button
          className="send-receive-button"
          type="secondary"
          rounded
          onClick={() => { history.push(`${BRAVE_BITGO_WALLET_INDEX}/${id}/send`) }}
        >
          Send / Receive
        </Button>
      </div>
    </div>

    <div className="header">
      <span className="history">History</span>
      <span
          className="address"
          onClick={() => handleCopy(wallet.receiveAddress)}
      >
        <Tooltip
          wrapperClassName="address__tooltip-wrapper"
          position="bottom"
          title={copied ? t('copiedExclamation') : t('copyToClipboard')}
        >
          {shortenAddress(wallet.receiveAddress)}
        </Tooltip>
      </span>
    </div>

    <div className="separator" />

    {!transfers.length ? (
      <span class="no-transactions">{ t('noTransactions') }</span>
    ) : (
      <div className="transactions">
        {transfers.map((transfer) => (
          <Tx key={transfer.txid} tx={transfer} />
        ))}
      </div>
    )}
  </>)
}

const WalletTotal = () => {
  const bitGoWallets = useSelector(getAllWallets)
  const bitGoBalances = useSelector(getAllBalances)

  const currentCurrency = useSelector(currentCurrencySelector).toUpperCase()
  const conversionRates = useSelector(getAllConversionRates)

  let total = 0
  for (const [id, wallet] of Object.entries(bitGoWallets)) {
    let balance = bitGoBalances[wallet.id]
    if (!balance || !balance.balance) {
      continue
    }

    let currency = Currency.from(wallet.coin)
    let conversionRate = conversionRates[currency.mainNet.id][currentCurrency]
    total += ((balance.balance / 1e8) * conversionRate)
  }

  return (
    <span className="__balance">
      ${total.toFixed(2)} {currentCurrency}
    </span>
  )
}

const BraveProviderWallet = () => {
  const t = useContext(I18nContext)

  const bitGoWallets = useSelector(getAllWallets)
  const bitGoBalances = useSelector(getAllBalances)
  const dispatch = useDispatch()

  const [needInitialUpdate, setNeedInitialUpdate] = useState(true)
  const updateBitGoInfo = useCallback(() => {
    for (let [id, wallet] of Object.entries(bitGoWallets)) {
      dispatch(getBitGoWalletBalance(id))
      dispatch(getBitGoWalletTransfers(id))
    }
  }, [dispatch, bitGoWallets])

  useEffect(() => {
    if (needInitialUpdate) {
      updateBitGoInfo()
      setNeedInitialUpdate(false)
    }
    const refreshTimer = setInterval(updateBitGoInfo, 15000)
    return function cleanup() {
      clearInterval(refreshTimer)
    }
  }, [bitGoBalances, setNeedInitialUpdate])

  const entries = Object.entries(bitGoWallets)

  return (
    <div className="main-container provider-wallet">
      <div className="__info-column">
        <div className="__account-balance">
          <div className="__account-info">
            <span className="__value">Total Value</span>
            <WalletTotal />
          </div>
        </div>
        <WalletMenu />
      </div>
      <div className="__activity-pane">
        <Switch>
          <Route path={`${BRAVE_BITGO_WALLET_INDEX}/:id`} component={Wallet} exact />
          <Route path={`${BRAVE_BITGO_WALLET_INDEX}/:id/send`} component={Send} />
        </Switch>
      </div>
    </div>
  )
}

export default BraveProviderWallet
