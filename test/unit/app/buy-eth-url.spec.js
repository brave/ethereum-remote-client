import assert from 'assert'
import getBuyEthUrl from '../../../app/scripts/lib/buy-eth-url'

describe('buy-eth-url', function () {
  const ropsten = {
    network: '3',
  }
  const rinkeby = {
    network: '4',
  }
  const kovan = {
    network: '42',
  }

  it('returns metamask ropsten faucet for network 3', function () {
    const ropstenUrl = getBuyEthUrl(ropsten)
    assert.equal(ropstenUrl, 'https://faucet.metamask.io/')
  })

  it('returns rinkeby dapp for network 4', function () {
    const rinkebyUrl = getBuyEthUrl(rinkeby)
    assert.equal(rinkebyUrl, 'https://www.rinkeby.io/')
  })

  it('returns kovan github test faucet for network 42', function () {
    const kovanUrl = getBuyEthUrl(kovan)
    assert.equal(kovanUrl, 'https://github.com/kovan-testnet/faucet')
  })

})
