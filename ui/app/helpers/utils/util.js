const abi = require('human-standard-token-abi')
const ethUtil = require('ethereumjs-util')
const hexToBn = require('../../../../app/scripts/lib/hex-to-bn')
import { DateTime } from 'luxon'
import punycode from 'punycode'

const MIN_GAS_PRICE_GWEI_BN = new ethUtil.BN(1)
const GWEI_FACTOR = new ethUtil.BN(1e9)
const MIN_GAS_PRICE_BN = MIN_GAS_PRICE_GWEI_BN.mul(GWEI_FACTOR)

// formatData :: ( date: <Unix Timestamp> ) -> String
function formatDate (date, format = 'M/d/y \'at\' T') {
  return DateTime.fromMillis(date).toFormat(format)
}

var valueTable = {
  wei: '1000000000000000000',
  kwei: '1000000000000000',
  mwei: '1000000000000',
  gwei: '1000000000',
  szabo: '1000000',
  finney: '1000',
  ether: '1',
  kether: '0.001',
  mether: '0.000001',
  gether: '0.000000001',
  tether: '0.000000000001',
}
var bnTable = {}
for (var currency in valueTable) {
  bnTable[currency] = new ethUtil.BN(valueTable[currency], 10)
}

module.exports = {
  valuesFor: valuesFor,
  addressSummary: addressSummary,
  miniAddressSummary: miniAddressSummary,
  isAllOneCase: isAllOneCase,
  isValidAddress: isValidAddress,
  isValidDomainName,
  numericBalance: numericBalance,
  parseBalance: parseBalance,
  formatBalance: formatBalance,
  generateBalanceObject: generateBalanceObject,
  dataSize: dataSize,
  readableDate: readableDate,
  normalizeToWei: normalizeToWei,
  normalizeEthStringToWei: normalizeEthStringToWei,
  normalizeNumberToWei: normalizeNumberToWei,
  valueTable: valueTable,
  bnTable: bnTable,
  isHex: isHex,
  formatDate,
  bnMultiplyByFraction,
  getTxFeeBn,
  shortenBalance,
  getContractAtAddress,
  exportAsFile: exportAsFile,
  isInvalidChecksumAddress,
  allNull,
  getTokenAddressFromTokenObject,
  checksumAddress,
  addressSlicer,
  isEthNetwork,
  isValidAddressHead,
}

function isEthNetwork (netId) {
  if (!netId || netId === '1' || netId === '3' || netId === '4' || netId === '42' || netId === '5777') {
    return true
  }

  return false
}

function valuesFor (obj) {
  if (!obj) return []
  return Object.keys(obj)
    .map(function (key) { return obj[key] })
}

function addressSummary (address, firstSegLength = 10, lastSegLength = 4, includeHex = true) {
  if (!address) return ''
  let checked = checksumAddress(address)
  if (!includeHex) {
    checked = ethUtil.stripHexPrefix(checked)
  }
  return checked ? checked.slice(0, firstSegLength) + '...' + checked.slice(checked.length - lastSegLength) : '...'
}

function miniAddressSummary (address) {
  if (!address) return ''
  var checked = checksumAddress(address)
  return checked ? checked.slice(0, 4) + '...' + checked.slice(-4) : '...'
}

function isValidAddress (address) {
  var prefixed = ethUtil.addHexPrefix(address)
  if (address === '0x0000000000000000000000000000000000000000') return false
  return (isAllOneCase(prefixed) && ethUtil.isValidAddress(prefixed)) || ethUtil.isValidChecksumAddress(prefixed)
}

function isValidDomainName (address) {
  const match = punycode.toASCII(address)
    .toLowerCase()
    // Checks that the domain consists of at least one valid domain pieces separated by periods, followed by a tld
    // Each piece of domain name has only the characters a-z, 0-9, and a hyphen (but not at the start or end of chunk)
    // A chunk has minimum length of 1, but minimum tld is set to 2 for now (no 1-character tlds exist yet)
    .match(/^(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\.)+[a-z0-9][-a-z0-9]*[a-z0-9]$/)
  return match !== null
}

function isInvalidChecksumAddress (address) {
  var prefixed = ethUtil.addHexPrefix(address)
  if (address === '0x0000000000000000000000000000000000000000') return false
  return !isAllOneCase(prefixed) && !ethUtil.isValidChecksumAddress(prefixed) && ethUtil.isValidAddress(prefixed)
}

function isAllOneCase (address) {
  if (!address) return true
  var lower = address.toLowerCase()
  var upper = address.toUpperCase()
  return address === lower || address === upper
}

// Takes wei Hex, returns wei BN, even if input is null
function numericBalance (balance) {
  if (!balance) return new ethUtil.BN(0, 16)
  var stripped = ethUtil.stripHexPrefix(balance)
  return new ethUtil.BN(stripped, 16)
}

// Takes  hex, returns [beforeDecimal, afterDecimal]
function parseBalance (balance) {
  var beforeDecimal, afterDecimal
  const wei = numericBalance(balance)
  var weiString = wei.toString()
  const trailingZeros = /0+$/

  beforeDecimal = weiString.length > 18 ? weiString.slice(0, weiString.length - 18) : '0'
  afterDecimal = ('000000000000000000' + wei).slice(-18).replace(trailingZeros, '')
  if (afterDecimal === '') { afterDecimal = '0' }
  return [beforeDecimal, afterDecimal]
}

// Takes wei hex, returns an object with three properties.
// Its "formatted" property is what we generally use to render values.
function formatBalance (balance, decimalsToKeep, needsParse = true, ticker = 'ETH') {
  var parsed = needsParse ? parseBalance(balance) : balance.split('.')
  var beforeDecimal = parsed[0]
  var afterDecimal = parsed[1]
  var formatted = 'None'
  if (decimalsToKeep === undefined) {
    if (beforeDecimal === '0') {
      if (afterDecimal !== '0') {
        var sigFigs = afterDecimal.match(/^0*(.{2})/) // default: grabs 2 most significant digits
        if (sigFigs) { afterDecimal = sigFigs[0] }
        formatted = '0.' + afterDecimal + ` ${ticker}`
      }
    } else {
      formatted = beforeDecimal + '.' + afterDecimal.slice(0, 3) + ` ${ticker}`
    }
  } else {
    afterDecimal += Array(decimalsToKeep).join('0')
    formatted = beforeDecimal + '.' + afterDecimal.slice(0, decimalsToKeep) + ` ${ticker}`
  }
  return formatted
}


function generateBalanceObject (formattedBalance, decimalsToKeep = 1) {
  var balance = formattedBalance.split(' ')[0]
  var label = formattedBalance.split(' ')[1]
  var beforeDecimal = balance.split('.')[0]
  var afterDecimal = balance.split('.')[1]
  var shortBalance = shortenBalance(balance, decimalsToKeep)

  if (beforeDecimal === '0' && afterDecimal.substr(0, 5) === '00000') {
    // eslint-disable-next-line eqeqeq
    if (afterDecimal == 0) {
      balance = '0'
    } else {
      balance = '<1.0e-5'
    }
  } else if (beforeDecimal !== '0') {
    balance = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)}`
  }

  return { balance, label, shortBalance }
}

function shortenBalance (balance, decimalsToKeep = 1) {
  var truncatedValue
  var convertedBalance = parseFloat(balance)
  if (convertedBalance > 1000000) {
    truncatedValue = (balance / 1000000).toFixed(decimalsToKeep)
    return `${truncatedValue}m`
  } else if (convertedBalance > 1000) {
    truncatedValue = (balance / 1000).toFixed(decimalsToKeep)
    return `${truncatedValue}k`
  } else if (convertedBalance === 0) {
    return '0'
  } else if (convertedBalance < 0.001) {
    return '<0.001'
  } else if (convertedBalance < 1) {
    var stringBalance = convertedBalance.toString()
    if (stringBalance.split('.')[1].length > 3) {
      return convertedBalance.toFixed(3)
    } else {
      return stringBalance
    }
  } else {
    return convertedBalance.toFixed(decimalsToKeep)
  }
}

function dataSize (data) {
  var size = data ? ethUtil.stripHexPrefix(data).length : 0
  return size + ' bytes'
}

// Takes a BN and an ethereum currency name,
// returns a BN in wei
function normalizeToWei (amount, currency) {
  try {
    return amount.mul(bnTable.wei).div(bnTable[currency])
  } catch (e) {}
  return amount
}

function normalizeEthStringToWei (str) {
  const parts = str.split('.')
  let eth = new ethUtil.BN(parts[0], 10).mul(bnTable.wei)
  if (parts[1]) {
    var decimal = parts[1]
    while (decimal.length < 18) {
      decimal += '0'
    }
    if (decimal.length > 18) {
      decimal = decimal.slice(0, 18)
    }
    const decimalBN = new ethUtil.BN(decimal, 10)
    eth = eth.add(decimalBN)
  }
  return eth
}

var multiple = new ethUtil.BN('10000', 10)
function normalizeNumberToWei (n, currency) {
  var enlarged = n * 10000
  var amount = new ethUtil.BN(String(enlarged), 10)
  return normalizeToWei(amount, currency).div(multiple)
}

function readableDate (ms) {
  var date = new Date(ms)
  var month = date.getMonth()
  var day = date.getDate()
  var year = date.getFullYear()
  var hours = date.getHours()
  var minutes = '0' + date.getMinutes()
  var seconds = '0' + date.getSeconds()

  var dateStr = `${month}/${day}/${year}`
  var time = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return `${dateStr} ${time}`
}

function isHex (str) {
  return Boolean(str.match(/^(0x)?[0-9a-fA-F]+$/))
}

function bnMultiplyByFraction (targetBN, numerator, denominator) {
  const numBN = new ethUtil.BN(numerator)
  const denomBN = new ethUtil.BN(denominator)
  return targetBN.mul(numBN).div(denomBN)
}

function getTxFeeBn (gas, gasPrice = MIN_GAS_PRICE_BN.toString(16)) {
  const gasBn = hexToBn(gas)
  const gasPriceBn = hexToBn(gasPrice)
  const txFeeBn = gasBn.mul(gasPriceBn)

  return txFeeBn.toString(16)
}

function getContractAtAddress (tokenAddress) {
  return global.eth.contract(abi).at(tokenAddress)
}

function exportAsFile (filename, data, type = 'text/csv') {
  // source: https://stackoverflow.com/a/33542499 by Ludovic Feltz
  const blob = new Blob([data], {type})
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const elem = window.document.createElement('a')
    elem.target = '_blank'
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}

function allNull (obj) {
  return Object.entries(obj).every(([_, value]) => value === null)
}

function getTokenAddressFromTokenObject (token) {
  return Object.values(token)[0].address.toLowerCase()
}

/**
 * Safely checksumms a potentially-null address
 *
 * @param {String} [address] - address to checksum
 * @returns {String} - checksummed address
 *
 */
function checksumAddress (address) {
  const checksummed = address ? ethUtil.toChecksumAddress(address) : ''
  return checksummed
}

function addressSlicer (address = '') {
  if (address.length < 11) {
    return address
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function isValidAddressHead (address) {
  const addressLengthIsLessThanFull = address.length < 42
  const addressIsHex = isHex(address)

  return addressLengthIsLessThanFull && addressIsHex
}
