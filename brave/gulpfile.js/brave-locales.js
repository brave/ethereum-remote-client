const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')
const braveEnLocales = require('../app/_locales/en/messages.json')

const createBraveLocalesTask = () => {
  const writeArgs = { overwrite: true }

  gulp.task('locales:brave', function () {
    return gulp.src('./dist/brave/_locales/**/*')
    .pipe(jsoneditor(function (json) {
      Object.keys(json).forEach((stringName) => {
        if (typeof json[stringName].message === 'string') {
          json[stringName].message = json[stringName].message.replace(/MetaMask/gi, 'Brave')
        }
        if (typeof json[stringName].description === 'string') {
          json[stringName].description = json[stringName].description.replace(/MetaMask/gi, 'Brave')
        }
      })
      return json
    }))
    .pipe(gulp.dest('./dist/brave/_locales', writeArgs))
  })

  gulp.task('load-en:brave', function () {
    return gulp.src('./dist/brave/_locales/en/messages.json')
      .pipe(jsoneditor(function (json) {
        return {
          ...json,
          ...braveEnLocales,
        }
      }))
      .pipe(gulp.dest('./dist/brave/_locales/en', writeArgs))
  })
}

module.exports = createBraveLocalesTask
