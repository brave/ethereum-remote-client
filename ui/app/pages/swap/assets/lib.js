const fetch = require('node-fetch')
const fs = require('fs')
const contractMap = require('@metamask/contract-metadata')
const ethUtil = require('ethereumjs-util')
const uniqBy = require('lodash/uniqBy')
const sortBy = require('lodash/sortBy')

const ETH = {
  symbol: 'ETH',
  address: '',
  name: 'Ether',
  decimals: 18,
}

const assetsPriorityList = [
  'ETH',
  'WETH',
  'USDT',
  'USDC',
  'UNI',
  'LINK',
  'BUSD',
  'MATIC',
  'WBTC',
  'DAI',
  'AAVE',
]

function main () {
  fetch('https://tokens.coingecko.com/uniswap/all.json').then((r) =>
    r.json().then((data) => {
      const tokens = data.tokens
        .map((token) => ({
          address: ethUtil.toChecksumAddress(token.address),
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
        }))
        .filter(({ address }) => address in contractMap)

      let assets = uniqBy([ETH, ...tokens], (e) => e.address)

      assets = prioritySort(assets, assetsPriorityList)

      try {
        fs.writeFileSync(
          `${__dirname}/assets.mainnet.json`,
          JSON.stringify(assets, null, 4),
        )
        console.log('✅️ Asset list successfully updated.')
      } catch (error) {
        console.error(error)
      }
    }),
  )
}

module.exports.main = main

function prioritySort (assets) {
  return [
    ...assetsPriorityList.map(
      (asset) => assets.filter((e) => e.symbol === asset)[0],
    ),
    ...sortBy(
      assets.filter((asset) => !assetsPriorityList.includes(asset.symbol)),
      (asset) => asset.symbol,
    ),
  ]
}
