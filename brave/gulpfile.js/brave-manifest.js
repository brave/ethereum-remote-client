const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')

const createBraveManifestTask = () =>
  gulp.task('manifest:brave', function () {
    return gulp.src('./dist/brave/manifest.json')
    .pipe(jsoneditor(function (json) {
      delete json.applications
      delete json.browser_action
      delete json.commands._execute_browser_action
      json.name = 'Crypto Wallets'
      json.author = 'https://brave.com'
      json.key = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl7ZLkqbq8pHRcYANANXmhGKZKHsruBqS0ssf8aI5R5E5FBaWui73FPWMj0g4eggrJeSfF/x/nIIq3Z24Joq1ULuWtheQjbOwqj0yL2ZaxMA6rc5cW2OmGZ0aNXMFclusXftJmwpb/pztHzw55yv8BfJr873HOxtlW2MP1VvSFQjigsbJedlkoS4SKC0U3j8/mjAYR0+lpmBtPitObnYnM5qmtrlg2hgm+sqAon9WKj9nDIjPpXJaCs7kpVl7oQOoYpv47ZT1tnu0o03AL3RZbxPU1N04X3JN6nC+g4gaCgiLkZ+dD79yIt7Il0+vSKuJ+EGySVmv6czOI5eJYezWXwIDAQAB'
      // Version is controlled by brave-core-crx-packager via string replace for 0.0.0
      json.version = '0.0.0'
      return json
    }))
    .pipe(gulp.dest('./dist/brave', { overwrite: true }))
  })

module.exports = createBraveManifestTask
