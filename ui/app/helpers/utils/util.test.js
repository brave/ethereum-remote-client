import assert from 'assert'
import { BN, toChecksumAddress } from 'ethereumjs-util'
import * as util from './util'

describe('util', function () {
  let ethInWei = '1'
  for (let i = 0; i < 18; i++) {
    ethInWei += '0'
  }

  describe('#parseBalance', function () {
    it('should render 0.01 eth correctly', function () {
      const input = '0x2386F26FC10000'
      const output = util.parseBalance(input)
      assert.deepEqual(output, ['0', '01'])
    })

    it('should render 12.023 eth correctly', function () {
      const input = 'A6DA46CCA6858000'
      const output = util.parseBalance(input)
      assert.deepEqual(output, ['12', '023'])
    })

    it('should render 0.0000000342422 eth correctly', function () {
      const input = '0x7F8FE81C0'
      const output = util.parseBalance(input)
      assert.deepEqual(output, ['0', '0000000342422'])
    })

    it('should render 0 eth correctly', function () {
      const input = '0x0'
      const output = util.parseBalance(input)
      assert.deepEqual(output, ['0', '0'])
    })
  })

  describe('#addressSummary', function () {
    it('should add case-sensitive checksum', function () {
      const address = '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825'
      const result = util.addressSummary(address)
      assert.equal(result, '0xFDEa65C8...b825')
    })

    it('should accept arguments for firstseg, lastseg, and keepPrefix', function () {
      const address = '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825'
      const result = util.addressSummary(address, 4, 4, false)
      assert.equal(result, 'FDEa...b825')
    })
  })

  describe('#isValidAddress', function () {
    it('should allow 40-char non-prefixed hex', function () {
      const address = 'fdea65c8e26263f6d9a1b5de9555d2931a33b825'
      const result = util.isValidAddress(address)
      assert.ok(result)
    })

    it('should allow 42-char non-prefixed hex', function () {
      const address = '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825'
      const result = util.isValidAddress(address)
      assert.ok(result)
    })

    it('should not allow less non hex-prefixed', function () {
      const address = 'fdea65c8e26263f6d9a1b5de9555d2931a33b85'
      const result = util.isValidAddress(address)
      assert.ok(!result)
    })

    it('should not allow less hex-prefixed', function () {
      const address = '0xfdea65ce26263f6d9a1b5de9555d2931a33b85'
      const result = util.isValidAddress(address)
      assert.ok(!result)
    })

    it('should recognize correct capitalized checksum', function () {
      const address = '0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825'
      const result = util.isValidAddress(address)
      assert.ok(result)
    })

    it('should recognize incorrect capitalized checksum', function () {
      const address = '0xFDea65C8e26263F6d9A1B5de9555D2931A33b825'
      const result = util.isValidAddress(address)
      assert.ok(!result)
    })

    it('should recognize this sample hashed address', function () {
      const address = '0x5Fda30Bb72B8Dfe20e48A00dFc108d0915BE9Bb0'
      const result = util.isValidAddress(address)
      const hashed = toChecksumAddress(address.toLowerCase())
      assert.equal(hashed, address, 'example is hashed correctly')
      assert.ok(result, 'is valid by our check')
    })
  })

  describe('isValidDomainName', function () {
    it('should return true when given a valid domain name', function () {
      assert.strictEqual(util.isValidDomainName('foo.bar'), true)
    })

    it('should return true when given a valid subdomain', function () {
      assert.strictEqual(util.isValidDomainName('foo.foo.bar'), true)
    })

    it('should return true when given a single-character domain', function () {
      assert.strictEqual(util.isValidDomainName('f.bar'), true)
    })

    it('should return true when given a unicode TLD', function () {
      assert.strictEqual(util.isValidDomainName('台灣.中国'), true)
    })

    it('should return false when given a domain with unacceptable ASCII characters', function () {
      assert.strictEqual(util.isValidDomainName('$.bar'), false)
    })

    it('should return false when given a TLD that starts with a dash', function () {
      assert.strictEqual(util.isValidDomainName('foo.-bar'), false)
    })

    it('should return false when given a TLD that ends with a dash', function () {
      assert.strictEqual(util.isValidDomainName('foo.bar-'), false)
    })

    it('should return false when given a domain name with a chunk that starts with a dash', function () {
      assert.strictEqual(util.isValidDomainName('-foo.bar'), false)
    })

    it('should return false when given a domain name with a chunk that ends with a dash', function () {
      assert.strictEqual(util.isValidDomainName('foo-.bar'), false)
    })

    it('should return false when given a bare TLD', function () {
      assert.strictEqual(util.isValidDomainName('bar'), false)
    })

    it('should return false when given a domain that starts with a period', function () {
      assert.strictEqual(util.isValidDomainName('.bar'), false)
    })

    it('should return false when given a subdomain that starts with a period', function () {
      assert.strictEqual(util.isValidDomainName('.foo.bar'), false)
    })

    it('should return false when given a domain that ends with a period', function () {
      assert.strictEqual(util.isValidDomainName('bar.'), false)
    })

    it('should return false when given a 1-character TLD', function () {
      assert.strictEqual(util.isValidDomainName('foo.b'), false)
    })
  })

  describe('#numericBalance', function () {
    it('should return a BN 0 if given nothing', function () {
      const result = util.numericBalance()
      assert.equal(result.toString(10), 0)
    })

    it('should work with hex prefix', function () {
      const result = util.numericBalance('0x012')
      assert.equal(result.toString(10), '18')
    })

    it('should work with no hex prefix', function () {
      const result = util.numericBalance('012')
      assert.equal(result.toString(10), '18')
    })
  })

  describe('#formatBalance', function () {
    it('should return None when given nothing', function () {
      const result = util.formatBalance()
      assert.equal(result, 'None', 'should return "None"')
    })

    it('should return 1.0000 ETH', function () {
      const input = new BN(ethInWei, 10).toJSON()
      const result = util.formatBalance(input, 4)
      assert.equal(result, '1.0000 ETH')
    })

    it('should return 0.500 ETH', function () {
      const input = new BN(ethInWei, 10).div(new BN('2', 10)).toJSON()
      const result = util.formatBalance(input, 3)
      assert.equal(result, '0.500 ETH')
    })

    it('should display specified decimal points', function () {
      const input = '0x128dfa6a90b28000'
      const result = util.formatBalance(input, 2)
      assert.equal(result, '1.33 ETH')
    })
    it('should default to 3 decimal points', function () {
      const input = '0x128dfa6a90b28000'
      const result = util.formatBalance(input)
      assert.equal(result, '1.337 ETH')
    })
    it('should show 2 significant digits for tiny balances', function () {
      const input = '0x1230fa6a90b28'
      const result = util.formatBalance(input)
      assert.equal(result, '0.00032 ETH')
    })
    it('should not parse the balance and return value with 2 decimal points with ETH at the end', function () {
      const value = '1.2456789'
      const needsParse = false
      const result = util.formatBalance(value, 2, needsParse)
      assert.equal(result, '1.24 ETH')
    })
  })

  describe('normalizing values', function () {
    describe('#isHex', function () {
      it('should return true when given a hex string', function () {
        const result = util.isHex('c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2')
        assert(result)
      })

      it('should return false when given a non-hex string', function () {
        const result = util.isHex('c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714imnotreal')
        assert(!result)
      })

      it('should return false when given a string containing a non letter/number character', function () {
        const result = util.isHex('c3ab8ff13720!8ad9047dd39466b3c%8974e592c2fa383d4a396071imnotreal')
        assert(!result)
      })

      it('should return true when given a hex string with hex-prefix', function () {
        const result = util.isHex('0xc3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2')
        assert(result)
      })
    })

    describe('#getRandomFileName', function () {
      it('should only return a string containing alphanumeric characters', function () {
        const result = util.getRandomFileName()
        assert(result.match(/^[a-zA-Z0-9]*$/g))
      })

      // 50 samples
      it('should return a string that is between 6 and 12 characters in length', function () {
        for (let i = 0; i < 50; i++) {
          const result = util.getRandomFileName()
          assert(result.length >= 6 && result.length <= 12)
        }
      })
    })
  })

  describe('checkExistingAddresses', function () {
    const tokenList = [
      { address: 'A' },
      { address: 'n' },
      { address: 'Q' },
      { address: 'z' },
    ]

    it('should return true when a lowercase address matches an uppercase address in the passed list', function () {
      assert(util.checkExistingAddresses('q', tokenList) === true)
    })

    it('should return true when an uppercase address matches a lowercase address in the passed list', function () {
      assert(util.checkExistingAddresses('N', tokenList) === true)
    })

    it('should return true when a lowercase address matches a lowercase address in the passed list', function () {
      assert(util.checkExistingAddresses('z', tokenList) === true)
    })

    it('should return true when an uppercase address matches an uppercase address in the passed list', function () {
      assert(util.checkExistingAddresses('Q', tokenList) === true)
    })

    it('should return false when the passed address is not in the passed list', function () {
      assert(util.checkExistingAddresses('b', tokenList) === false)
    })
  })
})
