const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')
const { createTask } = require('./task')

function createBravePublishTasks () {
  const bravePublishTask = createTask('brave-publish', function () {
    return gulp.src('./package.json')
      .pipe(jsoneditor(function (json) {
        delete json.private
        delete json.browserify
        json.devDependencies = {}
        json.dependencies = {}
        json.scripts = {}
        return json
      }))
      .pipe(gulp.dest('./dist/brave', { overwrite: true }))
  })

  return bravePublishTask
}

module.exports = createBravePublishTasks
