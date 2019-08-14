const h = require('react-hyperscript')

import { Menu, Item, Divider, CloseArea } from '../../../../../../../ui/app/components/app/dropdowns/components/menu'

Item.prototype.render = function () {
  const {
    icon,
    children,
    text,
    className = '',
    onClick,
    isShowing,
  } = this.props

  if (isShowing === false) {
    return h('noscript')
  }

  const itemClassName = `menu__item ${className} ${onClick ? 'menu__item--clickable' : ''}`
  const iconComponent = icon ? h('div.menu__item__icon', [icon]) : null
  const textComponent = text ? h('div.menu__item__text', text) : null

  return children
    ? h('div', { className: itemClassName, onClick }, children)
    : h('div.menu__item', { className: itemClassName, onClick }, [ iconComponent, textComponent ]
      .filter(d => Boolean(d))
    )
}

module.exports = { Menu, Item, Divider, CloseArea }
