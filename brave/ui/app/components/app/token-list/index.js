import BraveTokenListContainer from './token-list.container'
// export { default } from... doesn't work because in
// ui/app/components/app/wallet-view.js this file is require()d
// and so we can't use the ES modules format
module.exports = BraveTokenListContainer
