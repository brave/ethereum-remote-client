import React from 'react'
import assert from 'assert'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import AdvancedTab from '../advanced-tab.component'
import TextField from '../../../../components/ui/text-field'
import { getIPFSEnabledFlag } from '../../../../../../app/scripts/lib/util'

describe('AdvancedTab Component', function () {
  it('should update autoLockTimeLimit', function () {
    const setAutoLockTimeLimitSpy = sinon.spy()
    const root = shallow(
      <AdvancedTab
        ipfsGateway=""
        setAutoLockTimeLimit={setAutoLockTimeLimitSpy}
        setIpfsGateway={() => {}}
        setShowFiatConversionOnTestnetsPreference={() => {}}
      />,
      {
        context: {
          t: (s) => `_${s}`,
        },
      },
    )

    const autoTimeout = root.find('.settings-page__content-row').at(7)
    const textField = autoTimeout.find(TextField)

    textField.props().onChange({ target: { value: 1440 } })
    assert.equal(root.state().autoLockTimeLimit, 1440)

    autoTimeout.find('.settings-tab__rpc-save-button').simulate('click')
    assert.equal(setAutoLockTimeLimitSpy.args[0][0], 1440)
  })

  it('simulate IpfsEnabledFlag enabled', async function () {
    // code stub to simulate flag
    window.chrome = {
      ipfs: {
        getIPFSEnabled: (cb) => {
          return cb(true)
        },
      },
    }

    const isBraveIpfs = await getIPFSEnabledFlag()
    assert.equal(isBraveIpfs, true)
  })
  it('simulate IpfsEnabledFlag disabled', async function () {
    // code stub to simulate flag
    window.chrome = {
      ipfs: {
        getIPFSEnabled: (cb) => {
          return cb(false)
        },
      },
    }

    const isBraveIpfs = await getIPFSEnabledFlag()
    assert.equal(isBraveIpfs, false)
  })

  it('simulate IpfsEnabledFlag not present', async function () {
    // code stub to simulate flag
    window.chrome = {
      ipfs: {
        getIPFSEnabled: undefined,
      },
    }

    const isBraveIpfs = await getIPFSEnabledFlag()
    assert.equal(isBraveIpfs, false)
  })

})
