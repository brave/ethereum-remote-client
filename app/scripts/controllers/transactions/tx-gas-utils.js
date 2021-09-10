import EthQuery from 'ethjs-query'
import { cloneDeep } from 'lodash'

import { hexToBn, BnMultiplyByFraction, bnToHex } from '../../lib/util'
import log from 'loglevel'

/**
 * Result of gas analysis, including either a gas estimate for a successful analysis, or
 * debug information for a failed analysis.
 * @typedef {Object} GasAnalysisResult
 * @property {string} blockGasLimit - The gas limit of the block used for the analysis
 * @property {string} estimatedGasHex - The estimated gas, in hexadecimal
 * @property {Object} simulationFails - Debug information about why an analysis failed
 */

/**
tx-gas-utils are gas utility methods for Transaction manager
its passed ethquery
and used to do things like calculate gas of a tx.
@param {Object} provider - A network provider.
*/

export default class TxGasUtil {

  constructor (provider) {
    this.query = new EthQuery(provider)
  }

  /**
    @param {Object} txMeta - the txMeta object
    @returns {GasAnalysisResult} The result of the gas analysis
  */
  async analyzeGasUsage (txMeta) {
    const block = await this.query.getBlockByNumber('latest', false)

    // fallback to block gasLimit
    const blockGasLimitBN = hexToBn(block.gasLimit)
    const saferGasLimitBN = BnMultiplyByFraction(blockGasLimitBN, 19, 20)
    let estimatedGasHex = bnToHex(saferGasLimitBN)
    let simulationFails
    try {
      estimatedGasHex = await this.estimateTxGas(txMeta)
    } catch (error) {
      log.warn(error)
      simulationFails = {
        reason: error.message,
        errorKey: error.errorKey,
        debug: { blockNumber: block.number, blockGasLimit: block.gasLimit },
      }
    }

    return { blockGasLimit: block.gasLimit, estimatedGasHex, simulationFails }
  }

  /**
    Estimates the tx's gas usage
    @param {Object} txMeta - the txMeta object
    @returns {string} - the estimated gas limit as a hex string
  */
  async estimateTxGas (txMeta) {
    // Clone the txParams since gas pricing fields will be deleted.
    const txParams = cloneDeep(txMeta.txParams)

    // For estimating transaction gas, we don't really care about the gas
    // pricing. We therefore delete gas pricing fields from the transaction
    // parameters. This will also prevent the EVM to check if the source
    // account has enough balance to perform the transaction.
    //
    // Without EIP-1559 capability, absence of gasLimit field will be
    // interpreted as gasPrice = 0.
    //
    // With EIP-15509 capability, absence of maxPriorityFeePerGas AND
    // maxFeePerGas will be interpreted as BASEFEE = 0.
    //
    // Ref: https://github.com/ethereum/go-ethereum/pull/23027
    delete txParams.gasPrice
    delete txParams.maxPriorityFeePerGas
    delete txParams.maxFeePerGas

    // estimate tx gas requirements
    return await this.query.estimateGas(txParams)
  }

  /**
    Adds a gas buffer with out exceeding the block gas limit

    @param {string} initialGasLimitHex - the initial gas limit to add the buffer too
    @param {string} blockGasLimitHex - the block gas limit
    @returns {string} - the buffered gas limit as a hex string
  */
  addGasBuffer (initialGasLimitHex, blockGasLimitHex) {
    const initialGasLimitBn = hexToBn(initialGasLimitHex)
    const blockGasLimitBn = hexToBn(blockGasLimitHex)
    const upperGasLimitBn = blockGasLimitBn.muln(0.9)
    const bufferedGasLimitBn = initialGasLimitBn.muln(1.5)

    // if initialGasLimit is above blockGasLimit, dont modify it
    if (initialGasLimitBn.gt(upperGasLimitBn)) {
      return bnToHex(initialGasLimitBn)
    }
    // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
    if (bufferedGasLimitBn.lt(upperGasLimitBn)) {
      return bnToHex(bufferedGasLimitBn)
    }
    // otherwise use blockGasLimit
    return bnToHex(upperGasLimitBn)
  }
}
