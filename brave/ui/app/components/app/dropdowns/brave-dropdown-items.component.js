import React, { PureComponent } from 'react'

import {
  Dropdown,
  DropdownMenuItem
} from '../../../../../../ui/app/components/app/dropdowns/components/dropdown'
import styles from './assets/styles'

module.exports = class BraveDropdownItems extends PureComponent {

  render () {
    const {
      type,
      items,
      isOpen,
      onMouseLeave
    } = this.props

    return (
      <Dropdown
        zIndex={55}
        isOpen={isOpen}
        style={styles.menu}
        onMouseLeave={onMouseLeave}
        containerClassName={`brave-${type}-menu`}
        innerStyle={styles.innerMenu}
      >
        {items.map((item, inc) => {
          const style = item.style || {}
          const onClick = item.onClick || (() => {})

          return (
            <DropdownMenuItem
              onClick={onClick}
              key={`item-${inc}`}
              closeMenu={() => {}}
              style={{
                ...style,
                textAlign: 'center'
              }}
            >
              {item.markup}
            </DropdownMenuItem>
          )          
        })}
      </Dropdown>
    )
  }
}
