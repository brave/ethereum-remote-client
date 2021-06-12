import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { itParam } from 'mocha-param'
import AmountMaxButton from '../amount-max-button.component.js'
import { BAT, ETH } from '../../../tests/swap-utils.test'


const MOCK = {
  name: 'mockTokenName',
  address: 'mockTokenAddress',
  symbol: 'MOCK',
  decimals: 18,
}

describe('AmountMaxButton Component', function () {
  const propsMethodSpies = {
    setAmount: sinon.spy(),
    refreshQuote: sinon.spy(),
  }

  const context = {
    t: (str) => str + '_t',
    metricsEvent: () => {
    },
  }

  afterEach(function () {
    propsMethodSpies.setAmount.resetHistory()
    propsMethodSpies.refreshQuote.resetHistory()

    sinon.restore()
  })

  describe('onMaxClick()', function () {
    const cases = [
      {
        name: 'ETH',
        props: {
          account: { balance: '73' }, // 0x73 = 115 WEI
          fromAsset: ETH,
          toAsset: MOCK,
          estimatedGasCost: 'f', // 0xf = 15 WEI
        },
        expected: {
          setAmount: ['64'], // 0x64 = 100 WEI
          refreshQuotes: [
            ETH,
            MOCK,
            '64', // 0x64 = 100 WEI
          ],
        },
      },
      {
        name: 'BAT',
        props: {
          account: { balance: '73' }, // 0x73 = 115 WEI
          fromAsset: BAT,
          toAsset: MOCK,
          fromTokenAssetBalance: '64', // 0x64 = 100 WEI
        },
        expected: {
          setAmount: ['64'], // 0x64 = 100 WEI
          refreshQuotes: [
            BAT,
            MOCK,
            '64', // 0x64 = 100 WEI
          ],
        },
      },
    ]

    itParam(
      'should call setAmount and refreshQuotes for ${value.name}',
      cases,
      function ({ props, expected }) {
        const wrapper = shallow(
          <AmountMaxButton
            toAsset={MOCK}
            setAmount={propsMethodSpies.setAmount}
            refreshQuote={propsMethodSpies.refreshQuote}
            {...props}
          />,
          { context },
        )
        const instance = wrapper.instance()

        assert.strictEqual(propsMethodSpies.setAmount.callCount, 0)
        assert.strictEqual(propsMethodSpies.refreshQuote.callCount, 0)

        instance.onMaxClick()

        assert.strictEqual(propsMethodSpies.setAmount.callCount, 1)
        assert.deepStrictEqual(
          propsMethodSpies.setAmount.getCall(0).args,
          expected.setAmount,
        )

        assert.strictEqual(propsMethodSpies.refreshQuote.callCount, 1)
        assert.deepStrictEqual(
          propsMethodSpies.refreshQuote.getCall(0).args,
          expected.refreshQuotes,
        )
      },
    )
  })

  describe('render()', function () {
    it('should render as null when fromAsset is missing', function () {
      const wrapper = shallow(
        <AmountMaxButton
          setAmount={() => {
          }}
          refreshQuote={() => {
          }}
          account={{ balance: '0' }}
        />,
        { context },
      )

      assert(wrapper.isEmptyRender())
    })

    it('should render the Max button', function () {
      const wrapper = shallow(
        <AmountMaxButton
          setAmount={() => {
          }}
          refreshQuote={() => {
          }}
          account={{ balance: '0' }}
          fromAsset={ETH}
          toAsset={MOCK}
        />,
        { context },
      )

      assert.strictEqual(wrapper.find('span').text(), 'max_t')
    })
  })
})
