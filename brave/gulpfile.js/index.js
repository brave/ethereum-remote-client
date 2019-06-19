const gulp = require('gulp')
const {copyTask, gulpParallel} = require('./common-gulp')
const createBraveReplacePathsTask = require('./brave-replace-paths')
require('../../gulpfile.js')

const copyTaskNames = Object.keys(gulp._registry._tasks).filter((x) => x.startsWith('copy:'))
const copyDevTaskNames = Object.keys(gulp._registry._tasks).filter((x) => x.startsWith('dev:copy:'))

createBraveReplacePathsTask()

gulp.task('copy',
  gulp.series(
    gulp.parallel(...copyTaskNames),
    'manifest:production',
  )
)

gulp.task('dev:copy',
  gulp.series(
    gulp.parallel(...copyDevTaskNames),
  )
)

gulp.task('test:copy',
  gulp.series(
    gulp.parallel(...copyDevTaskNames),
    'manifest:testing'
  )
)

gulp.task('build',
  gulp.series(
    'clean',
    'replace-brave-paths',
    'build:scss',
    gulpParallel(
      'build:extension:js:uideps',
      'build:extension:js',
    ),
    'copy'
  )
)

gulp.task('dist',
  gulp.series(
    'build',
  )
)

gulp.task('dev:extension',
  gulp.series(
    'replace-brave-paths',
    'clean',
    'dev:scss',
    gulp.parallel(
      'dev:extension:js',
      'dev:copy',
      'dev:reload'
    )
  )
)
