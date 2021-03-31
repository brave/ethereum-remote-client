import React from 'react'
import PropTypes from 'prop-types'
import Identicon from '../../../ui/identicon'
import classnames from 'classnames'
import { ellipsify } from '../../../../pages/swap/swap.utils'

function addressesEqual (address1, address2) {
  return String(address1).toLowerCase() === String(address2).toLowerCase()
}

export default function RecipientGroup ({ label, items, onSelect, selectedAddress }) {
  if (!items || !items.length) {
    return null
  }

  return (
    <div className="swap__select-recipient-wrapper__group">
      {label && (
        <div className="swap__select-recipient-wrapper__group-label">
          {label}
        </div>
      )}
      {
        items.map(({ address, name }) => (
          <div
            key={address}
            onClick={() => onSelect(address, name)}
            className={classnames({
              'swap__select-recipient-wrapper__group-item': !addressesEqual(address, selectedAddress),
              'swap__select-recipient-wrapper__group-item--selected': addressesEqual(address, selectedAddress),
            })}
          >
            <Identicon address={address} diameter={28} />
            <div className="swap__select-recipient-wrapper__group-item__content">
              <div className="swap__select-recipient-wrapper__group-item__title">
                {name || ellipsify(address)}
              </div>
              {
                name && (
                  <div className="swap__select-recipient-wrapper__group-item__subtitle">
                    {ellipsify(address)}
                  </div>
                )
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

RecipientGroup.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string,
  })),
  onSelect: PropTypes.func.isRequired,
  selectedAddress: PropTypes.string,
}
