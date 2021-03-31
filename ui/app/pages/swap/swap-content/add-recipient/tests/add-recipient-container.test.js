import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

let mapStateToProps
let mapDispatchToProps

const actionSpies = {
  updateSwapTo: sinon.spy(),
}

proxyquire('../add-recipient.container.js', {
  'react-redux': {
    connect: (ms, md) => {
      mapStateToProps = ms
      mapDispatchToProps = md
      return () => ({})
    },
  },
  '../../../../selectors': {
    getSwapEnsResolution: (s) => `mockSwapEnsResolution:${s}`,
    getSwapEnsResolutionError: (s) => `mockSwapEnsResolutionError:${s}`,
    getAddressBook: (s) => [{ name: `mockAddressBook:${s}` }],
    getAddressBookEntry: (s) => `mockAddressBookEntry:${s}`,
    accountsWithSwapEtherInfoSelector: (s) => `mockAccountsWithSwapEtherInfoSelector:${s}`,
  },
  '../../../../store/actions': actionSpies,
})

describe('add-recipient container', function () {
  describe('mapStateToProps()', function () {
    it('should map the correct properties to props', function () {
      assert.deepEqual(mapStateToProps('mockState'), {
        addressBook: [{ name: 'mockAddressBook:mockState' }],
        contacts: [{ name: 'mockAddressBook:mockState' }],
        ensResolution: 'mockSwapEnsResolution:mockState',
        ensResolutionError: 'mockSwapEnsResolutionError:mockState',
        ownedAccounts: 'mockAccountsWithSwapEtherInfoSelector:mockState',
        addressBookEntryName: undefined,
        nonContacts: [],
      })
    })
  })

  describe('mapDispatchToProps()', function () {
    describe('updateSwapTo()', function () {
      const dispatchSpy = sinon.spy()
      const mapDispatchToPropsObject = mapDispatchToProps(dispatchSpy)

      it('should dispatch an action', function () {
        mapDispatchToPropsObject.updateSwapTo('mockTo', 'mockNickname')
        assert(dispatchSpy.calledOnce)
        assert(actionSpies.updateSwapTo.calledOnce)
        assert.deepEqual(
          actionSpies.updateSwapTo.getCall(0).args,
          ['mockTo', 'mockNickname'],
        )
      })
    })
  })
})
