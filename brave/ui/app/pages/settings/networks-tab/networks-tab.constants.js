import { defaultNetworksData } from '../../../../../../ui/app/pages/settings/networks-tab/networks-tab.constants'

defaultNetworksData.map((net, ix) => {
  defaultNetworksData[ix] = {
    ...net,
    rpcUrl: `${net.providerType}.infura.io/v3`,
  }
})

export {
  defaultNetworksData,
}
