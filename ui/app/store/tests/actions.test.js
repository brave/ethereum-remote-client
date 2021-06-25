import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import sinon from 'sinon'
import assert from 'assert'
import { itParam } from 'mocha-param'

import * as types from '../actionConstants'
import * as actions from '../actions'
import * as utils from '../utils'
import * as ducks from '../../ducks/swap/swap.duck'

import { ROPSTEN } from '../../../../app/scripts/controllers/network/enums'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const [ETH, DAI] = [
  {
    symbol: 'ETH',
    address: '',
    name: 'Ether',
    decimals: 18,
  },
  {
    symbol: 'DAI',
    address: '0xad6d458402f60fd3bd25163575031acdce07538d',
    name: 'Dai',
    decimals: 18,
  },
]

describe('async actions creators', function () {
  const cases = [
    {
      name: 'fetchSwapQuote(ETH, DAI, "de0b6b3a7640000", "5208")',
      props: [ETH, DAI, 'de0b6b3a7640000', '5208'],
      network: ROPSTEN,
      expected: [
        {
          type: types.UPDATE_SWAP_QUOTE,
          value: 'ETH-DAI-1000000000000000000-21000',
        },
        {
          type: ducks.UPDATE_SWAP_ERRORS,
          value: { quote: null },
        },
        { type: types.UPDATE_SWAP_FROM_TOKEN_ASSET_ALLOWANCE, value: null },
      ],
    },
    {
      name: 'fetchSwapQuote(DAI, ETH, "de0b6b3a7640000", "5208")',
      props: [DAI, ETH, 'de0b6b3a7640000', '5208'],
      network: ROPSTEN,
      expected: [
        {
          type: types.UPDATE_SWAP_QUOTE,
          value: 'DAI-ETH-1000000000000000000-21000',
        },
        {
          type: ducks.UPDATE_SWAP_ERRORS,
          value: { quote: null },
        },
        { type: types.UPDATE_SWAP_FROM_TOKEN_ASSET_ALLOWANCE, value: '64' },
      ],
    },
  ]

  // eslint-disable-next-line mocha/no-hooks-for-single-case
  before(function () {
    sinon.stub(actions, 'getBackgroundConnection').returns({
      quote: sinon
        .stub()
        .callsFake(function (fromAsset, toAsset, amount, gasPrice) {
          return `${fromAsset.symbol}-${toAsset.symbol}-${amount}-${gasPrice}`
        }),
    })

    sinon.stub(utils, 'makeContract').returns({
      allowance: sinon.stub().resolves({
        remaining: 100,
      }),
    })
  })

  itParam('should handle ${value.name}', cases, function ({
    props,
    expected,
    network,
  }) {
    const store = mockStore({
      metamask: {
        provider: {
          nickname: network,
        },
      },
    })

    const actionCreator = actions.fetchSwapQuote(...props)

    return store.dispatch(actionCreator).then(() => {
      assert.deepStrictEqual(store.getActions(), expected)
    })
  })
})
