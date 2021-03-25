# Changelog

## Remote Component([0.1.89](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.89)), Browser Component: `1.0.28`(25-Mar-2021)

 - [brave-browser#14701](https://github.com/brave/brave-browser/issues/14701) - Added the ability to buy Crypto using Wyre
 - [brave-browser#14566](https://github.com/brave/brave-browser/issues/14566) - Fixed missing deposit transactions from activity list 
 - [brave-browser#14565](https://github.com/brave/brave-browser/issues/14565) - Fixed missing Test faucet option from deposit Ether page
 - [brave-browser#13689](https://github.com/brave/brave-browser/issues/13689) - Moved Crypto Wallet's IPFS setting into browser IPFS setting 

## Remote Component([0.1.88](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.88)), Browser Component: `1.0.27`(08-Mar-2021)

 - [brave-browser#14349](https://github.com/brave/brave-browser/issues/14349) - Added support for "Crypto Name Service" (CNS) from Unstoppable Domains
 - [brave-browser#13245](https://github.com/brave/brave-browser/issues/13245) - Changed key derivation method to use 12-word BIP39 format similar to MetaMask

## Remote Component([0.1.87](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.87)), Browser Component: `1.0.26`(12-Feb-2021)

 - [brave-browser#14070](https://github.com/brave/brave-browser/issues/14070) - Fixed wallet extension description from appearing as "MSG_appDescription"
 - [brave-browser#14004](https://github.com/brave/brave-browser/issues/14004) - Fixed text visibility for custom network warning in dark theme
 - [brave-browser#13777](https://github.com/brave/brave-browser/issues/13777) - Fixed Ethereum JSON RPC API calls for token list  

## Remote Component([0.1.85](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.85)), Browser Component: `1.0.25`(26-Jan-2021)


- [brave-browser#12959](https://github.com/brave/brave-browser/issues/12959) - Implemented warning message when a user tries to send a token to its own contract address
- [brave-browser#13296](https://github.com/brave/brave-browser/issues/13296) - Updated phishing detection for missing links from Phishfort 
- [brave-browser#6298](https://github.com/brave/brave-browser/issues/6298) - Fixed missing translation on backup phrase page 
- [brave-browser#13438](https://github.com/brave/brave-browser/issues/13438)  - Fixed high memory usage for Crypto Wallets once wallet is created 
- [brave-browser#13642](https://github.com/brave/brave-browser/issues/13642) - Updated Crypto Wallets icon 

## Remote Component([0.1.81](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.81)), Browser Component: `1.0.24`(26-Nov-2020)

- [brave-browser#11696](https://github.com/brave/brave-browser/issues/11696) - Added in-browser-action UI to inform when Crypto Wallet is not the default web3 provider
- [brave-browser#8281](https://github.com/brave/brave-browser/issues/8281) - Fixed "Failed to parse SourceMap" warning when devtools is opened
- [brave-browser#12654](https://github.com/brave/brave-browser/issues/12654) - Fixed missing password disclaimer message from "Create account" screen
- [brave-browser#12622](https://github.com/brave/brave-browser/issues/12622) - Fixed login issues when onboarding is not complete by closing backup passphrase screen

## Remote Component([0.1.80](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.80)), Browser Component: `1.0.23`(28-Oct-2020)

- [brave-browser#12269](https://github.com/brave/brave-browser/issues/12269) - Updated Deposit Ether page 
- [brave-browser#11941](https://github.com/brave/brave-browser/issues/11941) - Fixed transaction confirmation for certain sign data types
- [brave-browser#11764](https://github.com/brave/brave-browser/issues/11764) - Fixed permission request on a locked connection window

## Remote Component([0.1.76](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.76)), Browser Component: `1.0.22`(15-Sep-2020)

- [brave-browser#11357](https://github.com/brave/brave-browser/issues/11357): Fixed account listing when wrong password is entered on reveal pass phrase screen
- [brave-browser#11646](https://github.com/brave/brave-browser/issues/11646): Removed MetaMask branding on browser action button
- [brave-browser#11261](https://github.com/brave/brave-browser/issues/11261): Removed "Backup wallet" message on browser action window
- [#9228](https://github.com/MetaMask/metamask-extension/pull/9228): Move transaction confirmation footer buttons to scrollable area
- [#9256](https://github.com/MetaMask/metamask-extension/pull/9256): Handle non-String web3 property access
- [#9266](https://github.com/MetaMask/metamask-extension/pull/9266): Use `@metamask/controllers@2.0.5`
- [#9189](https://github.com/MetaMask/metamask-extension/pull/9189): Hide ETH Gas Station estimates on non-main network
- [#9211](https://github.com/MetaMask/metamask-extension/pull/9211): Fix Etherscan redirect on notification click
- [#9237](https://github.com/MetaMask/metamask-extension/pull/9237): Reduce volume of web3 usage metrics
- [#9227](https://github.com/MetaMask/metamask-extension/pull/9227): Permit all-caps addresses
- [#9065](https://github.com/MetaMask/metamask-extension/pull/9065): Change title of "Reveal Seed Words" page to "Reveal Seed Phrase"
- [#8974](https://github.com/MetaMask/metamask-extension/pull/8974): Add tooltip to copy button for contacts and seed phrase
- [#9063](https://github.com/MetaMask/metamask-extension/pull/9063): Fix broken UI upon failed password validation
- [#9075](https://github.com/MetaMask/metamask-extension/pull/9075): Fix shifted popup notification when browser is in fullscreen on macOS
- [#9085](https://github.com/MetaMask/metamask-extension/pull/9085): Support longer text in network dropdown
- [#8873](https://github.com/MetaMask/metamask-extension/pull/8873): Fix onboarding bug where user can be asked to verify seed phrase twice
- [#9104](https://github.com/MetaMask/metamask-extension/pull/9104): Replace "Email us" button with "Contact us" button
- [#9137](https://github.com/MetaMask/metamask-extension/pull/9137): Fix bug where `accountsChanged` events stop after a dapp connection is closed
- [#9152](https://github.com/MetaMask/metamask-extension/pull/9152): Fix network name alignment
- [#9144](https://github.com/MetaMask/metamask-extension/pull/9144): Add web3 usage metrics and prepare for web3 removal

## Remote Component([0.1.74](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.74)), Browser Component: `1.0.21`(25-Aug-2020)

- [brave-browser#11311](https://github.com/brave/brave-browser/issues/11311): Rebase Crypto Wallet to MetaMask V8
- [brave-browser#7497](https://github.com/brave/brave-browser/issues/7497): Enabled Browser action button when Crypto Wallet is enabled
- [brave-browser#8176](https://github.com/brave/brave-browser/issues/8176): Fixed an issue where logging back in didn't show backup seed phrase message
- [brave-browser#10769](https://github.com/brave/brave-browser/issues/10769): Fix dark theme issue on sign type data connect window
- [brave-browser#10957](https://github.com/brave/brave-browser/issues/10957): Fixed account not being listed after entering an incorrect password for "Reveal seed phrase" screen
- [brave-browser#11367](https://github.com/brave/brave-browser/issues/11367): Fixed an issue where certain sign data type wasn't showing transaction confirmation
- [#9030](https://github.com/MetaMask/metamask-extension/pull/9030): Hide "delete" button when editing contact of wallet account
- [#9031](https://github.com/MetaMask/metamask-extension/pull/9031): Fix crash upon removing contact
- [#9032](https://github.com/MetaMask/metamask-extension/pull/9032): Do not show spend limit for approvals
- [#9046](https://github.com/MetaMask/metamask-extension/pull/9046): Update `@metamask/inpage-provider@6.1.0`
- [#9048](https://github.com/MetaMask/metamask-extension/pull/9048): Skip attempts to resolve 0x contract prefix
- [#9051](https://github.com/MetaMask/metamask-extension/pull/9051): Use `cntent-hash@2.5.2`
- [#9056](https://github.com/MetaMask/metamask-extension/pull/9056): Display at least one significant digit of small non-zero token balances
- [#8942](https://github.com/MetaMask/metamask-extension/pull/8942): Fix display of incoming transactions (#8942)
- [#8998](https://github.com/MetaMask/metamask-extension/pull/8998): Fix `web3_clientVersion` method (#8998)
- [#9003](https://github.com/MetaMask/metamask-extension/pull/9003): `@metamask/inpage-provider@6.0.1` (#9003)
- [#9006](https://github.com/MetaMask/metamask-extension/pull/9006): Hide loading indication after `personal_sign` (#9006)
- [#9011](https://github.com/MetaMask/metamask-extension/pull/9011): Display pending notifications after connect flow (#9011)
- [#9012](https://github.com/MetaMask/metamask-extension/pull/9012): Skip render when home page is closing or redirecting (#9012)
- [#9010](https://github.com/MetaMask/metamask-extension/pull/9010): Limit number of transactions passed outside of TransactionController (#9010)
- [#9023](https://github.com/MetaMask/metamask-extension/pull/9023): Clear AccountTracker accounts and CachedBalances on createNewVaultAndRestore (#9023)
- [#9025](https://github.com/MetaMask/metamask-extension/pull/9025): Catch gas estimate errors (#9025)
- [#9026](https://github.com/MetaMask/metamask-extension/pull/9026): Clear transactions on createNewVaultAndRestore (#9026)
- [#8934](https://github.com/MetaMask/metamask-extension/pull/8934): Fix transaction activity on custom networks
- [#8936](https://github.com/MetaMask/metamask-extension/pull/8936): Fix account tracker optimization
- [#8921](https://github.com/MetaMask/metamask-extension/pull/8921): Restore missing 'data' provider event, and fix 'notification' event
- [#8923](https://github.com/MetaMask/metamask-extension/pull/8923): Normalize the 'from' parameter for `eth_sendTransaction`
- [#8924](https://github.com/MetaMask/metamask-extension/pull/8924): Fix handling of multiple `eth_requestAccount` messages from the same domain
- [#8917](https://github.com/MetaMask/metamask-extension/pull/8917): Update Italian translations
- [#8907](https://github.com/MetaMask/metamask-extension/pull/8907): Tolerate missing or falsey substitutions
- [#8908](https://github.com/MetaMask/metamask-extension/pull/8908): Fix activity log inline buttons
- [#8909](https://github.com/MetaMask/metamask-extension/pull/8909): Prevent confirming blank suggested token
- [#8910](https://github.com/MetaMask/metamask-extension/pull/8910): Handle suggested token resolved elsewhere
- [#8913](https://github.com/MetaMask/metamask-extension/pull/8913): Fix Kovan chain ID constant
- [#8874](https://github.com/MetaMask/metamask-extension/pull/8874): Fx overflow behaviour of add token list
- [#8885](https://github.com/MetaMask/metamask-extension/pull/8885): Show `origin` in connect flow rather than site name
- [#8883](https://github.com/MetaMask/metamask-extension/pull/8883): Allow setting a custom nonce of zero
- [#8889](https://github.com/MetaMask/metamask-extension/pull/8889): Fix language code format mismatch
- [#8891](https://github.com/MetaMask/metamask-extension/pull/8891): Prevent showing connected accounts without origin
- [#8893](https://github.com/MetaMask/metamask-extension/pull/8893): Prevent manually connecting to extension UI
- [#8895](https://github.com/MetaMask/metamask-extension/pull/8895): Allow localized messages to not use substitutions
- [#8897](https://github.com/MetaMask/metamask-extension/pull/8897): Update eth-keyring-controller to fix erasure of imported/hardware account names
- [#8896](https://github.com/MetaMask/metamask-extension/pull/8896): Include relative time polyfill locale data
- [#8898](https://github.com/MetaMask/metamask-extension/pull/8898): Replace percentage opacity value
- [#7004](https://github.com/MetaMask/metamask-extension/pull/7004): Add permission system
- [#7261](https://github.com/MetaMask/metamask-extension/pull/7261): Search accounts by name
- [#7483](https://github.com/MetaMask/metamask-extension/pull/7483): Buffer 3 blocks before dropping a transaction
- [#7620](https://github.com/MetaMask/metamask-extension/pull/7620): Handle one specific permissions request per tab
- [#7686](https://github.com/MetaMask/metamask-extension/pull/7686): Add description to Reset Account in settings
- [#7362](https://github.com/MetaMask/metamask-extension/pull/7362): Allow custom IPFS gateway and use more secure default gateway
- [#7696](https://github.com/MetaMask/metamask-extension/pull/7696): Adjust colour of Reset Account button to reflect danger
- [#7602](https://github.com/MetaMask/metamask-extension/pull/7602): Support new onboarding library
- [#7672](https://github.com/MetaMask/metamask-extension/pull/7672): Update custom token symbol length restriction message
- [#7747](https://github.com/MetaMask/metamask-extension/pull/7747): Handle 'Enter' keypress on restore from seed screen
- [#7810](https://github.com/MetaMask/metamask-extension/pull/7810): Remove padding around advanced gas info icon
- [#7840](https://github.com/MetaMask/metamask-extension/pull/7840): Force background state update after removing an account
- [#7853](https://github.com/MetaMask/metamask-extension/pull/7853): Change "Log In/Out" terminology to "Unlock/Lock"
- [#7863](https://github.com/MetaMask/metamask-extension/pull/7863): Add mechanism to randomize seed phrase filename
- [#7933](https://github.com/MetaMask/metamask-extension/pull/7933): Sort seed phrase confirmation buttons alphabetically
- [#7987](https://github.com/MetaMask/metamask-extension/pull/7987): Add support for 24 word seed phrases
- [#7971](https://github.com/MetaMask/metamask-extension/pull/7971): Use contact name instead of address during send flow
- [#8050](https://github.com/MetaMask/metamask-extension/pull/8050): Add title attribute to transaction title
- [#7831](https://github.com/MetaMask/metamask-extension/pull/7831): Implement encrypt/decrypt feature
- [#8125](https://github.com/MetaMask/metamask-extension/pull/8125): Add setting for disabling Eth Phishing Detection
- [#8148](https://github.com/MetaMask/metamask-extension/pull/8148): Prevent external domains from submitting more than one perm request at a time
- [#8149](https://github.com/MetaMask/metamask-extension/pull/8149): Wait for extension unlock before processing eth_requestAccounts
- [#8201](https://github.com/MetaMask/metamask-extension/pull/8201): Add Idle Timeout for Sync with mobile
- [#8247](https://github.com/MetaMask/metamask-extension/pull/8247): Update Italian translation
- [#8246](https://github.com/MetaMask/metamask-extension/pull/8246): Make seed phrase import case-insensitive
- [#8254](https://github.com/MetaMask/metamask-extension/pull/8254): Convert Connected Sites page to modal
- [#8259](https://github.com/MetaMask/metamask-extension/pull/8259): Update token cell to show inline stale balance warning
- [#8264](https://github.com/MetaMask/metamask-extension/pull/8264): Move asset list to home tab on small screens
- [#8270](https://github.com/MetaMask/metamask-extension/pull/8270): Connected status indicator
- [#8078](https://github.com/MetaMask/metamask-extension/pull/8078): Allow selecting multiple accounts during connect flow
- [#8318](https://github.com/MetaMask/metamask-extension/pull/8318): Focus the notification popup if it's already open
- [#8356](https://github.com/MetaMask/metamask-extension/pull/8356): Position notification relative to last focused window
- [#8358](https://github.com/MetaMask/metamask-extension/pull/8358): Close notification UI if no unapproved confirmations
- [#8293](https://github.com/MetaMask/metamask-extension/pull/8293): Add popup explaining connection indicator to existing users
- [#8435](https://github.com/MetaMask/metamask-extension/pull/8435): Correctly detect changes to background state
- [#7912](https://github.com/MetaMask/metamask-extension/pull/7912): Disable import button for empty string/file
- [#8246](https://github.com/MetaMask/metamask-extension/pull/8246): Make seed phrase import case-insensitive
- [#8312](https://github.com/MetaMask/metamask-extension/pull/8312): Alert user upon switching to unconnected account
- [#8445](https://github.com/MetaMask/metamask-extension/pull/8445): Only updating pending transactions upon block update
- [#8467](https://github.com/MetaMask/metamask-extension/pull/8467): Fix firefox popup location
- [#8486](https://github.com/MetaMask/metamask-extension/pull/8486): Prevent race condition where transaction value set in UI is overwritten
- [#8490](https://github.com/MetaMask/metamask-extension/pull/8490): Fix default gas race condition
- [#8491](https://github.com/MetaMask/metamask-extension/pull/8491): Update tokens after importing account
- [#8496](https://github.com/MetaMask/metamask-extension/pull/8496): Enable disconnecting a single account or all accounts
- [#8502](https://github.com/MetaMask/metamask-extension/pull/8502): Add support for IPFS address resolution
- [#8419](https://github.com/MetaMask/metamask-extension/pull/8419): Add version dimension to metrics event
- [#8508](https://github.com/MetaMask/metamask-extension/pull/8508): Open notification UI when eth_requestAccounts waits for unlock
- [#8533](https://github.com/MetaMask/metamask-extension/pull/8533): Prevent negative values on gas inputs
- [#8550](https://github.com/MetaMask/metamask-extension/pull/8550): Allow disabling alerts
- [#8563](https://github.com/MetaMask/metamask-extension/pull/8563): Synchronously update transaction status
- [#8567](https://github.com/MetaMask/metamask-extension/pull/8567): Improve Spanish localized message
- [#8532](https://github.com/MetaMask/metamask-extension/pull/8532): Add switch to connected account alert
- [#8575](https://github.com/MetaMask/metamask-extension/pull/8575): Stop polling for recent blocks on custom networks when UI is closed
- [#8579](https://github.com/MetaMask/metamask-extension/pull/8579): Fix Matomo dimension IDs
- [#8592](https://github.com/MetaMask/metamask-extension/pull/8592): Handle trailing / in block explorer URLs
- [#8313](https://github.com/MetaMask/metamask-extension/pull/8313): Add Connected Accounts modal
- [#8609](https://github.com/MetaMask/metamask-extension/pull/8609): Sticky position the tabs at the top
- [#8634](https://github.com/MetaMask/metamask-extension/pull/8634): Define global `web3` as non-enumerable
- [#8601](https://github.com/MetaMask/metamask-extension/pull/8601): warn user when sending from different account
- [#8612](https://github.com/MetaMask/metamask-extension/pull/8612): Persist home tab state
- [#8564](https://github.com/MetaMask/metamask-extension/pull/8564): Implement new transaction list design
- [#8596](https://github.com/MetaMask/metamask-extension/pull/8596): Restrict the size of the permissions metadata store
- [#8654](https://github.com/MetaMask/metamask-extension/pull/8654): Update account options menu design
- [#8657](https://github.com/MetaMask/metamask-extension/pull/8657): Implement new fullscreen design
- [#8663](https://github.com/MetaMask/metamask-extension/pull/8663): Show hostname in the disconnect confirmation
- [#8665](https://github.com/MetaMask/metamask-extension/pull/8665): Make address display wider in Account Details
- [#8670](https://github.com/MetaMask/metamask-extension/pull/8670): Fix token `decimal` type
- [#8653](https://github.com/MetaMask/metamask-extension/pull/8653): Limit Dapp permissions to primary account
- [#8666](https://github.com/MetaMask/metamask-extension/pull/8666): Manually connect via the full connect flow
- [#8677](https://github.com/MetaMask/metamask-extension/pull/8677): Add metrics events for Wyre and CoinSwitch
- [#8680](https://github.com/MetaMask/metamask-extension/pull/8680): Fix connect hardware styling
- [#8689](https://github.com/MetaMask/metamask-extension/pull/8689): Fix create account form styling
- [#8702](https://github.com/MetaMask/metamask-extension/pull/8702): Fix tab content disappearing during scrolling on macOS Firefox
- [#8696](https://github.com/MetaMask/metamask-extension/pull/8696): Implement asset page
- [#8716](https://github.com/MetaMask/metamask-extension/pull/8716): Add nonce to transaction details
- [#8717](https://github.com/MetaMask/metamask-extension/pull/8717): Use URL origin instead of hostname for permission domains
- [#8747](https://github.com/MetaMask/metamask-extension/pull/8747): Fix account menu entry for imported accounts
- [#8768](https://github.com/MetaMask/metamask-extension/pull/8768): Permissions: Do not display HTTP/HTTPS URL schemes for unique hosts
- [#8730](https://github.com/MetaMask/metamask-extension/pull/8730): Hide seed phrase during Account Import
- [#8785](https://github.com/MetaMask/metamask-extension/pull/8785): Rename 'History' tab to 'Activity'
- [#8781](https://github.com/MetaMask/metamask-extension/pull/8781): use UI button for add token functionality
- [#8786](https://github.com/MetaMask/metamask-extension/pull/8786): Show fiat amounts inline on token transfers
- [#8789](https://github.com/MetaMask/metamask-extension/pull/8789): Warn users to only add custom networks that they trust
- [#8802](https://github.com/MetaMask/metamask-extension/pull/8802): Consolidate connected account alerts
- [#8810](https://github.com/MetaMask/metamask-extension/pull/8810): Remove all user- and translator-facing instances of 'dapp'
- [#8836](https://github.com/MetaMask/metamask-extension/pull/8836): Update method data when cached method data is empty
- [#8833](https://github.com/MetaMask/metamask-extension/pull/8833): Improve error handling when signature requested without a keyholder address
- [#8850](https://github.com/MetaMask/metamask-extension/pull/8850): Stop upper-casing exported private key
- [#8631](https://github.com/MetaMask/metamask-extension/pull/8631): Include imported accounts in mobile sync

## Remote Component([0.1.56](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.56)), Browser Component: `1.0.20`(17-Jul-2020)
- [brave-browser#9775](https://github.com/brave/brave-browser/issues/9775): Fixed connect popup responsiveness when using "Sign Typed Data"
- [#8446](https://github.com/MetaMask/metamask-extension/pull/8446): Fix popup not opening
- [#8449](https://github.com/MetaMask/metamask-extension/pull/8449): Skip adding history entry for empty txMeta diffs
- [#8447](https://github.com/MetaMask/metamask-extension/pull/8447): Delete Dai/Sai migration notification
- [#8460](https://github.com/MetaMask/metamask-extension/pull/8460): Update deposit copy for Wyre
- [#8458](https://github.com/MetaMask/metamask-extension/pull/8458): Snapshot txMeta without cloning history
- [#8459](https://github.com/MetaMask/metamask-extension/pull/8459): Fix method registry initialization
- [#8455](https://github.com/MetaMask/metamask-extension/pull/8455): Add Dai/Sai to currency display
- [#8461](https://github.com/MetaMask/metamask-extension/pull/8461): Prevent network switch upon close of network timeout overlay
- [#8457](https://github.com/MetaMask/metamask-extension/pull/8457): Add INR currency option
- [#8462](https://github.com/MetaMask/metamask-extension/pull/8462): Fix display of Kovan and Rinkeby chain IDs
- [#8465](https://github.com/MetaMask/metamask-extension/pull/8465): Use ethereum-ens-network-map for network support
- [#8463](https://github.com/MetaMask/metamask-extension/pull/8463): Update deprecated Etherscam link
- [#8474](https://github.com/MetaMask/metamask-extension/pull/8474): Only update pending transactions upon block update
- [#8476](https://github.com/MetaMask/metamask-extension/pull/8476): Update eth-contract-metadata
- [#8509](https://github.com/MetaMask/metamask-extension/pull/8509): Fix Tohen Typo

## Remote Component([0.1.54](https://github.com/brave/ethereum-remote-client/releases/tag/0.1.54)), Browser Component: `1.0.19`(03-Jun-2020)
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
