import { createSelector } from 'reselect'

export const getAllWallets = (state) => state.metamask.bitgoWallets
export const getAllBalances = (state) => state.brave.bitGoBalances
export const getAllTransfers = (state) => state.brave.bitGoTransfers

export const getWallet = (id) => (state) => getAllWallets(state)[id]
export const getBalance = (id) => (state) => getAllBalances(state)[id]
export const getTransfers = (id) => (state) => {
  const transfers = getAllTransfers(state)
  return (transfers[id] && transfers[id].transfers) || []
}

export const getWalletInfo = (id) => createSelector(
  getWallet(id),
  getBalance(id),
  getTransfers(id),
  (wallet, balance, transfers) => ({
    wallet,
    balance,
    transfers,
  }),
)
