import assert from 'assert'
import SwapsController, { createQueryString } from '../../../../app/scripts/controllers/swap'
import nock from 'nock'
import { MAINNET } from '../../../../app/scripts/controllers/network/enums'

const quoteResponse = {
  price: '548.34375',
  guaranteedPrice: '439.57375',
  to: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
  data: '0xDEADBEEF',
  value: '100',
  gas: '280000',
  estimatedGas: '280000',
  gasPrice: '21',
  protocolFee: '0',
  minimumProtocolFee: '0',
  buyTokenAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  sellTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  buyAmount: '198429',
  sellAmount: '100',
  sources: [
    { name: '0x', proportion: '0' },
    { name: 'Uniswap', proportion: '0' },
    { name: 'Uniswap_V2', proportion: '0' },
    { name: 'SushiSwap', proportion: '1' },
  ],
  orders: [
    {
      makerToken: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      takerToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      makerAmount: '362536',
      takerAmount: '100',
      fillData: {
        tokenAddressPath: [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        ],
        router: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
      },
      source: 'SushiSwap',
      sourcePathId:
        '0x5c2c562608bb39937b2421333ac1a95cc0a55e81a7792efc81bc858f9d4e770c',
      type: 0,
    },
  ],
  allowanceTarget: '0x0000000000000000000000000000000000000000',
  sellTokenToEthRate: '1',
  buyTokenToEthRate: '3557.1034673136928607',
}

describe('Swaps Controller', function () {
  let swapsController

  beforeEach(function () {
    const qs = createQueryString({
      sellAmount: '100',
      buyToken: 'BAT',
      sellToken: 'ETH',
      buyTokenPercentageFee: '0.875',
      slippagePercentage: '0.03',
      feeRecipient: '0xbd9420A98a7Bd6B89765e5715e169481602D9c3d',
      gasPrice: '21',
    })

    nock('https://api.0x.org/swap/v1/quote')
      .get(`?${qs}`)
      .reply(200, quoteResponse)

    swapsController = new SwapsController({})
  })

  describe('#quote', function () {
    it('it should return a quote for the swap', async function () {
      const quote = await swapsController.quote(
        'ETH',
        'BAT',
        '100',
        '21',
        MAINNET,
      )
      assert.ok(200, quote.status)
      assert.deepStrictEqual(quote, quoteResponse)
    })
  })
})
