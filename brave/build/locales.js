const gulp = require('gulp')
const jsoneditor = require('gulp-json-editor')
const through = require('through2')
const { createTask } = require('../../development/build/task.js')

const replace12With24 = (str) => {
  const twelveRegex = /twelve|12|doce|बारह|douz|dodici|dwunastu|dvanajst|สิบสอง|பன்னிரண்டு/gi
  const result = str.replace(twelveRegex, '24').replace('twaalfwoordfrase', 'vierentwintigwoordfrase')
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

function createBraveLocalesTasks () {
  const writeArgs = { overwrite: true }

  const stringTask = createTask('brave-replace-strings', function () {
    return gulp.src('./dist/brave/_locales/**/*')
      .pipe(jsoneditor(function (json) {
        Object.keys(json).forEach((stringName) => {
          if (stringName !== 'metamaskImportSubText' && typeof json[stringName].message === 'string') {
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

  const combineTask = createTask('brave-combine-strings', function () {
    const currentTask = {}
    return gulp.src('./dist/brave/_locales/**/messages.json')
      .pipe(through.obj(function (file, _enc, cb) {
        currentTask.relativeFilePath = file.relative
        cb(null, file)
      }))
      .pipe(jsoneditor(function (json) {
        const braveLocale = require(`../_locales/${currentTask.relativeFilePath}`) // eslint-disable-line no-undef, import/no-dynamic-require, global-require
        return {
          ...json,
          ...braveLocale,
        }
      }))
      .pipe(gulp.dest('./dist/brave/_locales', writeArgs))
  })

  return { stringTask, combineTask }
}

module.exports = createBraveLocalesTasks
