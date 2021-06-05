const fetch = require('node-fetch')
const fs = require('fs')
const contractMap = require('eth-contract-metadata')
const ethUtil = require('ethereumjs-util')
const uniqBy = require('lodash/uniqBy')


const ETH = {
  symbol: 'ETH',
  address: '',
  name: 'Ether',
  decimals: 18,
}

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
        .filter(
          ({ address }) => address in contractMap,
        )

      const assets = uniqBy(
        [ETH, ...tokens],
        (e) => e.address,
      )

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
