import { uniqBy, cloneDeep, flatten } from 'lodash'
import BigNumber from 'bignumber.js'
import {
  loadLocalStorageData,
  saveLocalStorageData,
} from '../../../lib/local-storage-helpers'
import {
  decGWEIToHexWEI,
} from '../../helpers/utils/conversions.util'
import {
  isEIP1559Network,
  isEthereumNetwork,
} from '../../selectors'
import * as actions from '../../store/actions'

// Actions
const BASIC_GAS_ESTIMATE_LOADING_FINISHED = 'metamask/gas/BASIC_GAS_ESTIMATE_LOADING_FINISHED'
const BASIC_GAS_ESTIMATE_LOADING_STARTED = 'metamask/gas/BASIC_GAS_ESTIMATE_LOADING_STARTED'
const GAS_ESTIMATE_LOADING_FINISHED = 'metamask/gas/GAS_ESTIMATE_LOADING_FINISHED'
const GAS_ESTIMATE_LOADING_STARTED = 'metamask/gas/GAS_ESTIMATE_LOADING_STARTED'
const RESET_CUSTOM_GAS_STATE = 'metamask/gas/RESET_CUSTOM_GAS_STATE'
const RESET_CUSTOM_DATA = 'metamask/gas/RESET_CUSTOM_DATA'
const SET_BASIC_GAS_ESTIMATE_DATA = 'metamask/gas/SET_BASIC_GAS_ESTIMATE_DATA'
const SET_CUSTOM_GAS_ERRORS = 'metamask/gas/SET_CUSTOM_GAS_ERRORS'
const SET_CUSTOM_GAS_LIMIT = 'metamask/gas/SET_CUSTOM_GAS_LIMIT'
const SET_CUSTOM_GAS_PRICE = 'metamask/gas/SET_CUSTOM_GAS_PRICE'
const SET_CUSTOM_PRIORITY_FEE_PER_GAS = 'metamask/gas/SET_CUSTOM_PRIORITY_FEE_PER_GAS'
const SET_CUSTOM_MAX_FEE_PER_GAS = 'metamask/gas/SET_CUSTOM_MAX_FEE_PER_GAS'
const SET_CUSTOM_GAS_TOTAL = 'metamask/gas/SET_CUSTOM_GAS_TOTAL'
const SET_PRICE_AND_TIME_ESTIMATES = 'metamask/gas/SET_PRICE_AND_TIME_ESTIMATES'
const SET_API_ESTIMATES_LAST_RETRIEVED = 'metamask/gas/SET_API_ESTIMATES_LAST_RETRIEVED'
const SET_BASIC_API_ESTIMATES_LAST_RETRIEVED = 'metamask/gas/SET_BASIC_API_ESTIMATES_LAST_RETRIEVED'
const SET_BASIC_PRICE_ESTIMATES_LAST_RETRIEVED = 'metamask/gas/SET_BASIC_PRICE_ESTIMATES_LAST_RETRIEVED'

const initState = {
  customData: {
    price: null,
    limit: null,
    maxPriorityFeePerGas: null,
    maxFeePerGas: null,
  },
  basicEstimates: {
    average: null,
    fastestWait: null,
    fastWait: null,
    fast: null,
    safeLowWait: null,
    blockNum: null,
    avgWait: null,
    blockTime: null,
    speed: null,
    fastest: null,
    safeLow: null,
  },
  basicEstimateIsLoading: true,
  gasEstimatesLoading: true,
  priceAndTimeEstimates: [],
  maxPriorityFeePerGasAndTimeEstimates: [],
  priceAndTimeEstimatesLastRetrieved: 0,
  basicPriceAndTimeEstimatesLastRetrieved: 0,
  basicPriceEstimatesLastRetrieved: 0,
  errors: {},
}

// Reducer
export default function reducer (state = initState, action) {
  switch (action.type) {
    case BASIC_GAS_ESTIMATE_LOADING_STARTED:
      return {
        ...state,
        basicEstimateIsLoading: true,
      }
    case BASIC_GAS_ESTIMATE_LOADING_FINISHED:
      return {
        ...state,
        basicEstimateIsLoading: false,
      }
    case GAS_ESTIMATE_LOADING_STARTED:
      return {
        ...state,
        gasEstimatesLoading: true,
      }
    case GAS_ESTIMATE_LOADING_FINISHED:
      return {
        ...state,
        gasEstimatesLoading: false,
      }
    case SET_BASIC_GAS_ESTIMATE_DATA:
      return {
        ...state,
        basicEstimates: action.value,
      }

    case SET_CUSTOM_PRIORITY_FEE_PER_GAS:
      return {
        ...state,
        customData: {
          ...state.customData,
          maxPriorityFeePerGas: action.value,
        },
      }

    case SET_CUSTOM_MAX_FEE_PER_GAS:
      return {
        ...state,
        customData: {
          ...state.customData,
          maxFeePerGas: action.value,
        },
      }

    case SET_CUSTOM_GAS_PRICE:
      return {
        ...state,
        customData: {
          ...state.customData,
          price: action.value,
        },
      }
    case SET_CUSTOM_GAS_LIMIT:
      return {
        ...state,
        customData: {
          ...state.customData,
          limit: action.value,
        },
      }
    case SET_CUSTOM_GAS_TOTAL:
      return {
        ...state,
        customData: {
          ...state.customData,
          total: action.value,
        },
      }
    case SET_PRICE_AND_TIME_ESTIMATES:
      return {
        ...state,
        priceAndTimeEstimates: action.value,
      }
    case SET_CUSTOM_GAS_ERRORS:
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.value,
        },
      }
    case SET_API_ESTIMATES_LAST_RETRIEVED:
      return {
        ...state,
        priceAndTimeEstimatesLastRetrieved: action.value,
      }
    case SET_BASIC_API_ESTIMATES_LAST_RETRIEVED:
      return {
        ...state,
        basicPriceAndTimeEstimatesLastRetrieved: action.value,
      }
    case SET_BASIC_PRICE_ESTIMATES_LAST_RETRIEVED:
      return {
        ...state,
        basicPriceEstimatesLastRetrieved: action.value,
      }
    case RESET_CUSTOM_DATA:
      return {
        ...state,
        customData: cloneDeep(initState.customData),
      }
    case RESET_CUSTOM_GAS_STATE:
      return cloneDeep(initState)
    default:
      return state
  }
}

// Action Creators
export function basicGasEstimatesLoadingStarted () {
  return {
    type: BASIC_GAS_ESTIMATE_LOADING_STARTED,
  }
}

export function basicGasEstimatesLoadingFinished () {
  return {
    type: BASIC_GAS_ESTIMATE_LOADING_FINISHED,
  }
}

export function gasEstimatesLoadingStarted () {
  return {
    type: GAS_ESTIMATE_LOADING_STARTED,
  }
}

export function gasEstimatesLoadingFinished () {
  return {
    type: GAS_ESTIMATE_LOADING_FINISHED,
  }
}

async function queryEthGasStationBasic () {
  const apiKey = process.env.ETH_GAS_STATION_API_KEY ? `?api-key=${process.env.ETH_GAS_STATION_API_KEY}` : ''
  const url = `https://ethgasstation.info/json/ethgasAPI.json${apiKey}`
  return await window.fetch(url, {
    'headers': {},
    'referrer': 'http://ethgasstation.info/json/',
    'referrerPolicy': 'no-referrer-when-downgrade',
    'body': null,
    'method': 'GET',
    'mode': 'cors',
  })
}

async function queryEthGasStationPredictionTable () {
  const apiKey = process.env.ETH_GAS_STATION_API_KEY ? `?api-key=${process.env.ETH_GAS_STATION_API_KEY}` : ''
  const url = `https://ethgasstation.info/json/predictTable.json${apiKey}`
  return await window.fetch(url, {
    'headers': {},
    'referrer': 'http://ethgasstation.info/json/',
    'referrerPolicy': 'no-referrer-when-downgrade',
    'body': null,
    'method': 'GET',
    'mode': 'cors' },
  )
}

/**
 * Thunk action creator to obtain basic gas estimates. These are used to
 * recommend slow/average/fast gas fee values.
 *
 * @param legacy Fetch only legacy gas pricing information, irrespective of the network.
 * @param force Force fetch estimates, instead of reading from local storage.
 */
export function fetchBasicGasEstimates (legacy = false, force = false) {
  return async (dispatch, getState) => {
    const state = getState()
    const { basicPriceEstimatesLastRetrieved } = state.gas
    const timeLastRetrieved = basicPriceEstimatesLastRetrieved || loadLocalStorageData('BASIC_PRICE_ESTIMATES_LAST_RETRIEVED') || 0

    dispatch(basicGasEstimatesLoadingStarted())

    let basicEstimates
    if ((Date.now() - timeLastRetrieved > 75000) || force) {
      basicEstimates = await fetchExternalBasicGasEstimates(dispatch, state, legacy)
    } else {
      const cachedBasicEstimates = loadLocalStorageData('BASIC_PRICE_ESTIMATES')
      basicEstimates = cachedBasicEstimates || await fetchExternalBasicGasEstimates(dispatch, state, legacy)
    }

    dispatch(setBasicGasEstimateData(basicEstimates))
    dispatch(basicGasEstimatesLoadingFinished())

    return basicEstimates
  }
}

async function fetchExternalBasicGasEstimates (dispatch, state, legacy) {
  const response = await queryEthGasStationBasic()
  const estimates = await response.json()

  const { blockNum, block_time: blockTime } = estimates

  let basicEstimates
  if (isEIP1559Network(state) && !legacy) {
    const conn = actions.getBackgroundConnection()
    const feeOracleResponse = await conn.getMaxPriorityFeePerGasEstimates()

    const estimateGroups = []
    for (let i = 0, j = feeOracleResponse.length; i < j; i += 2) {
      estimateGroups.push(feeOracleResponse.slice(i, i + 2))
    }

    const [fastest, fast, average, safeLow] =
      estimateGroups
        .map((
          [
            { maxPriorityFeePerGas: low },
            { maxPriorityFeePerGas: high },
          ],
        ) => new BigNumber(parseInt(low + high)).div(2).div(1000000000).toNumber())

    basicEstimates = {
      safeLow,
      average,
      fast,
      fastest,
      blockTime,
      blockNum,
    }
  } else {
    const {
      safeLow: safeLowTimes10,
      average: averageTimes10,
      fast: fastTimes10,
      fastest: fastestTimes10,
    } = estimates

    const [average, fast, fastest, safeLow] = [
      averageTimes10,
      fastTimes10,
      fastestTimes10,
      safeLowTimes10,
    ].map((price) => (new BigNumber(price)).div(10).toNumber())

    basicEstimates = {
      safeLow,
      average,
      fast,
      fastest,
      blockTime,
      blockNum,
    }
  }

  const timeRetrieved = Date.now()
  saveLocalStorageData(basicEstimates, 'BASIC_PRICE_ESTIMATES')
  saveLocalStorageData(timeRetrieved, 'BASIC_PRICE_ESTIMATES_LAST_RETRIEVED')
  dispatch(setBasicPriceEstimatesLastRetrieved(timeRetrieved))

  return basicEstimates
}

/**
 * Thunk action creator to obtain basic gas and time estimates. These are used
 * display advanced gas timing information.
 *
 * @param legacy Fetch only legacy gas pricing information, irrespective of the network.
 * @param force Force fetch estimates, instead of reading from local storage.
 */
export function fetchBasicGasAndTimeEstimates (legacy = false, force = false) {
  return async (dispatch, getState) => {
    const state = getState()
    const { basicPriceAndTimeEstimatesLastRetrieved } = state.gas
    const timeLastRetrieved = basicPriceAndTimeEstimatesLastRetrieved || loadLocalStorageData('BASIC_GAS_AND_TIME_API_ESTIMATES_LAST_RETRIEVED') || 0

    dispatch(basicGasEstimatesLoadingStarted())

    let basicEstimates
    if ((Date.now() - timeLastRetrieved > 75000) || force) {
      basicEstimates = await fetchExternalBasicGasAndTimeEstimates(dispatch, state, legacy)
    } else {
      const cachedBasicEstimates = loadLocalStorageData('BASIC_GAS_AND_TIME_API_ESTIMATES')
      basicEstimates = cachedBasicEstimates || await fetchExternalBasicGasAndTimeEstimates(dispatch, state, legacy)
    }

    dispatch(setBasicGasEstimateData(basicEstimates))
    dispatch(basicGasEstimatesLoadingFinished())
    return basicEstimates
  }
}

async function fetchExternalBasicGasAndTimeEstimates (dispatch, state, legacy) {
  const response = await queryEthGasStationBasic()
  const estimates = await response.json()

  const { blockNum, block_time: blockTime, speed } = estimates

  let basicEstimates
  if (isEIP1559Network(state) && !legacy) {
    const conn = actions.getBackgroundConnection()
    const feeOracleResponse = await conn.getMaxPriorityFeePerGasEstimates()

    const estimateGroups = []
    for (let i = 0, j = feeOracleResponse.length; i < j; i += 2) {
      estimateGroups.push(feeOracleResponse.slice(i, i + 2))
    }

    const [fastest, fast, average, safeLow] =
      estimateGroups
        .map((
          [
            { maxPriorityFeePerGas: low },
            { maxPriorityFeePerGas: high },
          ],
        ) => new BigNumber(parseInt(low + high)).div(2).div(1000000000).toNumber())

    const [fastestWait, fastWait, avgWait, safeLowWait] =
      estimateGroups
        .map((
          [
            { timeFactor: low },
            { timeFactor: high },
          ],
        ) => new BigNumber(low + high).div(2).mul(blockTime.toFixed(3)).div(60).toNumber())

    basicEstimates = {
      average,
      avgWait,
      blockTime,
      blockNum,
      fast,
      fastest,
      fastestWait,
      fastWait,
      safeLow,
      safeLowWait,
      speed,
    }
  } else {
    const {
      average: averageTimes10,
      avgWait,
      fast: fastTimes10,
      fastest: fastestTimes10,
      fastestWait,
      fastWait,
      safeLow: safeLowTimes10,
      safeLowWait,
    } = await estimates
    const [average, fast, fastest, safeLow] = [
      averageTimes10,
      fastTimes10,
      fastestTimes10,
      safeLowTimes10,
    ].map((price) => (new BigNumber(price)).div(10).toNumber())

    basicEstimates = {
      average,
      avgWait,
      blockTime,
      blockNum,
      fast,
      fastest,
      fastestWait,
      fastWait,
      safeLow,
      safeLowWait,
      speed,
    }
  }

  const timeRetrieved = Date.now()
  saveLocalStorageData(basicEstimates, 'BASIC_GAS_AND_TIME_API_ESTIMATES')
  saveLocalStorageData(timeRetrieved, 'BASIC_GAS_AND_TIME_API_ESTIMATES_LAST_RETRIEVED')
  dispatch(setBasicApiEstimatesLastRetrieved(timeRetrieved))

  return basicEstimates
}

function extrapolateY ({ higherY, lowerY, higherX, lowerX, xForExtrapolation }) {
  higherY = new BigNumber(higherY, 10)
  lowerY = new BigNumber(lowerY, 10)
  higherX = new BigNumber(higherX, 10)
  lowerX = new BigNumber(lowerX, 10)
  xForExtrapolation = new BigNumber(xForExtrapolation, 10)
  const slope = (higherY.minus(lowerY)).div(higherX.minus(lowerX))
  const newTimeEstimate = slope.times(higherX.minus(xForExtrapolation)).minus(higherY).negated()

  return Number(newTimeEstimate.toPrecision(10))
}

function getRandomArbitrary (min, max) {
  min = new BigNumber(min, 10)
  max = new BigNumber(max, 10)
  const random = new BigNumber(String(Math.random()), 10)
  return new BigNumber(random.times(max.minus(min)).plus(min)).toPrecision(10)
}

function calcMedian (list) {
  const medianPos = (Math.floor(list.length / 2) + Math.ceil(list.length / 2)) / 2
  return medianPos === Math.floor(medianPos)
    ? (list[medianPos - 1] + list[medianPos]) / 2
    : list[Math.floor(medianPos)]
}

function quartiles (data) {
  const lowerHalf = data.slice(0, Math.floor(data.length / 2))
  const upperHalf = data.slice(Math.floor(data.length / 2) + (data.length % 2 === 0 ? 0 : 1))
  const median = calcMedian(data)
  const lowerQuartile = calcMedian(lowerHalf)
  const upperQuartile = calcMedian(upperHalf)
  return {
    median,
    lowerQuartile,
    upperQuartile,
  }
}

function inliersByIQR (data, prop) {
  const { lowerQuartile, upperQuartile } = quartiles(data.map((d) => (prop ? d[prop] : d)))
  const IQR = upperQuartile - lowerQuartile
  const lowerBound = lowerQuartile - (1.5 * IQR)
  const upperBound = upperQuartile + (1.5 * IQR)
  return data.filter((d) => {
    const value = prop ? d[prop] : d
    return value >= lowerBound && value <= upperBound
  })
}

export function fetchGasEstimates (blockTime) {
  return (dispatch, getState) => {
    const state = getState()

    if (!isEthereumNetwork(state)) {
      return Promise.resolve(null)
    }

    const {
      priceAndTimeEstimatesLastRetrieved,
      priceAndTimeEstimates,
    } = state.gas
    const timeLastRetrieved = priceAndTimeEstimatesLastRetrieved || loadLocalStorageData('GAS_API_ESTIMATES_LAST_RETRIEVED') || 0

    dispatch(gasEstimatesLoadingStarted())

    const promiseToFetch = Date.now() - timeLastRetrieved > 75000
      ? queryEthGasStationPredictionTable()
        .then((r) => r.json())
        .then((r) => {
          const estimatedPricesAndTimes = r.map(({ expectedTime, expectedWait, gasprice }) => ({ expectedTime, expectedWait, gasprice }))
          const estimatedTimeWithUniquePrices = uniqBy(estimatedPricesAndTimes, ({ expectedTime }) => expectedTime)

          const withSupplementalTimeEstimates = flatten(estimatedTimeWithUniquePrices.map(({ expectedWait, gasprice }, i, arr) => {
            const next = arr[i + 1]
            if (!next) {
              return [{ expectedWait, gasprice }]
            } else {
              const supplementalPrice = getRandomArbitrary(gasprice, next.gasprice)
              const supplementalTime = extrapolateY({
                higherY: next.expectedWait,
                lowerY: expectedWait,
                higherX: next.gasprice,
                lowerX: gasprice,
                xForExtrapolation: supplementalPrice,
              })
              const supplementalPrice2 = getRandomArbitrary(supplementalPrice, next.gasprice)
              const supplementalTime2 = extrapolateY({
                higherY: next.expectedWait,
                lowerY: supplementalTime,
                higherX: next.gasprice,
                lowerX: supplementalPrice,
                xForExtrapolation: supplementalPrice2,
              })
              return [
                { expectedWait, gasprice },
                { expectedWait: supplementalTime, gasprice: supplementalPrice },
                { expectedWait: supplementalTime2, gasprice: supplementalPrice2 },
              ]
            }
          }))
          const withOutliersRemoved = inliersByIQR(withSupplementalTimeEstimates.slice(0).reverse(), 'expectedWait').reverse()
          const timeMappedToSeconds = withOutliersRemoved.map(({ expectedWait, gasprice }) => {
            const expectedTime = (new BigNumber(expectedWait)).times(Number(blockTime), 10).toNumber()
            return {
              expectedTime,
              gasprice: (new BigNumber(gasprice, 10).toNumber()),
            }
          })

          const timeRetrieved = Date.now()
          dispatch(setApiEstimatesLastRetrieved(timeRetrieved))
          saveLocalStorageData(timeRetrieved, 'GAS_API_ESTIMATES_LAST_RETRIEVED')
          saveLocalStorageData(timeMappedToSeconds, 'GAS_API_ESTIMATES')

          return timeMappedToSeconds
        })
      : Promise.resolve(priceAndTimeEstimates.length
        ? priceAndTimeEstimates
        : loadLocalStorageData('GAS_API_ESTIMATES'),
      )

    return promiseToFetch.then((estimates) => {
      dispatch(setPricesAndTimeEstimates(estimates))
      dispatch(gasEstimatesLoadingFinished())
    })
  }
}

export function setCustomGasPriceForRetry (newPrice) {
  return (dispatch) => {
    if (newPrice !== '0x0') {
      dispatch(setCustomGasPrice(newPrice))
    } else {
      const { fast } = loadLocalStorageData('BASIC_PRICE_ESTIMATES')
      dispatch(setCustomGasPrice(decGWEIToHexWEI(fast)))
    }
  }
}

export function setCustomMaxPriorityFeePerGasForRetry (value) {
  return (dispatch) => {
    if (value !== '0x0') {
      dispatch(setCustomMaxPriorityFeePerGas(value))
    } else {
      const { fast } = loadLocalStorageData('BASIC_PRICE_ESTIMATES')
      dispatch(setCustomMaxPriorityFeePerGas(decGWEIToHexWEI(fast)))
    }
  }
}

export function setCustomMaxFeePerGasForRetry (value) {
  return (dispatch) => {
    if (value !== '0x0') {
      dispatch(setCustomMaxFeePerGas(value))
    } else {
      const { fast } = loadLocalStorageData('BASIC_PRICE_ESTIMATES')
      dispatch(setCustomMaxFeePerGas(decGWEIToHexWEI(fast)))
    }
  }
}

export function setBasicGasEstimateData (basicGasEstimateData) {
  return {
    type: SET_BASIC_GAS_ESTIMATE_DATA,
    value: basicGasEstimateData,
  }
}

export function setPricesAndTimeEstimates (estimatedPricesAndTimes) {
  return {
    type: SET_PRICE_AND_TIME_ESTIMATES,
    value: estimatedPricesAndTimes,
  }
}

export function setCustomGasPrice (newPrice) {
  return {
    type: SET_CUSTOM_GAS_PRICE,
    value: newPrice,
  }
}

export function setCustomMaxPriorityFeePerGas (value) {
  return {
    type: SET_CUSTOM_PRIORITY_FEE_PER_GAS,
    value,
  }
}

export function setCustomMaxFeePerGas (value) {
  return {
    type: SET_CUSTOM_MAX_FEE_PER_GAS,
    value,
  }
}

export function setCustomGasLimit (newLimit) {
  return {
    type: SET_CUSTOM_GAS_LIMIT,
    value: newLimit,
  }
}

export function setCustomGasTotal (newTotal) {
  return {
    type: SET_CUSTOM_GAS_TOTAL,
    value: newTotal,
  }
}

export function setCustomGasErrors (newErrors) {
  return {
    type: SET_CUSTOM_GAS_ERRORS,
    value: newErrors,
  }
}

export function setApiEstimatesLastRetrieved (retrievalTime) {
  return {
    type: SET_API_ESTIMATES_LAST_RETRIEVED,
    value: retrievalTime,
  }
}

export function setBasicApiEstimatesLastRetrieved (retrievalTime) {
  return {
    type: SET_BASIC_API_ESTIMATES_LAST_RETRIEVED,
    value: retrievalTime,
  }
}

export function setBasicPriceEstimatesLastRetrieved (retrievalTime) {
  return {
    type: SET_BASIC_PRICE_ESTIMATES_LAST_RETRIEVED,
    value: retrievalTime,
  }
}

export function resetCustomGasState () {
  return { type: RESET_CUSTOM_GAS_STATE }
}

export function resetCustomData () {
  return { type: RESET_CUSTOM_DATA }
}
