import assert from 'assert'
import migration48 from '../../../app/scripts/migrations/048'

describe('migration #48', function () {
  it('should update the version metadata', async function () {
    const oldStorage = {
      'meta': {
        'version': 47,
      },
      'data': {},
    }

    const newStorage = await migration48.migrate(oldStorage)
    assert.deepEqual(newStorage.meta, {
      'version': 48,
    })
  })

  it('should update ipfsGateway value to native Brave ipfs if available', async function () {
    // code stub to simulate flag
    window.chrome = {
      ipcRenderer: true,
      ipfs: { getIPFSEnabled: () => { } }
    }
    
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          ipfsGateway: '<any value at all>',
          bar: 'baz',
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration48.migrate(oldStorage)
    assert.deepEqual(newStorage.data, {
      PreferencesController: {
        ipfsGateway: 'ipfs://<cid>',
        bar: 'baz',
      },
      foo: 'bar',
    })
  })

  /*
  If someone is using an old version of Brave and chrome.ipfs is not available, but is using this newer extension
  we should use the existing setting of Crypto Wallets or dweb.link if no existing setting is available.
  */
  it('should not update ipfsGateway value if not available', async function () {
    // code stub to simulate no getIPFSEnabled availability
    window.chrome = { ipcRenderer: true }

    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          ipfsGateway: 'blah',
          bar: 'baz',
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration48.migrate(oldStorage)
    assert.deepEqual(newStorage.data, {
      PreferencesController: {
        ipfsGateway: 'blah',
        bar: 'baz',
      },
      foo: 'bar',
    })
  })

  it('should set `dweb.link` if no PreferencesController key', async function () {
    // code stub to simulate no getIPFSEnabled availability
    window.chrome = { ipcRenderer: true }

    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          bar: 'baz',
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration48.migrate(oldStorage)
    assert.deepEqual(newStorage.data, {
      PreferencesController: {
        ipfsGateway: 'dweb.link',
        bar: 'baz',
      },
      foo: 'bar',
    })
  })
})
