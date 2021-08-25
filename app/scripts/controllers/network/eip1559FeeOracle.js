/*
Economical Fee Oracle
EIP-1559 transaction fee parameter suggestion algorithm based on the eth_feeHistory API
Author: Zsolt Felfoldi (zsfelfoldi@ethereum.org)
Description: https://github.com/zsfelfoldi/feehistory/blob/main/docs/feeOracle.md
*/

const sampleMinPercentile = 10 // sampled percentile range of exponentially weighted baseFee history
const sampleMaxPercentile = 30

const maxRewardPercentile = 20 // effective reward value to be selected from each individual block
const minBlockPercentile = 40 // economical priority fee to be selected from sorted individual block reward percentiles
const maxBlockPercentile = 70 // urgent priority fee to be selected from sorted individual block reward percentiles

const maxTimeFactor = 128 // highest timeFactor in the returned list of suggestions (power of 2)
const extraPriorityFeeRatio = 0.25 // extra priority fee offered in case of expected baseFee rise
const fallbackPriorityFee = 2e9 // priority fee offered when there are no recent transactions

/*
suggestFees returns a series of maxFeePerGas / maxPriorityFeePerGas values suggested for different time preferences.
The first element corresponds to the highest time preference (most urgent transaction). The basic idea behind the
algorithm is similar to the old "gas price oracle" used in Geth; it takes the prices of recent blocks and makes a
suggestion based on a low percentile of those prices. With EIP-1559 though the base fee of each block provides a less
noisy and more reliable price signal. This allows for more sophisticated suggestions with a variable width
(exponentially weighted) base fee time window. The window width corresponds to the time preference of the user.
The underlying assumption is that price fluctuations over a given past time period indicate the probability of similar
price levels being re-tested by the market over a similar length future time period.
*/
export async function suggestFees (provider) {
  return await suggestFeesAt(provider, 'latest')
}

// suggestFeesAt returns fee suggestions at the specified block
async function suggestFeesAt (provider, head) {
  // feeHistory API call without a reward percentile specified is cheap even with a light client backend because it
  // only needs block headers. Therefore we can afford to fetch a hundred blocks of base fee history in order to make
  // meaningful estimates on variable time scales.
  const feeHistory = await provider.send('eth_feeHistory', [300, head, []])
  const baseFee = []
  const order = []
  for (let i = 0; i < feeHistory.baseFeePerGas.length; i++) {
    baseFee.push(parseInt(feeHistory.baseFeePerGas[i]))
    order.push(i)
  }

  // If a block is full then the baseFee of the next block is copied. The reason is that in full blocks the minimal
  // priority fee might not be enough to get included. The last (pending) block is also assumed to end up being full
  // in order to give some upwards bias for urgent suggestions.
  baseFee[baseFee.length - 1] *= 9 / 8
  for (let i = feeHistory.gasUsedRatio.length - 1; i >= 0; i--) {
    if (feeHistory.gasUsedRatio[i] > 0.9) {
      baseFee[i] = baseFee[i + 1]
    }
  }

  order.sort(function compare (a, b) {
    return baseFee[a] - baseFee[b]
  })

  const rewards = await collectRewards(provider, parseInt(feeHistory.oldestBlock, 16), feeHistory.gasUsedRatio)
  const result = []
  let maxBaseFee = 0
  for (let timeFactor = maxTimeFactor; timeFactor >= 1; timeFactor /= 2) {
    const priorityFee = suggestPriorityFee(rewards, timeFactor)
    let minBaseFee = predictMinBaseFee(baseFee, order, timeFactor - 1)
    let extraFee = 0
    if (minBaseFee > maxBaseFee) {
      maxBaseFee = minBaseFee
    } else {
      // If a narrower time window yields a lower base fee suggestion than a wider window then we are probably in a
      // price dip. In this case getting included with a low priority fee is not guaranteed; instead we use the higher
      // base fee suggestion and also offer extra priority fee to increase the chance of getting included in the base
      // fee dip.
      extraFee = (maxBaseFee - minBaseFee) * extraPriorityFeeRatio
      minBaseFee = maxBaseFee
    }
    result.push({
      timeFactor: timeFactor,
      maxFeePerGas: minBaseFee + priorityFee,
      maxPriorityFeePerGas: priorityFee + extraFee,
    })
  }
  result.reverse()
  return result
}

// suggestPriorityFee suggests a priority fee (maxPriorityFeePerGas) value that's usually sufficient for blocks that
// are not full.
function suggestPriorityFee (rewards, timeFactor) {
  if (rewards.length === 0) {
    return fallbackPriorityFee
  }

  return rewards[
    Math.floor(
      // eslint-disable-next-line no-mixed-operators
      ((rewards.length - 1) * (minBlockPercentile + (maxBlockPercentile - minBlockPercentile) / timeFactor)) / 100,
    )
  ]
}

// collectRewards returns a sorted list of low percentile range miner rewards values from the last few suitable blocks.
async function collectRewards (provider, firstBlock, gasUsedRatio) {
  const percentiles = []
  for (let i = 0; i <= maxRewardPercentile; i++) {
    percentiles.push(i)
  }

  let ptr = gasUsedRatio.length - 1
  let needBlocks = 5
  const rewards = []
  while (needBlocks > 0 && ptr >= 0) {
    const blockCount = maxBlockCount(gasUsedRatio, ptr, needBlocks)
    if (blockCount > 0) {
      // feeHistory API call with reward percentile specified is expensive and therefore is only requested for a few
      // non-full recent blocks.
      const feeHistory = await provider.send('eth_feeHistory', [
        blockCount,
        '0x' + (firstBlock + ptr).toString(16),
        percentiles,
      ])
      for (let i = 0; i < feeHistory.reward.length; i++) {
        for (let j = 0; j <= maxRewardPercentile; j++) {
          const reward = parseInt(feeHistory.reward[i][j])
          if (reward > 0) {
            rewards.push(reward)
          }
        }
      }
      if (feeHistory.reward.length < blockCount) {
        break
      }
      needBlocks -= blockCount
    }
    ptr -= blockCount + 1
  }
  rewards.sort(function (a, b) {
    return a - b
  })
  return rewards
}

// maxBlockCount returns the number of consecutive blocks suitable for priority fee suggestion (gasUsedRatio non-zero
// and not higher than 0.9).
function maxBlockCount (gasUsedRatio, lastIndex, needBlocks) {
  let blockCount = 0
  while (needBlocks > 0 && lastIndex >= 0) {
    if (gasUsedRatio[lastIndex] === 0 || gasUsedRatio[lastIndex] > 0.9) {
      break
    }
    lastIndex--
    needBlocks--
    blockCount++
  }
  return blockCount
}

// predictMinBaseFee calculates an average of base fees in the sampleMinPercentile to sampleMaxPercentile percentile
// range of recent base fee history, each block weighted with an exponential time function based on timeFactor.
function predictMinBaseFee (baseFee, order, timeDiv) {
  if (timeDiv < 1e-6) {
    return baseFee[baseFee.length - 1]
  }
  const pendingWeight = (1 - Math.exp(-1 / timeDiv)) / (1 - Math.exp(-baseFee.length / timeDiv))
  let sumWeight = 0
  let result = 0
  let samplingCurveLast = 0
  for (let i = 0; i < order.length; i++) {
    sumWeight += pendingWeight * Math.exp((order[i] - baseFee.length + 1) / timeDiv)
    const samplingCurveValue = samplingCurve(sumWeight * 100)
    result += (samplingCurveValue - samplingCurveLast) * baseFee[order[i]]
    if (samplingCurveValue >= 1) {
      return result
    }
    samplingCurveLast = samplingCurveValue
  }
  return result
}

// samplingCurve is a helper function for the base fee percentile range calculation.
function samplingCurve (percentile) {
  if (percentile <= sampleMinPercentile) {
    return 0
  }
  if (percentile >= sampleMaxPercentile) {
    return 1
  }
  return (
    (1 - Math.cos(((percentile - sampleMinPercentile) * 2 * Math.PI) / (sampleMaxPercentile - sampleMinPercentile))) / 2
  )
}
