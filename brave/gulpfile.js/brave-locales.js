const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')
const through = require('through2')

const replace12With24 = (str) => {
  // regex to match the world 'twelve' in languages supported by Metamask
  const twelveRegex = /twelve|12|doce|बारह|douz|dodici|dwunastu|dvanajst|สิบสอง|பன்னிரண்டு/gi
  const result = str.replace(twelveRegex, '24').replace('twaalfwoordfrase', 'vierentwintigwoordfrase')
  // handle cases like 'doce (12)' which become '24 (24)'
  return result.replace(' (24)', '')
}

const replaceMetaMask = (str) => {
  return str
    .replace(/metamask\.io/gi, 'brave.com')
    .replace(/MetaMask/gi, 'Brave')
}

const removeLearnMore = (str) => {
  return str
    .replace(/ Learn more./gi, '')
}

const createBraveLocalesTask = () => {
  const writeArgs = { overwrite: true }

  gulp.task('replace-brave-strings', function () {
    return gulp.src('./dist/brave/_locales/**/*')
      .pipe(jsoneditor(function (json) {
        Object.keys(json).forEach((stringName) => {
          if (typeof json[stringName].message === 'string') {
            json[stringName].message = replaceMetaMask(json[stringName].message)
            if (stringName !== 'symbolBetweenZeroTwelve') {
              json[stringName].message = replace12With24(json[stringName].message)
            }
            if (stringName === 'endOfFlowMessage8') {
              json[stringName].message = removeLearnMore(json[stringName].message)
            }
          }
          if (typeof json[stringName].description === 'string') {
            json[stringName].description = replaceMetaMask(json[stringName].description)
          }
        })
        return json
      }))
      .pipe(gulp.dest('./dist/brave/_locales', writeArgs))
  })

  gulp.task('combine-with-brave-strings', function () {
    const currentTask = {}
    return gulp.src('./dist/brave/_locales/**/messages.json')
      .pipe(through.obj(function (file, _enc, cb) {
        // This is such as fr/messages.json
        currentTask.relativeFilePath = file.relative
        cb(null, file)
      }))
      .pipe(jsoneditor(function (json) {
        const braveLocale = require(`../app/_locales/${currentTask.relativeFilePath}`)
        return {
          ...json,
          ...braveLocale,
        }
      }))
      .pipe(gulp.dest('./dist/brave/_locales', writeArgs))
  })

  gulp.task('locales:brave', gulp.series('replace-brave-strings', 'combine-with-brave-strings'))
}

module.exports = createBraveLocalesTask
