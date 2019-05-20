import React, { PureComponent } from 'react'
import {
  StyledWrapper,
  WalletIconWrapper,
  StyledHeader,
  StyledText,
  StyledLink,
  StyledButtonWrapper
} from './style'
import { WalletAddIcon } from 'brave-ui/src/components/icons'
import Button from 'brave-ui/src/components/buttonsIndicators/button'

export default class WelcomePage extends PureComponent {
  render () {
    return (
        <div>
          <StyledWrapper>
            <WalletIconWrapper>
              <WalletAddIcon />
            </WalletIconWrapper>
            <StyledHeader>
              {getLocale('browserWallet')}
            </StyledHeader>
            <StyledText>
              {getLocale('browserWalletWelcomeText')}
            </StyledText>
            <StyledButtonWrapper>
              <Button
                level={'primary'}
                type={'accent'}
                brand={'rewards'}
                text={getLocale('accessWallet')}
              />
            </StyledButtonWrapper>
            <StyledLink>
              {getLocale('restoreBackup')}
            </StyledLink>
          </StyledWrapper>
        </div>
      )
  }
}