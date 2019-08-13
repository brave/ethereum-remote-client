const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')
const braveEnLocales = require('../app/_locales/en/messages.json')

const replace12With24 = (str) => {
  // regex to match the world 'twelve' in languages supported by Metamask
  const twelveRegex = /twelve|12|doce|बारह|douz|dodici|dwunastu|dvanajst|สิบสอง|பன்னிரண்டு/gi
  let result = str.replace(twelveRegex, '24').replace('twaalfwoordfrase', 'vierentwintigwoordfrase')
  // handle cases like 'doce (12)' which become '24 (24)'
  return result.replace(' (24)', '')
}

const replaceMetaMask = (str) => {
  return str
    .replace(/metamask\.io/gi, 'brave.com')
    .replace(/MetaMask/gi, 'Brave')
}

const createBraveLocalesTask = () => {
  const writeArgs = { overwrite: true }

  gulp.task('locales:brave', function () {
    return gulp.src('./dist/brave/_locales/**/*')
    .pipe(jsoneditor(function (json) {
      Object.keys(json).forEach((stringName) => {
        if (typeof json[stringName].message === 'string') {
          json[stringName].message = replaceMetaMask(json[stringName].message)
          if (stringName !== 'symbolBetweenZeroTwelve') {
            json[stringName].message = replace12With24(json[stringName].message)
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
