import Button from '@material-ui/core/Button'
import CurrencyInput from '../../components/ui/currency-input'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import BitGoClient from 'brave-bitgo-client'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useI18nContext } from '../../hooks/useI18nContext'
import {
  getAllConversionRates,
  getCurrentConversionRate,
  currentCurrencySelector,
} from '../../selectors/confirm-transaction'
import { Currency } from '../../../../app/scripts/lib/currency-util'

import {
  sendBitGoTransaction
} from '../../store/actions'

import AssetImage from '../../components/ui/asset-image'

// we're only using this for validating btc addresses
let bgClient

function bitGoClient() {
  if (!bgClient) {
     bgClient = new BitGoClient('prod')
  }
  return bgClient
}

function validateAddress(wallet, address) {
  try {
    if (!bitGoClient().verifyAddress(wallet.coin, address)) {
      return 'Invalid address'
    }
  } catch (e) {
    return String(e)
  }

  return null
}

function validateAmount(wallet, amount) {
  const fAmount = parseFloat(amount)
  if (Number.isNaN(fAmount)) {
    return 'Invalid amount'
  }

  const balance = parseInt(wallet.spendableBalance)
  const amountDec = fAmount * 1e8
  if (amountDec > balance) {
    return 'Insufficient balance'
  }

  return null
}

const setAndValidate = (wallet, setter, validator, errorSetter) => (e) => {
  const { value } = e.target
  setter(value)
  if (value === '') {
    return
  }

  const error = validator(wallet, value)
  errorSetter(error || null)
}

const Send = () => {
  const { id } = useParams()
  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState(null)
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState(null)

  const t = useI18nContext()
  const wallet = useSelector((state) => state.metamask.bitgoWallets[id])
  const balance = useSelector((state) => state.brave.bitGoBalances[id])

  const currency = Currency.from(wallet.coin)
  const conversionRate = useSelector(getCurrentConversionRate(currency.mainNet.id))
  const currentCurrency = useSelector(currentCurrencySelector).toUpperCase()
  const dispatch = useDispatch()

  const canSend = amount && address && !amountError && !addressError

  const handleChangeAddress = useCallback(
    setAndValidate(wallet, setAddress, validateAddress, setAddressError),
    [wallet, setAddress, setAddressError])

  const handleChangeAmount = useCallback(
    setAndValidate(wallet, setAmount, validateAmount, setAmountError),
    [wallet, setAmount, setAmountError])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('send', amount, wallet.coin, 'to', address)
    dispatch(sendBitGoTransaction(wallet.id, amount * 1e8, address))
  })


  return (
    <div className="send-page">
      <form className="send-form" onSubmit={handleSubmit}>
        <TextField
          id="address"
          label={t('recipientAddress')}
          value={address}
          onChange={handleChangeAddress}
          error={!!addressError}
          helperText={addressError}
          autoFocus
          fullWidth
          variant="outlined"
        />
        <TextField
          id="amount"
          label={t('amount')}
          value={amount}
          onChange={handleChangeAmount}
          error={!!amountError}
          autoFocus
          fullWidth
          variant="outlined"
          helperText={amountError || `${(conversionRate * amount).toFixed(2)} ${currentCurrency}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssetImage className="amount-icon" asset={currency.id} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">{currency.id}</InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          className="send-submit"
          disabled={!canSend}
          fullWidth
          variant="contained"
          size="large"
          disableRipple
        >
        { t('send') }
      </Button>
      </form>
    </div>
  )
}

export default Send
