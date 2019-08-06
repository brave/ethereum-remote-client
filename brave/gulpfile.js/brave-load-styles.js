const glob = require('glob')
const gulp = require('gulp')
const replace = require('gulp-replace')
const watch = require('gulp-watch')

const getImportedPath = (path) => {
  const mmPath = path.split('brave/')[1]
  const braveStyleRelative = '../../../../brave/'

  return `@import '${braveStyleRelative}${mmPath}';`
}

const createBraveLoadStylesTasks = () => {
  const braveScss = 'brave/ui/app/**/*.scss'
  const appRootScss = 'ui/app/components/app/index.scss'

  function writeStyles () {
    const braveImports = glob.sync(braveScss)
      .map(getImportedPath)

    return gulp.src(appRootScss)
      .pipe(
        replace(
          // looks for "/* BRAVE */<oldimports>" at the
          // end of the file and replaces it if it's
          // there, otherwise just appends to the file
          /(?:\/\*BRAVE\*\/.*)?$/,
          `/*BRAVE*/${braveImports.join('')}`
        )
      )
      .pipe(gulp.dest(file => file.base))
  }

  gulp.task('load-brave-styles', function () {
    return writeStyles()
  })

  gulp.task('dev:load-brave-styles', function () {
    watch(braveScss, () => {
      writeStyles()
    })

    return writeStyles()
  })
}

module.exports = createBraveLoadStylesTasks
