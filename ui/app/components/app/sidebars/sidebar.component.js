import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import CustomizeGas from '../gas-customization/gas-modal-page-container'
import EIP1559GasControlsModal from '../gas-customization/eip1559-gas-controls'

export default class Sidebar extends Component {

  static propTypes = {
    sidebarOpen: PropTypes.bool,
    hideSidebar: PropTypes.func,
    sidebarShouldClose: PropTypes.bool,
    transitionName: PropTypes.string,
    type: PropTypes.string,
    sidebarProps: PropTypes.object,
    onOverlayClose: PropTypes.func,
    isEIP1559Active: PropTypes.bool.isRequired,
  }

  renderOverlay () {
    const { onOverlayClose } = this.props

    return (
      <div
        className="sidebar-overlay"
        onClick={() => {
          onOverlayClose && onOverlayClose()
          this.props.hideSidebar()
        }}
      />
    )
  }

  renderSidebarContent () {
    const { type, sidebarProps = {}, isEIP1559Active } = this.props
    const { transaction = {} } = sidebarProps
    switch (type) {
      case 'customize-gas':
        return (
          <div className="sidebar-left">
            {
              isEIP1559Active
                ? <EIP1559GasControlsModal transaction={transaction} />
                : <CustomizeGas transaction={transaction} />
            }
          </div>
        )
      default:
        return null
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.sidebarShouldClose && this.props.sidebarShouldClose) {
      this.props.hideSidebar()
    }
  }

  render () {
    const { transitionName, sidebarOpen, sidebarShouldClose } = this.props

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName={transitionName}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={200}
        >
          { sidebarOpen && !sidebarShouldClose ? this.renderSidebarContent() : null }
        </ReactCSSTransitionGroup>
        { sidebarOpen && !sidebarShouldClose ? this.renderOverlay() : null }
      </div>
    )
  }

}
