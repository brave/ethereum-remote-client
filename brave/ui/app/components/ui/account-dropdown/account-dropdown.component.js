import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CaratDownIcon from '../../app/dropdowns/assets/carat-down'
import { CloseArea } from '../../app/dropdowns/components/menu'
import Identicon from '../../../../../../ui/app/components/ui/identicon'

export default class AccountDropdown extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    accounts: PropTypes.objectOf(PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string.isRequired,
      details: PropTypes.string,
      rates: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    selected: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
  }

  state = {
    open: false,
  }

  toggle () {
    this.setState({
      open: !this.state.open,
    })
  }

  selectAccount (id) {
    this.props.select(id)
    this.setState({
      open: false,
    })
  }

  renderAccount (id, inDropdown = false) {
    const {
      image,
      name,
      details,
      rates,
    } = this.props.accounts[id]

    return (
      <div
        className="account-dropdown__account-container"
        key={id}
        onClick={inDropdown ? () => this.selectAccount(id) : undefined}
      >
        <Identicon
          className="account-dropdown__icon"
          diameter={32}
          address={id}
          image={image}
        />
        <div className="account-dropdown__info">
          <div className="account-dropdown__name">
            { name }
          </div>
          {
            details && (
              <div className="account-dropdown__details">
                { details }
              </div>
            )
          }
        </div>
        <div
          className={classnames({
            'account-dropdown__rates': true,
            'account-dropdown__rates-no-carat': inDropdown,
          })}
        >
          { rates && rates.map((rate, index) => <div key={index}>{ rate }</div>) }
        </div>
        {!inDropdown && (
          <div className="account-dropdown__carat">
            <CaratDownIcon />
          </div>
        )}
      </div>
    )
  }

  renderAccountList () {
    const { accounts } = this.props

    const items = Object.keys(accounts).map(id => this.renderAccount(id, true))

    return (
      <div>
        <CloseArea onClick={() => this.toggle()} />
        <div className="account-dropdown__list">
          { items }
        </div>
      </div>
    )
  }

  render () {
    const { open } = this.state
    const { label, selected } = this.props

    return (
      <div className="account-dropdown">
        <div className="account-dropdown__label">{label}</div>
        <div
          className={classnames({
            'account-dropdown__box': true,
            'account-dropdown__box-open': open,
          })}
          onClick={() => this.toggle()}
        >
          { this.renderAccount(selected) }
        </div>
        { open ? this.renderAccountList() : null}
      </div>
    )
  }
}
