import assert from 'assert'
import ObservableStore from 'obs-store'
import SwapsController from '../../../../app/scripts/controllers/swap'
import sinon from 'sinon'
import ethUtil from 'ethereumjs-util'
import EthTx from 'ethereumjs-tx'
import nock from 'nock'
import { getTestAccounts } from '../../../stub/provider'
import firstTimeState from '../../localhostState'
import { ethers } from 'ethers'
import abi from 'human-standard-token-abi'
import { spawn } from 'child_process'

const buyToken = 'BAT'
const sellToken = 'ETH'
const sellAmount = '1'
const quoteResponse = { 'price': '2308.6875', 'guaranteedPrice': '2057.6875', 'to': '0xdef1c0ded9bec7f1a1670819833240f027b25eff', 'data': '0x415565b0000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000081a00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000004800000000000000000000000000000000000000000000000000000000000000580000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000009ca000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000d9e1ce17f2641f24ae83637ab66a2cca9c378b9f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef00000000000000000000000000000000000000000000000000000000000000b5000000000000000000000000324ea50e48c07deb39c8e98f0479d4abd2bd8e9a0000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000d8775f648430679a709e98d2b0cb6250d2887ef000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000bab33429f6604415dc', 'value': '0.1', 'gas': '332156', 'estimatedGas': '332156', 'from': '0x324ea50e48c07deb39c8e98f0479d4abd2bd8e9a', 'gasPrice': '10', 'protocolFee': '0', 'minimumProtocolFee': '0', 'buyTokenAddress': '0x0d8775f648430679a709e98d2b0cb6250d2887ef', 'sellTokenAddress': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 'buyAmount': '2325', 'sellAmount': '1', 'sources': [{ 'name': '0x', 'proportion': '0' }, { 'name': 'Uniswap', 'proportion': '0' }, { 'name': 'Uniswap_V2', 'proportion': '0' }, { 'name': 'Eth2Dai', 'proportion': '0' }, { 'name': 'Kyber', 'proportion': '0' }, { 'name': 'Curve', 'proportion': '0' }, { 'name': 'LiquidityProvider', 'proportion': '0' }, { 'name': 'MultiBridge', 'proportion': '0' }, { 'name': 'Balancer', 'proportion': '0' }, { 'name': 'CREAM', 'proportion': '0' }, { 'name': 'Bancor', 'proportion': '0' }, { 'name': 'mStable', 'proportion': '0' }, { 'name': 'Mooniswap', 'proportion': '0' }, { 'name': 'MultiHop', 'proportion': '0' }, { 'name': 'Shell', 'proportion': '0' }, { 'name': 'Swerve', 'proportion': '0' }, { 'name': 'SnowSwap', 'proportion': '0' }, { 'name': 'SushiSwap', 'proportion': '1' }, { 'name': 'DODO', 'proportion': '0' }, { 'name': 'DODO_V2', 'proportion': '0' }, { 'name': 'CryptoCom', 'proportion': '0' }, { 'name': 'Linkswap', 'proportion': '0' }], 'orders': [{ 'makerToken': '0x0d8775f648430679a709e98d2b0cb6250d2887ef', 'takerToken': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 'makerAmount': '2506', 'takerAmount': '1', 'fillData': { 'tokenAddressPath': ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x0d8775f648430679a709e98d2b0cb6250d2887ef'], 'router': '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f' }, 'source': 'SushiSwap', 'sourcePathId': '0xe6ec2568702173e49954b9db240a564066e489aeef442878d7d83c000f4be33a', 'type': 0 }], 'allowanceTarget': '0x0000000000000000000000000000000000000000', 'sellTokenToEthRate': '1', 'buyTokenToEthRate': '2473.574981910546627832' }

// function startFork(){
//     const fork = spawn("ganache-cli", ["-m", "\"people carpet cluster attract ankle motor ozone mass dove original primary mask\"", "-f" ,"${RPC_URL}", "-i", "1", "-p" ,"7545"])
//     fork.stdout.on("data", data => {
//         console.log(`stdout: ${data}`);
//     });
// }
describe('Swaps Controller', function () {
  let swapsController, from, slippagePercentage
  // before(function(){
  //     startFork()
  // })

  after(function () {

  })
  beforeEach(function () {

    const url = 'http://localhost:7545'
    const provider = new ethers.providers.JsonRpcProvider(url)
    from = (getTestAccounts()[0]).address
    // slippagePercentage = 0.1
    // const sellAmount = 100
    // const buyToken = "ETH"
    // const sellToken  = "BAT"



    nock('https://api.0x.org/swap/v1/quote')
      .get('?sellAmount=1&buyToken=BAT&sellToken=ETH&buyTokenPercentageFee=0.0875&slippagePercentage=0.1&takerAddress=0x88bb7F89eB5e5b30D3e15a57C68DBe03C6aCCB21&feeRecipient=0x324Ea50e48C07dEb39c8e98f0479d4aBD2Bd8e9a')
      .reply(200, quoteResponse)

    // swapsController = new SwapsController({ provider,
    //   buyToken,
    //   sellToken,
    //   from,
    //   slippagePercentage,
    //   sellAmount,
    //   abi: abi,
    //   // buyAmount,
    //   signTransaction: (ethTx) => new Promise((resolve) => {
    //     ethTx.sign(from.key)
    //     resolve()
    //   }) })

          swapsController = new SwapsController()

  })

  describe('#quote', function () {
    const sellAmount = 100
    const buyToken = "ETH"
    const sellToken  = "BAT"
    it('it should return a quote for the swap', async function () {
      const quote = await swapsController.quote(sellAmount, buyToken,sellToken)
      assert.ok(200, quote.status)
      assert.ok('1', quote.json().sellAmount)
    })
  })

  // TODO: Add more tests
  // describe('#WETH', function () {
  //   it('it should wrap ETH', async function () {
  //     const receipt = await swapsController.wrapETH()
  //     assert.ok(from, receipt.from)
  //     //   assert.ok('1', quote.json().sellAmount)
  //   })
  // })

  // // TODO: Include check to see that transaction is approved.
  // describe('#Transaction', function () {
  //   it('it should approve transaction allowance', async function () {
  //     const allowanceTarget = '0x0000000000000000000000000000000000000000'
  //     const receipt = await swapsController.approveTokenAllowance(
  //       allowanceTarget,
  //     )
  //      console.log(receipt)
  //     //   assert.ok(200, quote.status)
  //     //   assert.ok('1', quote.json().sellAmount)
  //   })

  //       it('it should fill the order', async() => {
  //           let  receipt = await swapsController.fillOrder(
  //                           quoteResponse.to,
  //                           quoteResponse.data,
  //                           quoteResponse.value,
  //                           quoteResponse.gasPrice,
  //                           quoteResponse.gas,
  //                           )
  //            assert(receipt.hash || receipt.blockNumber  != null)
  //            assert.ok(quoteResponse.data , receipt.data)
  //            assert.ok(from, receipt.from)
  //            assert.ok(quoteResponse.to, receipt.to)
  //      })
  // })
})
