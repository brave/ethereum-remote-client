import { strict as assert } from 'assert'
import sinon from 'sinon'
import nock from 'nock'
import NetworkController from '../../../../../app/scripts/controllers/network'
import { getNetworkDisplayName } from '../../../../../app/scripts/controllers/network/util'
import { NetworkCapabilities } from '../../../../../app/scripts/controllers/network/enums'

describe('NetworkController', function () {
  describe('controller', function () {
    let networkController
    let getLatestBlock

    const noop = () => {}
    const networkControllerProviderConfig = {
      getAccounts: noop,
    }

    beforeEach(function () {
      nock('https://rinkeby.infura.io')
        .persist()
        .post('/metamask')
        .reply(200)

      networkController = new NetworkController()

      getLatestBlock = sinon
        .stub(networkController, 'getLatestBlock')
        .callsFake(() => Promise.resolve({}))
    })

    afterEach(function () {
      nock.cleanAll()
      getLatestBlock.reset()
    })

    describe('#provider', function () {
      it('provider should be updatable without reassignment', function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        const providerProxy = networkController.getProviderAndBlockTracker().provider
        assert.equal(providerProxy.test, undefined)
        providerProxy.setTarget({ test: true })
        assert.equal(providerProxy.test, true)
      })
    })

    describe('#getNetworkState', function () {
      it('should return "loading" when new', function () {
        const networkState = networkController.getNetworkState()
        assert.equal(networkState, 'loading', 'network is loading')
      })
    })

    describe('#setNetworkState', function () {
      it('should update the network', function () {
        networkController.setNetworkState('1')
        const networkState = networkController.getNetworkState()
        assert.equal(networkState, '1', 'network is 1')

        assert.equal(getLatestBlock.calledOnce, true)
      })
    })

    describe('#setProviderType', function () {
      it('should update provider.type', function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        networkController.setProviderType('mainnet')
        const type = networkController.getProviderConfig().type
        assert.equal(type, 'mainnet', 'provider type is updated')
      })

      it('should set the network to loading', function () {
        networkController.initializeProvider(networkControllerProviderConfig)

        const spy = sinon.spy(networkController, 'setNetworkState')
        networkController.setProviderType('mainnet')

        assert.equal(
          spy.callCount, 1,
          'should have called setNetworkState 2 times',
        )
        assert.ok(
          spy.calledOnceWithExactly('loading'),
          'should have called with "loading" first',
        )

        assert.equal(getLatestBlock.calledOnce, false)
      })
    })

    describe('network capabilities', function () {
      it('should not have EIP1559 capability on initialization', function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        assert.equal(networkController.hasNetworkCapability(NetworkCapabilities.EIP1559), false)
      })

      it('should not have EIP1559 capability if baseFeePerGas is not in block header', function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        getLatestBlock.callsFake(() =>
          Promise.resolve({ someHeader: 'foo' }),
        )
        networkController.setNetworkCapabilities()
        assert.equal(networkController.hasNetworkCapability(NetworkCapabilities.EIP1559), false)
      })

      it('should have EIP1559 capability if baseFeePerGas is in block header', async function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        getLatestBlock.callsFake(() =>
          Promise.resolve({ baseFeePerGas: 'foo' }),
        )
        await networkController.setNetworkCapabilities()
        assert.equal(networkController.hasNetworkCapability(NetworkCapabilities.EIP1559), true)
      })

      it('should cache EIP1559 capability', async function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        getLatestBlock.callsFake(() =>
          Promise.resolve({ baseFeePerGas: 'foo' }),
        )

        // Set network capabilities twice
        await networkController.setNetworkCapabilities()
        await networkController.setNetworkCapabilities()

        assert.equal(networkController.hasNetworkCapability(NetworkCapabilities.EIP1559), true)
        assert.equal(getLatestBlock.calledOnce, true)
      })

      it('should clear network capabilities when switching networks', async function () {
        networkController.initializeProvider(networkControllerProviderConfig)
        getLatestBlock.callsFake(() =>
          Promise.resolve({ baseFeePerGas: 'foo' }),
        )

        await networkController.setNetworkState('mainnet')
        assert.equal(networkController.hasNetworkCapability(NetworkCapabilities.EIP1559), true)

        await networkController.setNetworkState('loading')
        assert.equal(networkController.hasNetworkCapability(NetworkCapabilities.EIP1559), false)
      })
    })
  })

  describe('utils', function () {
    it('getNetworkDisplayName should return the correct network name', function () {
      const tests = [
        {
          input: '3',
          expected: 'Ropsten',
        }, {
          input: '4',
          expected: 'Rinkeby',
        }, {
          input: '42',
          expected: 'Kovan',
        }, {
          input: '0x3',
          expected: 'Ropsten',
        }, {
          input: '0x4',
          expected: 'Rinkeby',
        }, {
          input: '0x2a',
          expected: 'Kovan',
        }, {
          input: 'ropsten',
          expected: 'Ropsten',
        }, {
          input: 'rinkeby',
          expected: 'Rinkeby',
        }, {
          input: 'kovan',
          expected: 'Kovan',
        }, {
          input: 'mainnet',
          expected: 'Main Ethereum Network',
        }, {
          input: 'goerli',
          expected: 'Goerli',
        },
      ]

      tests.forEach(({ input, expected }) => assert.equal(getNetworkDisplayName(input), expected))
    })
  })
})
