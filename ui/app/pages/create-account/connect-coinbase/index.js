import React, { PureComponent } from 'react'
const connect = require('react-redux').connect

class ConnectCoinbaseForm extends PureComponent {
  constructor (props, context) {
    super(props)
    this.state = {}
  }

  get styles () {
    return {
      buttonWrapper: {
        textAlign: 'center',
        paddingTop: '50px'
      },
      authButton: {
        color: 'white',
        background: 'blue',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '20px'
      }
    }
  }

  authorizeCoinbase = () => {
    console.log('Should authorize')
  }

  render () {
    return (
      <div style={this.styles.buttonWrapper}>
        <button
          type={'button'}
          style={this.styles.authButton}
          onClick={this.authorizeCoinbase}
        >
          {'Authorize Coinbase'}
        </button>
      </div>
    )
  }
}

ConnectCoinbaseForm.propTypes = {}

const mapStateToProps = state => {}

const mapDispatchToProps = dispatch => {}

ConnectCoinbaseForm.contextTypes = {}

module.exports = connect(mapStateToProps, mapDispatchToProps)(
  ConnectCoinbaseForm
)
