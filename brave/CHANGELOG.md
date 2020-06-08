# Changelog


## Remote Component([0.1.54](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.54)), Browser Component: `1.0.19`(03-June-2020)
- [brave-browser#9754](https://github.com/brave/brave-browser/issues/9754): Implemented proxy cache for ETH phishing blacklist
- [brave-browser#8925](https://github.com/brave/brave-browser/issues/8925): Fixed background polling of sites when component is not loaded 

## Remote Component([0.1.52](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.52)), Browser Component: `1.0.18`(14-May-2020)
- [brave-browser#9757](https://github.com/brave/brave-browser/issues/9757): Implemented lazy install and loading of Crypto Wallet component
- [brave-browser#8470](https://github.com/brave/brave-browser/issues/8470): Fix decompress module to resolve security audit warning


## Remote Component([0.1.51](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.51)), Browser Component: `1.0.17`(6-Mar-2020)
- [brave-browser#8530](https://github.com/brave/brave-browser/issues/8530): Fix incorrect ledger account for transaction signing
- [brave-browser#8438](https://github.com/brave/brave-browser/issues/8438): Fix muntiple scroll bars on wallet page
- [brave-browser#8223](https://github.com/brave/brave-browser/issues/8223): Fix `eth_signTypedData` button rendering on confirmation page
- [brave-browser#8085](https://github.com/brave/brave-browser/issues/8085): Fix dark theme issues
- [brave-browser#7141](https://github.com/brave/brave-browser/issues/7141): Fix wallet popup to be more responsive  
- [#8162](https://github.com/MetaMask/metamask-extension/pull/8162): Remove invalid Ledger accounts
- [#8162](https://github.com/MetaMask/metamask-extension/pull/8163): Fix account index check
- [#8154](https://github.com/MetaMask/metamask-extension/pull/8154): Prevent signing from incorrect Ledger account
- [#8053](https://github.com/MetaMask/metamask-extension/pull/8053): Inline the source text not the binary encoding for inpage script
- [#8049](https://github.com/MetaMask/metamask-extension/pull/8049): Add warning to watchAsset API when editing a known token
- [#8051](https://github.com/MetaMask/metamask-extension/pull/8051): Update Wyre ETH purchase url
- [#8059](https://github.com/MetaMask/metamask-extension/pull/8059): Attempt ENS resolution on any valid domain name

## Remote Component([0.1.44](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.44)), Browser Component: `1.0.16`(12-Feb-2020)
- [brave-browser#7537](https://github.com/brave/brave-browser/issues/7537): Fix `Restore account? Import using account seed phrase`  
- [brave-browser#7882](https://github.com/brave/brave-browser/issues/7882): Fix connect to wallet popup to be more responsive to browser size
- [brave-browser#7045](https://github.com/brave/brave-browser/issues/7045): Fix wallet backup screen to be responsive to browser size
- [brave-browser#6539](https://github.com/brave/brave-browser/issues/6539): Fix untranslated text on connect hardware screen
- [brave-browser#7791](https://github.com/brave/brave-browser/issues/7791): Removed "Choose a type to set up" from brave://wallet 
- [brave-browser#7695](https://github.com/brave/brave-browser/issues/7695): Replace MM support link on `Learn more on connect wallet` popup with Brave support page
- [brave-browser#8177](https://github.com/brave/brave-browser/issues/8177): Replace MM support link on `Learn More on Add tokens screen points` with Brave support page
- [brave-browser#8204](https://github.com/brave/brave-browser/issues/8204): Replace MM support link on `Learn more about imported accounts` with Brave support page	

## Remote Component([0.1.32](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.32)), Browser Component: `1.0.15`(10-Jan-2020)

- [brave-browser#7408](https://github.com/brave/brave-browser/issues/7408): Upgrade base MetaMask from 7.0.1 to 7.7.0
- [brave-browser#6535](https://github.com/brave/brave-browser/issues/6535): Deposit transactions are not listed
- [#7004](https://github.com/MetaMask/metamask-extension/pull/7004): Connect distinct accounts per site
- [#7480](https://github.com/MetaMask/metamask-extension/pull/7480): Fixed link on root README.md
- [#7482](https://github.com/MetaMask/metamask-extension/pull/7482): Update Wyre ETH purchase url
- [#7484](https://github.com/MetaMask/metamask-extension/pull/7484): Ensure transactions are shown in the order they are received
- [#7491](https://github.com/MetaMask/metamask-extension/pull/7491): Update gas when token is changed on the send screen
- [#7501](https://github.com/MetaMask/metamask-extension/pull/7501): Fix accessibility of first-time-flow terms checkboxes
- [#7502](https://github.com/MetaMask/metamask-extension/pull/7502): Fix chainId for non standard networks
- [#7579](https://github.com/MetaMask/metamask-extension/pull/7579): Fix timing of DAI migration notifications after dismissal
- [#7519](https://github.com/MetaMask/metamask-extension/pull/7519): Fixing hardware connect error display
- [#7558](https://github.com/MetaMask/metamask-extension/pull/7558): Use localized messages for NotificationModal buttons
- [#7488](https://github.com/MetaMask/metamask-extension/pull/7488): Fix text overlap when expanding transaction
- [#7475](https://github.com/MetaMask/metamask-extension/pull/7475): Add 'Remind Me Later' to the Maker notification
- [#7436](https://github.com/MetaMask/metamask-extension/pull/7436): Add additional rpcUrl verification
- [#7468](https://github.com/MetaMask/metamask-extension/pull/7468): Show transaction fee units on approve screen
- [#7450](https://github.com/MetaMask/metamask-extension/pull/7450): Add migration notification for users with non-zero Sai
- [#7461](https://github.com/MetaMask/metamask-extension/pull/7461): Import styles for showing multiple notifications
- [#7451](https://github.com/MetaMask/metamask-extension/pull/7451): Add button disabled when password is empty
- [#7412](https://github.com/MetaMask/metamask-extension/pull/7412): lock eth-contract-metadata (#7412)
- [#7416](https://github.com/MetaMask/metamask-extension/pull/7416): Add eslint import plugin to help detect unresolved paths
- [#7414](https://github.com/MetaMask/metamask-extension/pull/7414): Ensure SignatureRequestOriginal 'beforeunload' handler is bound (#7414)
- [#7430](https://github.com/MetaMask/metamask-extension/pull/7430): Update badge colour
- [#7408](https://github.com/MetaMask/metamask-extension/pull/7408): Utilize the full size of icon space (#7408)
- [#7431](https://github.com/MetaMask/metamask-extension/pull/7431): Add all icons to manifest (#7431)
- [#7426](https://github.com/MetaMask/metamask-extension/pull/7426): Ensure Etherscan result is valid before reading it (#7426)
- [#7434](https://github.com/MetaMask/metamask-extension/pull/7434): Update 512px icon (#7434)
- [#7410](https://github.com/MetaMask/metamask-extension/pull/7410): Fix sourcemaps for Sentry
- [#7420](https://github.com/MetaMask/metamask-extension/pull/7420): Adds and end to end test for typed signature requests
- [#7439](https://github.com/MetaMask/metamask-extension/pull/7439): Add metricsEvent to contextTypes (#7439)
- [#7419](https://github.com/MetaMask/metamask-extension/pull/7419): Added webRequest.RequestFilter to filter main_frame .eth requests (#7419)
- [#7414](https://github.com/MetaMask/metamask-extension/pull/7414): Ensure SignatureRequestOriginal 'beforeunload' handler is bound
- [#7402](https://github.com/MetaMask/metamask-extension/pull/7402): Fix regression for signed types data screens
- [#7390](https://github.com/MetaMask/metamask-extension/pull/7390): Update json-rpc-engine
- [#7401](https://github.com/MetaMask/metamask-extension/pull/7401): Reject connection request on window close
- [#7328](https://github.com/MetaMask/metamask-extension/pull/7328): ignore known transactions on first broadcast and continue with normal flow
- [#7327](https://github.com/MetaMask/metamask-extension/pull/7327): eth_getTransactionByHash will now check metamask's local history for pending transactions
- [#7333](https://github.com/MetaMask/metamask-extension/pull/7333): Cleanup beforeunload handler after transaction is resolved
- [#7038](https://github.com/MetaMask/metamask-extension/pull/7038): Add support for ZeroNet
- [#7334](https://github.com/MetaMask/metamask-extension/pull/7334): Add web3 deprecation warning
- [#6924](https://github.com/MetaMask/metamask-extension/pull/6924): Add Estimated time to pending tx
- [#7177](https://github.com/MetaMask/metamask-extension/pull/7177): ENS Reverse Resolution support
- [#6891](https://github.com/MetaMask/metamask-extension/pull/6891): New signature request v3 UI
- [#7348](https://github.com/MetaMask/metamask-extension/pull/7348): fix width in first time flow button
- [#7271](https://github.com/MetaMask/metamask-extension/pull/7271): Redesign approve screen
- [#7354](https://github.com/MetaMask/metamask-extension/pull/7354): fix account menu width
- [#7379](https://github.com/MetaMask/metamask-extension/pull/7379): Set default advanced tab gas limit
- [#7380](https://github.com/MetaMask/metamask-extension/pull/7380): Fix advanced tab gas chart
- [#7374](https://github.com/MetaMask/metamask-extension/pull/7374): Hide accounts dropdown scrollbars on Firefox
- [#7357](https://github.com/MetaMask/metamask-extension/pull/7357): Update to gaba@1.8.0
- [#7335](https://github.com/MetaMask/metamask-extension/pull/7335): Add onbeforeunload and have it call onCancel
- [#7186](https://github.com/MetaMask/metamask-extension/pull/7186): Use `AdvancedGasInputs` in `AdvancedTabContent`
- [#7304](https://github.com/MetaMask/metamask-extension/pull/7304): Move signTypedData signing out to keyrings
- [#7306](https://github.com/MetaMask/metamask-extension/pull/7306): correct the zh-TW translation
- [#7309](https://github.com/MetaMask/metamask-extension/pull/7309): Freeze Promise global on boot
- [#7296](https://github.com/MetaMask/metamask-extension/pull/7296): Add "Retry" option for failed transactions
- [#7319](https://github.com/MetaMask/metamask-extension/pull/7319): Fix transaction list item status spacing issue
- [#7218](https://github.com/MetaMask/metamask-extension/pull/7218): Add hostname and extensionId to site metadata
- [#7324](https://github.com/MetaMask/metamask-extension/pull/7324): Fix contact deletion
- [#7326](https://github.com/MetaMask/metamask-extension/pull/7326): Fix edit contact details
- [#7325](https://github.com/MetaMask/metamask-extension/pull/7325): Update eth-json-rpc-filters to fix memory leak
- [#7334](https://github.com/MetaMask/metamask-extension/pull/7334): Add web3 deprecation warning
- [#7298](https://github.com/MetaMask/metamask-extension/pull/7298): Turn off full screen vs popup a/b test
- [#6972](https://github.com/MetaMask/metamask-extension/pull/6972): 3box integration
- [#7168](https://github.com/MetaMask/metamask-extension/pull/7168): Add fixes for German translations
- [#7170](https://github.com/MetaMask/metamask-extension/pull/7170): Remove the disk store
- [#7176](https://github.com/MetaMask/metamask-extension/pull/7176): Performance: Delivery optimized images
- [#7189](https://github.com/MetaMask/metamask-extension/pull/7189): add goerli to incoming tx
- [#7190](https://github.com/MetaMask/metamask-extension/pull/7190): Remove unused locale messages
- [#7173](https://github.com/MetaMask/metamask-extension/pull/7173): Fix RPC error messages
- [#7205](https://github.com/MetaMask/metamask-extension/pull/7205): address book entries by chainId
- [#7207](https://github.com/MetaMask/metamask-extension/pull/7207): obs-store/local-store should upgrade webextension error to real error
- [#7162](https://github.com/MetaMask/metamask-extension/pull/7162): Add a/b test for full screen transaction confirmations
- [#7089](https://github.com/MetaMask/metamask-extension/pull/7089): Add advanced setting to enable editing nonce on confirmation screens
- [#7239](https://github.com/MetaMask/metamask-extension/pull/7239): Update ETH logo, update deposit Ether logo height and width
- [#7255](https://github.com/MetaMask/metamask-extension/pull/7255): Use translated string for state log
- [#7266](https://github.com/MetaMask/metamask-extension/pull/7266): fix issue of xyz ens not resolving
- [#7253](https://github.com/MetaMask/metamask-extension/pull/7253): Prevent Logout Timer that's longer than a week.
- [#7285](https://github.com/MetaMask/metamask-extension/pull/7285): Lessen the length of ENS validation to 3
- [#7287](https://github.com/MetaMask/metamask-extension/pull/7287): Fix phishing detect script
- [#7252](https://github.com/MetaMask/metamask-extension/pull/7252): Fix gas limit when sending tx without data to a contract
- [#7260](https://github.com/MetaMask/metamask-extension/pull/7260): Do not transate on seed phrases
- [#7252](https://github.com/MetaMask/metamask-extension/pull/7252): Ensure correct tx category when sending to contracts without tx data
- [#7213](https://github.com/MetaMask/metamask-extension/pull/7213): Update minimum Firefox verison to 56.0
- [#7180](https://github.com/MetaMask/metamask-extension/pull/7180): Add `appName` message to each locale
- [#7099](https://github.com/MetaMask/metamask-extension/pull/7099): Update localization from Transifex Brave
- [#7137](https://github.com/MetaMask/metamask-extension/pull/7137): Fix validation of empty block explorer url's in custom network form
- [#7128](https://github.com/MetaMask/metamask-extension/pull/7128): Support for eth_signTypedData_v4
- [#7110](https://github.com/MetaMask/metamask-extension/pull/7110): Adds `chaindIdChanged` event to the ethereum provider
- [#7091](https://github.com/MetaMask/metamask-extension/pull/7091): Improve browser performance issues caused by missing locale errors
- [#7085](https://github.com/MetaMask/metamask-extension/pull/7085): Prevent ineffectual speed ups of pending transactions that don't have the lowest nonce
- [#7156](https://github.com/MetaMask/metamask-extension/pull/7156): Set minimum Firefox version to v56.2 to support Waterfox
- [#7157](https://github.com/MetaMask/metamask-extension/pull/7157): Add polyfill for AbortController
- [#7161](https://github.com/MetaMask/metamask-extension/pull/7161): Replace `undefined` selectedAddress with `null`
- [#7171](https://github.com/MetaMask/metamask-extension/pull/7171): Fix recipient field of approve screen
- [#7059](https://github.com/MetaMask/metamask-extension/pull/7059): Remove blockscale, replace with ethgasstation
- [#7037](https://github.com/MetaMask/metamask-extension/pull/7037): Remove Babel 6 from internal dependencies
- [#7093](https://github.com/MetaMask/metamask-extension/pull/7093): Allow dismissing privacy mode notification from popup
- [#7087](https://github.com/MetaMask/metamask-extension/pull/7087): Add breadcrumb spacing on Contacts page
- [#7081](https://github.com/MetaMask/metamask-extension/pull/7081): Fix confirm token transaction amount display
- [#7088](https://github.com/MetaMask/metamask-extension/pull/7088): Fix BigNumber conversion error
- [#7072](https://github.com/MetaMask/metamask-extension/pull/7072): Right-to-left CSS (using module for conversion)
- [#6878](https://github.com/MetaMask/metamask-extension/pull/6878): Persian translation
- [#7012](https://github.com/MetaMask/metamask-extension/pull/7012): Added missed phrases to RU locale
- [#7035](https://github.com/MetaMask/metamask-extension/pull/7035): Filter non-ERC-20 assets during mobile sync (#7035)
- [#7021](https://github.com/MetaMask/metamask-extension/pull/7021): Using translated string for end of flow messaging (#7021)
- [#7018](https://github.com/MetaMask/metamask-extension/pull/7018): Rename Contacts List settings tab to Contacts (#7018)
- [#7013](https://github.com/MetaMask/metamask-extension/pull/7013): Connections settings tab (#7013)
- [#6996](https://github.com/MetaMask/metamask-extension/pull/6996): Fetch & display received transactions (#6996)
- [#6991](https://github.com/MetaMask/metamask-extension/pull/6991): Remove reload from Share Address button (#6991)
- [#6978](https://github.com/MetaMask/metamask-extension/pull/6978): Address book fixes (#6978)
- [#6944](https://github.com/MetaMask/metamask-extension/pull/6944): Show recipient alias in confirm header if exists (#6944)
- [#6930](https://github.com/MetaMask/metamask-extension/pull/6930): Add support for eth_signTypedData_v4 (#6930)
- [#7046](https://github.com/MetaMask/metamask-extension/pull/7046): Update Italian translation (#7046)
- [#7047](https://github.com/MetaMask/metamask-extension/pull/7047): Add warning about reload on network change
- [#6975](https://github.com/MetaMask/metamask-extension/pull/6975): Ensure seed phrase backup notification only shows up for new users

## Remote Component([0.1.30](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.30)), Browser Component: `1.0.14` (11-Dec-2019)
- [brave-browser#64422](https://github.com/brave/brave-browser/issues/6442): Fixed login issues into wallet

## Remote Component([0.1.29](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.29)), Browser Component: `1.0.13` (21-Nov-2019)
- [brave-browser#7032](https://github.com/brave/brave-browser/issues/7032): Fix Crypto Wallets proxy caching
- [brave-browser#6824](https://github.com/brave/brave-browser/issues/6824): Crypto Wallets add tokens to account button hidden in side-bar 
- [brave-browser#6534](https://github.com/brave/brave-browser/issues/6534): Remove/Replace MetaFox icon from connect wallet popup
- [brave-browser#6528](https://github.com/brave/brave-browser/issues/6528): Fix brave wallet scroll when more tokens are added

## Remote Component([0.1.18](https://github.com/brave/ethereum-remote-client/releases/tag/v0.1.18)), Browser Component: `1.0.12` (01-Nov-2019)
- [brave-browser#6614](https://github.com/brave/brave-browser/issues/6614): Infura interactions should be behind fastly proxy cache

## Remote Component([0.1.17](https://github.com/brave/ethereum-remote-client/releases/tag/v0.1.17)), Browser Component: `1.0.11` (18-Oct-2019)
- [brave-browser#6485](https://github.com/brave/brave-browser/issues/6485): Fix disclosure message landing page link
- [brave-browser#6038](https://github.com/brave/brave-browser/issues/6038): Removed Metamask icons in connect hardware screen

## Remote Component([0.1.16](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.16)), Browser Component: `1.0.10` (09-Oct-2019)
- [brave-browser#5698](https://github.com/brave/brave-browser/issues/5698): Added support for restoring Metamask wallet into Crypto Wallet
- [brave-browser#6281](https://github.com/brave/brave-browser/issues/6281): Rename save state logs download file name to use Brave
- [brave-browser#6161](https://github.com/brave/brave-browser/issues/6161): Remove "Cancel" & "Save" buttons for ETH networks that have already been created and can't be edited
- [brave-browser#6210](https://github.com/brave/brave-browser/issues/6210): Fix misspelled words on setup page
