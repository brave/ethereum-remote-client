import contractMap from 'eth-contract-metadata'
import ethUtil from 'ethereumjs-util'

/**
 * Brave Swap Asset Registry
 *
 * The asset registry is a static list of tokens available for Swap
 * via the 0x Swap API. We filter out tokens whose EIP55-formatted
 * contract address isn't listed in the eth-contract-metadata package.
 *
 * The registry is intentionally static to prevent MITM attacks.
 *
 * Update instructions:
 * 1. Obtain the latest list of tokens from the 0x Swap API:
 *    GET https://api.0x.org/swap/v1/tokens
 *
 * 2. Replace the "records" key of the response in the swapTokens0x
 *    variable.
 *
 * 3. Update the timestamp below.
 *
 *
 * Last updated on: 17 May 2021 09:18:50
 * */

const swapTokens0x = [
  {
    symbol: 'ETH',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    name: 'Ether',
    decimals: 18,
  },
  {
    symbol: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    name: 'Wrapped Ether',
    decimals: 18,
  },
  {
    symbol: 'ZRX',
    address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    name: '0x Protocol Token',
    decimals: 18,
  },
  {
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether USD',
    decimals: 6,
  },
  {
    symbol: 'WBTC',
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    name: 'Wrapped BTC',
    decimals: 8,
  },
  {
    symbol: 'UNI',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    name: 'Uniswap Protocol Governance Token',
    decimals: 18,
  },
  {
    symbol: 'MKR',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    name: 'Maker',
    decimals: 18,
  },
  {
    symbol: 'SNX',
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    name: 'Synthetix Network Token',
    decimals: 18,
  },
  {
    symbol: 'LINK',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    name: 'Chainlink Token',
    decimals: 18,
  },
  {
    symbol: 'SUSD',
    address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    name: 'sUSD',
    decimals: 18,
  },
  {
    symbol: 'TUSD',
    address: '0x0000000000085d4780b73119b644ae5ecd22b376',
    name: 'TrueUSD',
    decimals: 18,
  },
  {
    symbol: 'SUSHI',
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    name: 'Sushi',
    decimals: 18,
  },
  {
    symbol: 'AAVE',
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    name: 'Aave',
    decimals: 18,
  },
  {
    symbol: 'YFI',
    address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    name: 'yearn.finance',
    decimals: 18,
  },
  {
    symbol: 'BAT',
    address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    name: 'Basic Attention Token',
    decimals: 18,
  },
  {
    symbol: 'KNC',
    address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    name: 'Kyber Network Crystal',
    decimals: 18,
  },
  {
    symbol: 'BNT',
    address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    name: 'Bancor Network Token',
    decimals: 18,
  },
  {
    symbol: 'BAL',
    address: '0xba100000625a3754423978a60c9317c58a424e3d',
    name: 'Balancer',
    decimals: 18,
  },
  {
    symbol: 'COMP',
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    name: 'Compound',
    decimals: 18,
  },
  {
    symbol: 'GNO',
    address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
    name: 'Gnosis Token',
    decimals: 18,
  },
  {
    symbol: 'REN',
    address: '0x408e41876cccdc0f92210600ef50372656052a38',
    name: 'Republic Protocol',
    decimals: 18,
  },
  {
    symbol: 'GNT',
    address: '0xa74476443119a942de498590fe1f2454d7d4ac0d',
    name: 'Golem Network Token',
    decimals: 18,
  },
  {
    symbol: 'OMG',
    address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
    name: 'OmiseGO',
    decimals: 18,
  },
  {
    symbol: 'ANT',
    address: '0x960b236a07cf122663c4303350609a66a7b288c0',
    name: 'Aragon Network Token',
    decimals: 18,
  },
  {
    symbol: 'SAI',
    address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    name: 'Sai Stablecoin v1.0',
    decimals: 18,
  },
  {
    symbol: 'CVL',
    address: '0x01fa555c97d7958fa6f771f3bbd5ccd508f81e22',
    name: 'Civil Token',
    decimals: 18,
  },
  {
    symbol: 'DTH',
    address: '0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190',
    name: 'Dether',
    decimals: 18,
  },
  {
    symbol: 'FOAM',
    address: '0x4946fcea7c692606e8908002e55a582af44ac121',
    name: 'FOAM',
    decimals: 18,
  },
  {
    symbol: 'AST',
    address: '0x27054b13b1b798b345b591a4d22e6562d47ea75a',
    name: 'AirSwap Token',
    decimals: 4,
  },
  {
    symbol: 'AION',
    address: '0x4ceda7906a5ed2179785cd3a40a69ee8bc99c466',
    name: 'Aion Network',
    decimals: 8,
  },
  {
    symbol: 'GEN',
    address: '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
    name: 'DAOstack',
    decimals: 18,
  },
  {
    symbol: 'STORJ',
    address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
    name: 'Storj',
    decimals: 8,
  },
  {
    symbol: 'MANA',
    address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    name: 'Decentraland',
    decimals: 18,
  },
  {
    symbol: 'ENTRP',
    address: '0x5bc7e5f0ab8b2e10d2d0a3f21739fce62459aef3',
    name: 'Hut34 Entropy Token',
    decimals: 18,
  },
  {
    symbol: 'MLN',
    address: '0xbeb9ef514a379b997e0798fdcc901ee474b6d9a1',
    name: 'Melon',
    decimals: 18,
  },
  {
    symbol: 'LOOM',
    address: '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
    name: 'Loom Network Token',
    decimals: 18,
  },
  {
    symbol: 'CELR',
    address: '0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
    name: 'Celer Network Token',
    decimals: 18,
  },
  {
    symbol: 'RLC',
    address: '0x607f4c5bb672230e8672085532f7e901544a7375',
    name: 'iExec RLC Token',
    decimals: 9,
  },
  {
    symbol: 'ICN',
    address: '0x888666ca69e0f178ded6d75b5726cee99a87d698',
    name: 'ICONOMI',
    decimals: 18,
  },
  {
    symbol: 'DGD',
    address: '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
    name: 'Digix',
    decimals: 9,
  },
  {
    symbol: 'ZIL',
    address: '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
    name: 'Zilliqa',
    decimals: 12,
  },
  {
    symbol: 'cBAT',
    address: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
    name: 'Compound Basic Attention Token',
    decimals: 8,
  },
  {
    symbol: 'cDAI',
    address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    name: 'Compound Dai',
    decimals: 8,
  },
  {
    symbol: 'cSAI',
    address: '0xf5dce57282a584d2746faf1593d3121fcac444dc',
    name: 'Compound Sai (Legacy Dai)',
    decimals: 8,
  },
  {
    symbol: 'cETH',
    address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
    name: 'Compound Ether',
    decimals: 8,
  },
  {
    symbol: 'cREP',
    address: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
    name: 'Compound Augur',
    decimals: 8,
  },
  {
    symbol: 'cUSDC',
    address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
    name: 'Compound USD Coin',
    decimals: 8,
  },
  {
    symbol: 'cZRX',
    address: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
    name: 'Compound 0x',
    decimals: 8,
  },
  {
    symbol: '0xBTC',
    address: '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',
    name: '0xBitcoin Token',
    decimals: 8,
  },
  {
    symbol: 'SNT',
    address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
    name: 'Status Network Token',
    decimals: 18,
  },
  {
    symbol: 'SPANK',
    address: '0x42d6622dece394b54999fbd73d108123806f6a18',
    name: 'SPANK',
    decimals: 18,
  },
  {
    symbol: 'BOOTY',
    address: '0x6b01c3170ae1efebee1a3159172cb3f7a5ecf9e5',
    name: 'BOOTY',
    decimals: 18,
  },
  {
    symbol: 'UBT',
    address: '0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e',
    name: 'UniBright',
    decimals: 8,
  },
  {
    symbol: 'NMR',
    address: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
    name: 'Numeraire',
    decimals: 18,
  },
  {
    symbol: 'GUSD',
    address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
    name: 'Gemini Dollar',
    decimals: 2,
  },
  {
    symbol: 'FUN',
    address: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
    name: 'FunFair',
    decimals: 8,
  },
  {
    symbol: 'PAX',
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    name: 'PAX Stablecoin',
    decimals: 18,
  },
  {
    symbol: 'LPT',
    address: '0x58b6a8a3302369daec383334672404ee733ab239',
    name: 'Livepeer',
    decimals: 18,
  },
  {
    symbol: 'ENJ',
    address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    name: 'EnjinCoin',
    decimals: 18,
  },
  {
    symbol: 'POWR',
    address: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
    name: 'PowerLedger',
    decimals: 6,
  },
  {
    symbol: 'REQ',
    address: '0x8f8221afbb33998d8584a2b05749ba73c37a938a',
    name: 'Request',
    decimals: 18,
  },
  {
    symbol: 'DNT',
    address: '0x0abdace70d3790235af448c88547603b945604ea',
    name: 'district0x',
    decimals: 18,
  },
  {
    symbol: 'MATIC',
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    name: 'Matic Network Token',
    decimals: 18,
  },
  {
    symbol: 'LRC',
    address: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
    name: 'Loopring',
    decimals: 18,
  },
  {
    symbol: 'RDN',
    address: '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
    name: 'Raiden Network Token',
    decimals: 18,
  },
  {
    symbol: 'GST2',
    address: '0x0000000000b3f879cb30fe243b4dfee438691c04',
    name: 'Gas Token 2',
    decimals: 2,
  },
  {
    symbol: 'UMA',
    address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
    name: 'Universal Market Access',
    decimals: 18,
  },
  {
    symbol: 'BZRX',
    address: '0x56d811088235f11c8920698a204a5010a788f4b3',
    name: 'bZx Protocol Token',
    decimals: 18,
  },
  {
    symbol: 'renBTC',
    address: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
    name: 'renBTC',
    decimals: 8,
  },
  {
    symbol: 'LEND',
    address: '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
    name: 'Aave',
    decimals: 18,
  },
  {
    symbol: 'AMPL',
    address: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    name: 'Ampleforth',
    decimals: 9,
  },
  {
    symbol: 'KEEP',
    address: '0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
    name: 'Keep',
    decimals: 18,
  },
  {
    symbol: 'mUSD',
    address: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
    name: 'mStable USD',
    decimals: 18,
  },
  {
    symbol: 'bUSD',
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    name: 'Binance USD',
    decimals: 18,
  },
  {
    symbol: 'CRV',
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    name: 'Curve DAO Token',
    decimals: 18,
  },
  {
    symbol: 'swUSD',
    address: '0x77C6E4a580c0dCE4E5c7a17d0bc077188a83A059',
    name: 'Swerve.fi swUSD',
    decimals: 18,
  },
  {
    symbol: 'SWRV',
    address: '0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433',
    name: 'Swerve DAO Token',
    decimals: 18,
  },
  {
    symbol: 'sBTC',
    address: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
    name: 'Synth sBTC',
    decimals: 18,
  },
  {
    symbol: 'yUSD',
    address: '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c',
    name: 'yearn Curve.fi yDAI/yUSDC/yUSDT/yTUSD',
    decimals: 18,
  },
  {
    symbol: 'ybCRV',
    address: '0x2994529c0652d127b7842094103715ec5299bbed',
    name: 'yearn Curve.fi yDAI/yUSDC/yUSDT/yBUSD',
    decimals: 18,
  },
  {
    symbol: 'yUSDC',
    address: '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e',
    name: 'yearn USDC',
    decimals: 18,
  },
  {
    symbol: 'yDAI',
    address: '0xacd43e627e64355f1861cec6d3a6688b31a6f952',
    name: 'yearn DAI',
    decimals: 18,
  },
  {
    symbol: 'yUSDT',
    address: '0x2f08119c6f07c006695e079aafc638b8789faf18',
    name: 'yearn USDT',
    decimals: 18,
  },
  {
    symbol: 'yTUSD',
    address: '0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a',
    name: 'yearn TUSD',
    decimals: 18,
  },
  {
    symbol: 'AKRO',
    address: '0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7',
    name: 'Akropolis',
    decimals: 18,
  },
  {
    symbol: 'AUDIO',
    address: '0x18aaa7115705e8be94bffebde57af9bfc265b998',
    name: 'Audius',
    decimals: 18,
  },
  {
    symbol: 'BAND',
    address: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
    name: 'Band Protocol',
    decimals: 18,
  },
  {
    symbol: 'BASED',
    address: '0x68a118ef45063051eac49c7e647ce5ace48a68a5',
    name: 'Based Money',
    decimals: 18,
  },
  {
    symbol: 'BUSD',
    address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    name: 'Binance USD',
    decimals: 18,
  },
  {
    symbol: 'CREAM',
    address: '0x2ba592f78db6436527729929aaf6c908497cb200',
    name: 'Cream',
    decimals: 18,
  },
  {
    symbol: 'DONUT',
    address: '0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9',
    name: 'Donut',
    decimals: 18,
  },
  {
    symbol: 'MTA',
    address: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    name: 'Meta',
    decimals: 18,
  },
  {
    symbol: 'mUSD',
    address: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
    name: 'mStable USD',
    decimals: 18,
  },
  {
    symbol: 'PAXG',
    address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
    name: 'PAX Gold',
    decimals: 18,
  },
  {
    symbol: 'PICKLE',
    address: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
    name: 'Pickle Finance',
    decimals: 18,
  },
  {
    symbol: 'RENZEC',
    address: '0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2',
    name: 'renZEC',
    decimals: 8,
  },
  {
    symbol: 'REP',
    address: '0x221657776846890989a759ba2973e427dff5c9bb',
    name: 'Augur',
    decimals: 18,
  },
  {
    symbol: 'SETH',
    address: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
    name: 'sETH',
    decimals: 18,
  },
  {
    symbol: 'STAKE',
    address: '0x0ae055097c6d159879521c384f1d2123d1f195e6',
    name: 'xDAI Stake',
    decimals: 18,
  },
  {
    symbol: 'TBTC',
    address: '0x8daebade922df735c38c80c7ebd708af50815faa',
    name: 'tBTC',
    decimals: 18,
  },
  {
    symbol: '1INCH',
    address: '0x111111111117dc0aa78b770fa6a738034120c302',
    name: '1INCH',
    decimals: 18,
  },
]

export const assets = swapTokens0x
  .map((asset) => ({
    ...asset,
    address: asset.symbol === 'ETH' ? '' : ethUtil.toChecksumAddress(asset.address),
  }))
  .filter(({ symbol, address }) => symbol === 'ETH' || address in contractMap)
