const ExtensionPlatform = require('../../../../app/scripts/platforms/extension')
const getCallerFile = require('get-caller-file');

module.exports = class BraveExtensionPlatform extends ExtensionPlatform {

  openExtensionInBrowser () {
    const file = getCallerFile()

    // Blocks first time opening of new tab
    if (!file.endsWith('background.js')) {
      super.openExtensionInBrowser()
    }
  }
}
