const glob = require('fast-glob')
const gulp = require('gulp')
const replace = require('gulp-replace')
const { createTask } = require('../../development/build/task')

const getImportedPath = (path) => {
  const mmPath = path.split('brave/')[1]
  const braveStyleRelative = '../../../brave/'

  return `@import '${braveStyleRelative}${mmPath}';`
}

function createBraveLoadStylesTasks () {
  const styleTask = createTask('brave-styles', function () {
    const braveScss = 'brave/components/**/*.scss'
    const appRootScss = 'ui/app/css/index.scss'
    const braveImports = glob.sync(braveScss)
      .map(getImportedPath)

    return gulp.src(appRootScss)
      .pipe(
        replace(
          /(?:\/\*BRAVE\*\/.*)?$/,
          `/*BRAVE*/${braveImports.join('')}`
        )
      )
      .pipe(gulp.dest(file => file.base))
  })

  return styleTask
}

module.exports = createBraveLoadStylesTasks
