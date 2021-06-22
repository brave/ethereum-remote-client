/**
 * CAUTION: The contents of this file have business implications. Please check
 * with @bbondy before modifying.
 */
import { MAINNET, ROPSTEN } from '../../../../app/scripts/controllers/network/enums'


export default function getConfig (network) {
  switch (network) {
    case ROPSTEN:
      return {
        swapAPIURL: 'https://ropsten.api.0x.org/swap/v1',
        buyTokenPercentageFee: 0.00875,
        feeRecipient: '0x7B4933b164092b480A7c1b9bbCdBc8Ecd5201B96',
      }

    case MAINNET:
    default:
      return {
        swapAPIURL: 'https://api.0x.org/swap/v1',
        buyTokenPercentageFee: 0.00875,
        feeRecipient: '0xbd9420A98a7Bd6B89765e5715e169481602D9c3d',
      }
  }
}
