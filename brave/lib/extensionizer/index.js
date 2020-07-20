const extension = require('extensionizer')

extension.runtime.onInstalled = {
  addListener: (_reason) => { /* no-op */ },
}

module.exports = extension
