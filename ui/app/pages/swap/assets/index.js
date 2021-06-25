import mainnetAssets from './assets.mainnet.json'
import ropstenAssets from './assets.ropsten.json'
import { MAINNET, ROPSTEN } from '../../../../../app/scripts/controllers/network/enums'

const assets = {
  [MAINNET]: mainnetAssets,
  [ROPSTEN]: ropstenAssets,
}

export default assets
