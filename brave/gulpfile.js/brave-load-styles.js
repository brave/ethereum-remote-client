const glob = require('glob')
const gulp = require('gulp')
const replace = require('gulp-replace')

const getImportedPath = (path) => {
  const mmPath = path.split('brave/')[1]
  const braveStyleRelative = '../../../../brave/'

  return `@import '${braveStyleRelative}${mmPath}';`
}

const createBraveLoadStylesTask = () => {
  const braveScss = 'brave/ui/app/**/*.scss'
  const appRootScss = 'ui/app/components/app/index.scss'

  const braveImports = glob.sync(braveScss)
    .map(path => getImportedPath(path))

  gulp.task('load-brave-styles', function () {
    return gulp.src(appRootScss)
      .pipe(
        replace(
          /@import 'ui-migration-annoucement\/index';/gm,
          `@import 'ui-migration-annoucement/index'; ${braveImports.join('')}`
        )
      )
      .pipe(gulp.dest(file => file.base))
  })
}

module.exports = createBraveLoadStylesTask
