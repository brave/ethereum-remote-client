/**
 * CAUTION: The contents of this file have business implications. Please check
 * with @bbondy before modifying.
 */
import { MAINNET, ROPSTEN } from '../../../../app/scripts/controllers/network/enums'


export default function getConfig (network) {
  switch (network) {
    case ROPSTEN:
      return {
        swapAPIQuoteURL: 'https://ropsten.api.0x.org/swap/v1/quote',
        buyTokenPercentageFee: 0.875,
        feeRecipient: '0xBc0447ab9c1D4FE379Aae40b25e8586DB3f52498',
        defaultSlippage: 0.03,
      }

    case MAINNET:
    default:
      return {
        swapAPIQuoteURL: 'https://api.0x.org/swap/v1/quote',
        buyTokenPercentageFee: 0.875,
        feeRecipient: '0xbd9420A98a7Bd6B89765e5715e169481602D9c3d',
        defaultSlippage: 0.03,
      }
  }
}
