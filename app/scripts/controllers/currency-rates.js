import { Mutex } from 'await-semaphore'
import EventEmitter from 'events'
import ObservableStore from 'obs-store'

async function safelyExecute(fn) {
  try {
    return await fn()
  } catch (e) {
  }
}

export default class CurrencyRateController extends EventEmitter {
  activeCurrency = ''
  activeNativeCurrency = ''
  internalConfig = {}
  internalState = {}
  mutex = new Mutex()

  getPricingURL(fromCurrencies, toCurrencies) {
    return (
      `https://min-api.cryptocompare.com/data/pricemulti?` +
      `fsyms=${fromCurrencies.join(',')}&` +
      `tsyms=${toCurrencies.join(',')}`
    )
  }

  getCurrentCurrencyFromState(state) {
    return state && state.currentCurrency ? state.currentCurrency : 'usd'
  }

  constructor(config, initialState) {
    super()
    this.configure(Object.assign({
      currentCurrency: this.getCurrentCurrencyFromState(initialState),
      disabled: false,
      interval: 180000,
      nativeCurrency: 'ETH',
      otherCurrencies: ['BTC'],
    }, config))

    this.update(Object.assign({
      conversionDate: 0,
      conversionRate: 0,
      conversionRates: {},
      currentCurrency: this.internalConfig.currentCurrency,
      nativeCurrency: this.internalConfig.nativeCurrency,
      otherCurrencies: this.internalConfig.otherCurrencies,
    }, initialState))

    this.poll()
  }

  configure(config, fullUpdate = true) {
    if (fullUpdate) {
      this.internalConfig = Object.assign(this.internalConfig, config)

      for (const key in this.internalConfig) {
        if (typeof this.internalConfig[key] !== 'undefined') {
          this[key] = this.internalConfig[key]
        }
      }
    } else {
      for (const key in config) {
        if (typeof this.internalConfig[key] !== 'undefined') {
          this.internalConfig[key] = config[key]
          this[key] = config[key]
        }
      }
    }
  }

  get state() {
    return this.internalState
  }

  get config() {
    return this.internalConfig
  }

  set currentCurrency(currency) {
    this.activeCurrency = currency
    safelyExecute(() => this.updateExchangeRate())
  }

  set nativeCurrency(currency) {
    this.activeNativeCurrency = currency
    safelyExecute(() => this.updateExchangeRate())
  }

  addCurrency(currency) {
    if (this.otherCurrencies.indexOf(currency) >= 0) {
      return
    }

    this.otherCurrencies.push(currency)
    safelyExecute(() => this.updateExchangeRate())
  }

  update(state) {
    this.internalState = Object.assign({}, this.internalState, state)
    if (!this.disabled) {
      this.emit('update', this.internalState)
    }
  }

  async poll(interval) {
    if (interval) {
      this.configure({ interval }, false)
    }

    if (this.handle) {
      clearTimeout(this.handle)
    }

    await safelyExecute(() => this.updateExchangeRate())
    this.handle = setTimeout(() => {
      this.poll(this.config.interval)
    }, this.config.interval)
  }

  async fetchExchangeRate(fromCurrencies, toCurrencies) {
    const currentCurrencyUpper = this.activeCurrency.toUpperCase()
    const nativeCurrencyUpper = this.activeNativeCurrency.toUpperCase()

    const url = this.getPricingURL(fromCurrencies, toCurrencies)
    console.log('[currency-rates]', 'fetch', url, 'from', fromCurrencies, 'to', toCurrencies)

    const response = await fetch(this.getPricingURL(fromCurrencies, toCurrencies))
    if (!response.ok) {
      throw new Error(`Fetch failed with status '${response.status}' for request '${request}'`)
    }

    const json = await response.json()
    const result = {
      conversionDate: Date.now() / 1000,
      conversionRates: {},
      currentCurrency: this.activeCurrency,
      nativeCurrency: this.activeNativeCurrency,
    }

    for (const currency of fromCurrencies) {
      const rates = json[currency.toUpperCase()]
      const nativeRate = Number(rates[currentCurrencyUpper])

      if (!Number.isFinite(nativeRate)) {
        throw new Error(`Invalid response for ${currency.toUpperCase()}: ${json[currency.toUpperCase()]}`);
      }

      result.conversionRates[currency.toUpperCase()] = { ...rates }
    }

    // backwards compatibility
    result.conversionRate = result.conversionRates[nativeCurrencyUpper][currentCurrencyUpper]
    return result
  }

  async updateExchangeRate() {
    if (this.disabled || !this.activeCurrency || !this.activeNativeCurrency) {
      return
    }

    const releaseLock = await this.mutex.acquire()
    try {
      const { conversionDate, conversionRate, conversionRates } = await this.fetchExchangeRate(
        [this.activeNativeCurrency, ...this.otherCurrencies],
        [this.activeCurrency],
      )

      this.update({
        conversionDate,
        conversionRate,
        conversionRates: { ...conversionRates },
        currentCurrency: this.activeCurrency,
        nativeCurrency: this.activeNativeCurrency,
      })

      return this.state
    } finally {
      releaseLock()
    }
  }

  subscribe(listener) {
    this.on('update', listener)
  }

  unsubscribe(listener) {
    const count = this.listenerCount('update')
    this.removeListener('update', listener)

    return count > this.listenerCount('update')
  }


}
