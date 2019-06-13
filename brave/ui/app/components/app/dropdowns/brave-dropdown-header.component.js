import React, { PureComponent } from 'react'

import styles from './assets/styles'
import PlusIcon from './assets/plus-icon'
import CaratDownIcon from './assets/carat-down'

module.exports = class BraveDropdownHeader extends PureComponent {

  render () {
    const {
      active,
      isConnect,
      title,
      type,
      onClick
    } = this.props

    const activeKey = active ? 'active' : 'inactive'

    return (
      <div
        onClick={onClick}
        className={`${type}-dropdown`}
        style={
          {
            ...styles.container.general,
            ...styles.container[activeKey]
          }
        }
      >
        <span
          style={
              {
              ...styles.title.general,
              ...styles.title[activeKey]
              }
          }
        >
          {
            isConnect
            ? <div style={styles.plusContainer}>
                <PlusIcon />
              </div>
            : <div style={styles.leftPadding}></div>
          }
          {title}
          <div style={styles.caratContainer}>
            <CaratDownIcon />
          </div>
        </span>
      </div>
    )
  }
}