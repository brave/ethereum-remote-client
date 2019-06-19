const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')

const createBraveManifestTask = () =>
  gulp.task('manifest:brave', function () {
    return gulp.src('./dist/brave/manifest.json')
    .pipe(jsoneditor(function (json) {
      delete json.applications
      delete json.browser_action
      delete json.commands._execute_browser_action
      json.author = 'https://brave.com'
      return json
    }))
    .pipe(gulp.dest('./dist/brave', { overwrite: true }))
  })

module.exports = createBraveManifestTask
