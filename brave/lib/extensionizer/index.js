const extension = require('extensionizer')

extension.browserAction = {
  setBadgeText: (_opts) => { /* no-op */ },
  setBadgeBackgroundColor: (_opts) => { /* no-op */ },
}

extension.runtime.onInstalled = {
  addListener: (_reason) => { /* no-op */ },
}

module.exports = extension
