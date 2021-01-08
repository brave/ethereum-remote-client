import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import {
  getMetaMaskAccounts,
  getMetaMaskIdentities,
  getMetaMaskKeyrings,
  getMetaMaskAccountsOrdered,
} from '../../../../../../ui/app/selectors/selectors'


import { showAccountDetail } from '../../../../../../ui/app/store/actions'
import AssetImage from '../../../../../../ui/app/components/ui/asset-image'
import CurrencyDisplay from '../../../../../../ui/app/components/ui/currency-display'
import { I18nContext } from '../../../../../../ui/app/contexts/i18n'
import Identicon from '../../../../../../ui/app/components/ui/identicon'
import {
  DEFAULT_ROUTE,
  CONNECT_HARDWARE_ROUTE,
  NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
  BRAVE_CONNECT_WALLETS_ROUTE,
  BRAVE_BITGO_INITIALIZE_ROUTE,
  BRAVE_BITGO_WALLET_INDEX,
} from '../../../../../../ui/app/helpers/constants/routes'

import { supportedCoins } from '../../../../../../app/scripts/controllers/bitgo'

import CaratDownIcon from '../dropdowns/assets/carat-down'
import ImportIcon from '../dropdowns/assets/import-icon'
import PlusIcon from '../dropdowns/assets/plus-icon'

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

/*const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);*/


const appHeaderSelector = createSelector(
  getMetaMaskAccountsOrdered,
  (state) => ({
    bitgoWallets: state.metamask.bitgoWallets,
    isUnlocked: state.metamask.isUnlocked,
  }),
  (accounts, other) => ({
    accounts,
    ...other
  })
)

const AccountMenuItem = React.forwardRef(({
  address,
  balance,
  currency,
  iconType = 'asset',
  label,
  onClick,
  ...props
}, ref) => {
  const icon = iconType === 'asset' ?
      <AssetImage className='identicon' asset={currency.toLowerCase()} style={{ width: '24px', height: '24px' }}/> :
      <Identicon address={address} diameter={24} />

  const handleClick = useCallback(() => {
    onClick && onClick({ address, currency })
  }, [onClick])

  return (
    <MenuItem
      ref={ref}
      onClick={handleClick}
      {...props}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        secondary={
          <CurrencyDisplay
            currency={currency}
            value={(balance == "NaN" || Number.isNaN(balance)) ? 0 : balance}
            numberOfDecimals={3}
          />}
        secondaryTypographyProps={{
          component: 'div'
        }}
      />
    </MenuItem>
  )
})

const EthereumMenu = ({ id, active, onOpen, onClose, ...props }) => {
  const t = useContext(I18nContext)
  const [anchorEl, setAnchorEl] = useState(null)

  const accounts = useSelector(getMetaMaskAccountsOrdered)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    onOpen && onOpen(id)
  }, [setAnchorEl, onOpen, id])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
    onClose && onClose(id)
  }, [setAnchorEl, onClose, id])

  const handleAccountClick = useCallback(({ address, currency }) => {
    dispatch(showAccountDetail(address))
    history.push(DEFAULT_ROUTE)
    handleClose()
  }, [dispatch])

  return (<>
    <Button
      aria-controls={id}
      aria-haspopup='true'
      variant='contained'
      color='primary'
      endIcon={<CaratDownIcon />}
      onClick={handleClick}
      className={active ? 'active' : undefined}
    >
      Ethereum Wallet
    </Button>
    <StyledMenu
      id={id}
      className='items'
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {accounts && accounts.map(({ address, balance, name }) => (
        <AccountMenuItem
          key={`account-${address}`}
          address={address}
          balance={balance}
          currency={'ETH'}
          iconType='identicon'
          label={name || ''}
          onClick={handleAccountClick}
        />
      ))}
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <PlusIcon />
        </ListItemIcon>
        <ListItemText primary={t('createAccount')} />
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <ImportIcon />
        </ListItemIcon>
        <ListItemText primary={t('importAccount')} />
      </MenuItem>
    </StyledMenu>
  </>)
}

const BitGoMenu = ({ id, active, onOpen, onClose, ...props }) => {
  const t = useContext(I18nContext)
  const bitgoWallets = useSelector((state) => state.metamask.bitgoWallets)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    onOpen && onOpen(id)
  }, [setAnchorEl, onOpen, id])

  const handleCloseFromMenu = useCallback(() => {
    setAnchorEl(null)
    onClose && onClose(id)
  }, [setAnchorEl, onClose, id])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl, onClose, id])

  const handleAccountClick = useCallback((id) => {
    history.push(`${BRAVE_BITGO_WALLET_INDEX}/${id}`)
    handleClose()
  }, [history])

  const handleCreateAccount = useCallback(() => {
    history.push(BRAVE_BITGO_INITIALIZE_ROUTE)
    handleClose()
  })

  return (<>
    <Button
      aria-controls={id}
      aria-haspopup='true'
      variant='contained'
      color='primary'
      endIcon={<CaratDownIcon />}
      onClick={handleClick}
      className={active ? 'active' : undefined}
    >
      BitGo Wallet
    </Button>
    <StyledMenu
      id={id}
      className='items'
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleCloseFromMenu}
    >
      {bitgoWallets && Object.entries(bitgoWallets).map(([id, wallet]) => (
        <AccountMenuItem
          key={`bitgo-${id}`}
          address={wallet.receiveAddress}
          balance={(wallet.balance / 1e8).toFixed(4)}
          currency={wallet.coin.toUpperCase()}
          iconType='asset'
          label={supportedCoins[wallet.coin.toLowerCase()]}
          onClick={() => { handleAccountClick(id) }}
        />
      ))}
      <MenuItem onClick={handleCreateAccount}>
        <ListItemIcon>
          <PlusIcon />
        </ListItemIcon>
        <ListItemText primary={t('createAccount')} />
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <ImportIcon />
        </ListItemIcon>
        <ListItemText primary={t('importAccount')} />
      </MenuItem>
    </StyledMenu>
  </>)
}

const getActiveMenu = (location) => {
  if (location.pathname.startsWith(BRAVE_BITGO_WALLET_INDEX)) {
    return 'bitgo'
  }
  else if (location.pathname.startsWith(BRAVE_CONNECT_WALLETS_ROUTE)) {
    return 'connect'
  }

  return 'eth'
}

const BraveAppHeader = () => {
  const {
    bitgoWallets,
    isUnlocked,
  } = useSelector(appHeaderSelector)

  const history = useHistory()

  const [activeMenu, setActiveMenu] = useState(getActiveMenu(history.location))
  const handleClose = useCallback(() => {
    setActiveMenu(getActiveMenu(history.location))
  }, [setActiveMenu, history])

  const haveBitGoWallets = Object.keys(bitgoWallets).length > 0;

  useEffect(() => {
    return history.listen((location, action) => {
      setActiveMenu(getActiveMenu(location))
    })
  })

  return (
    <div className="app-header-menu">
      <EthereumMenu
        active={activeMenu === 'eth'}
        id='eth'
        onOpen={setActiveMenu}
        onClose={handleClose}
      />
      <BitGoMenu
        active={activeMenu === 'bitgo'}
        id='bitgo'
        onOpen={setActiveMenu}
        onClose={handleClose}
      />
    </div>
  )
}

export default BraveAppHeader
