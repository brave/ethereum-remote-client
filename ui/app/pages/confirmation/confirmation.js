import React, {
  useEffect,
  useState,
} from 'react'
import { ethErrors } from 'eth-rpc-errors'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isEqual } from 'lodash'
import { DEFAULT_ROUTE } from '../../helpers/constants/routes'
import { useI18nContext } from '../../hooks/useI18nContext'
import { getUnapprovedConfirmations } from '../../selectors'
import {
  rejectPendingApproval,
  resolvePendingApproval,
} from '../../store/actions'
import Button from '../../components/ui/button'

function getAddNetworkValues (pendingConfirmation, dispatch, t) {
  return {
    popup: {
      title: t('addEthereumChainConfirmationTitle'),
      description: t('addEthereumChainConfirmationDescription'),
      confirmationRisksTitle: t('addEthereumChainConfirmationRisks'),
      confirmationRisksLearnMore: t('addEthereumChainConfirmationRisksLearnMore'),
      confirmationRisksLearnMoreLink: t('addEthereumChainConfirmationRisksLearnMoreLink'),
    },
    tooltips: {
      [t('networkName')]: t('networkNameDefinition'),
      [t('networkURL')]: t('networkURLDefinition'),
      [t('chainId')]: t('chainIdDefinition'),
      [t('currencySymbol')]: t('currencySymbolDefinition'),
      [t('blockExplorerUrl')]: t('blockExplorerUrlDefinition'),
    },
    body: {
      title: t('networkDetails'),
      networkName: {
        title: t('networkName'),
        value: pendingConfirmation.requestData.chainName,
      },
      networkURL: {
        title: t('networkURL'),
        value: pendingConfirmation.requestData.rpcUrl,
      },
      chain: {
        title: t('chainId'),
        value: parseInt(pendingConfirmation.requestData.chainId, 16),
      },
      currencySymbol: {
        title: t('currencySymbol'),
        value: pendingConfirmation.requestData.ticker,
      },
      blockExplorerUrl: {
        title: t('blockExplorerUrl'),
        value: pendingConfirmation.requestData
          .blockExplorerUrl,
      },
    },
    footerButtons: {
      approvalText: t('approveButtonText'),
      cancelText: t('cancel'),
      onApprove: () => dispatch(resolvePendingApproval(
        pendingConfirmation.id,
        pendingConfirmation.requestData,
      )),

      onCancel: () =>
        dispatch(rejectPendingApproval(
          pendingConfirmation.id,
          ethErrors.provider.userRejectedRequest(),
        )),
    },
  }
}

function getSwitchNetworkValues (pendingConfirmation, dispatch, t) {
  return {
    popup: {
      title: t('switchEthereumChainConfirmationTitle'),
      description: t('switchEthereumChainConfirmationDescription'),
    },
    body: {
      networkURL: {
        title: t('networkURL'),
        value: pendingConfirmation.requestData.rpcUrl,
      },
      currencySymbol: {
        title: t('currencySymbol'),
        value: pendingConfirmation.requestData.ticker,
      },
    },
    footerButtons: {
      approvalText: t('switchNetwork'),
      cancelText: t('cancel'),
      onApprove: () => dispatch(resolvePendingApproval(
        pendingConfirmation.id,
        pendingConfirmation.requestData,
      )),

      onCancel: () =>
        dispatch(rejectPendingApproval(
          pendingConfirmation.id,
          ethErrors.provider.userRejectedRequest(),
        )),
    },
  }
}

function getValues (pendingConfirmation, dispatch, t) {
  switch (pendingConfirmation.type) {
    case 'wallet_addEthereumChain':
      return getAddNetworkValues(pendingConfirmation, dispatch, t)
    case 'wallet_switchEthereumChain':
      return getSwitchNetworkValues(pendingConfirmation, dispatch, t)
    default:
      return ethErrors.provider.userRejectedRequest()
  }
}

export default function ConfirmationPage () {
  const t = useI18nContext()

  const history = useHistory()
  const pendingConfirmations = useSelector(
    getUnapprovedConfirmations,
    isEqual,
  )
  const [currentPendingConfirmation, setCurrentPendingConfirmation] = useState(
    0,
  )
  const pendingConfirmation = pendingConfirmations[currentPendingConfirmation]
  const dispatch = useDispatch()
  const details = getValues(pendingConfirmation, dispatch, t)

  useEffect(() => {
    // If the number of pending confirmations reduces to zero when the user
    // return them to the default route. Otherwise, if the number of pending
    // confirmations reduces to a number that is less than the currently
    // viewed index, reset the index.
    if (pendingConfirmations.length === 0) {
      history.push(DEFAULT_ROUTE)
    } else if (pendingConfirmations.length <= currentPendingConfirmation) {
      setCurrentPendingConfirmation(pendingConfirmations.length - 1)
    }
  }, [pendingConfirmations, history, currentPendingConfirmation])
  if (!pendingConfirmation) {
    return null
  }
  const newNetwork = pendingConfirmation.type === 'wallet_addEthereumChain'
  return (
    <div className="confirmation-page">
      {pendingConfirmations.length > 1 && (
        <div className="confirmation-page__navigation">
          <p>
            {t('xOfYPending', [
              currentPendingConfirmation + 1,
              pendingConfirmations.length,
            ])}
          </p>
          {currentPendingConfirmation > 0 && (
            <button
              className="confirmation-page__navigation-button"
              onClick={() =>
                setCurrentPendingConfirmation(currentPendingConfirmation - 1)
              }
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          <button
            className="confirmation-page__navigation-button"
            disabled={
              currentPendingConfirmation + 1 === pendingConfirmations.length
            }
            onClick={() =>
              setCurrentPendingConfirmation(currentPendingConfirmation + 1)
            }
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      <div className="confirmation-page__content">
        <div className="main-title">{details.popup.title}</div>
        <div>{details.popup.description}</div>
        {newNetwork && (
          <div className="title">{details.popup.confirmationRisksTitle}
            <span>{details.popup.confirmationRisksLearnMore}</span>
            <a href="https://metamask.zendesk.com/hc/en-us/articles/360056196151">{details.popup.confirmationRisksLearnMoreLink}</a>
          </div>
        )}

        <div className="title">{details.body.networkURL.title} : <span>{details.body.networkURL.value}</span></div>
        <div className="title">{details.body.currencySymbol.title} : <span>{details.body.currencySymbol.value}</span></div>
        {newNetwork && (
          <div>
            <div className="title">{details.body.title}</div>
            <div className="title">{details.body.networkName.title} : <span>{details.body.networkName.value}</span></div>
            <div className="title">{details.body.chain.title} : <span>{details.body.chain.value}</span></div>
            <div className="title">{details.body.blockExplorerUrl.title} : <span>{details.body.blockExplorerUrl.value}</span></div>
          </div>
        )}
      </div>
      <div className="confirmation-footer">
        <div className="confirmation-footer__actions">
          <Button rounded type="secondary" onClick={details.footerButtons.onCancel}>
            {details.footerButtons.cancelText}
          </Button>
          <Button rounded type="primary" onClick={details.footerButtons.onApprove}>
            {details.footerButtons.approvalText}
          </Button>
        </div>
      </div>
    </div>
  )
}
