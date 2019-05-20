import React from 'react'
import { storiesOf } from '@storybook/react'
import WelcomePage from './welcome-page'

storiesOf('Crypto Wallet', module)
  .add('Welcome Page', () =>
    <WelcomePage />
  )
