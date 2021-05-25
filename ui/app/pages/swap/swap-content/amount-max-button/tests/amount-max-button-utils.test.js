import assert from 'assert'
import { calcMaxAmount } from '../amount-max-button.utils.js'

describe('amount-max-button utils', function () {
  describe('calcMaxAmount()', function () {
    it('should calculate the correct max amount for ETH', function () {
      assert.deepStrictEqual(
        calcMaxAmount({
          balance: 'ffffff', // 16777215 WEI
          estimatedGasCost: 'ff', // 255 WEI
          fromAsset: {
            address: '',
          },
        }),
        'ffff00', // 16777215 WEI - 255 WEI = 16776960 WEI
      )
    })

    it('should calculate the correct max amount for ETH without gas estimates', function () {
      assert.deepStrictEqual(
        calcMaxAmount({
          balance: 'ffffff', // 16777215 WEI
          fromAsset: {
            address: '',
          },
        }),
        'ffffff', // 16777215 WEI
      )
    })

    it('should calculate the correct max amount for token', function () {
      assert.deepStrictEqual(
        calcMaxAmount({
          fromAsset: {
            address: '0x1234',
          },
          balance: 'e8d4a51000', // 1000000000000 units
        }),
        'e8d4a51000', // 1000000000000 units
      )
    })
  })
})
