const gulp = require('gulp')
const {copyTask, gulpParallel} = require('./common-gulp')
const createBraveManifestTask = require('./brave-manifest')
const createBravePublishTask = require('./brave-publish')
const createBraveLocalesTask = require('./brave-locales')
const createBraveReplacePathsTask = require('./brave-replace-paths')
require('../../gulpfile.js')

const copyTaskNames = Object.keys(gulp._registry._tasks).filter((x) => x.startsWith('copy:') && !x.startsWith('copy:images'))
const copyDevTaskNames = Object.keys(gulp._registry._tasks).filter((x) => x.startsWith('dev:copy:') && !x.startsWith('dev:copy:images'))

copyTask('copy:images:brave', {
  source: './brave/app/images/',
  destinations: ['./dist/brave/images'],
})

copyTask('dev:copy:images:brave', {
  devMode: true,
  source: './brave/app/images/',
  destinations: ['./dist/brave/images'],
})

copyTask('copy:fonts:brave', {
  source: './brave/app/fonts/',
  destinations: ['./dist/brave/fonts'],
})

copyTask('dev:copy:fonts:brave', {
  devMode: true,
  source: './brave/app/fonts/',
  destinations: ['./dist/brave/fonts'],
})

createBraveManifestTask()
createBraveReplacePathsTask()
createBraveLocalesTask()
createBravePublishTask()

gulp.task('copy',
  gulp.series(
    gulp.parallel(...copyTaskNames, 'copy:images:brave', 'copy:fonts:brave'),
    'manifest:production',
    gulp.parallel('manifest:brave', 'locales:brave')
  )
)

gulp.task('dev:copy',
  gulp.series(
    gulp.parallel(...copyDevTaskNames, 'dev:copy:images:brave', 'dev:copy:fonts:brave'),
    gulp.parallel('manifest:brave', 'locales:brave')
  )
)

gulp.task('test:copy',
  gulp.series(
    gulp.parallel(...copyDevTaskNames),
    gulp.parallel('manifest:brave', 'locales:brave'),
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

gulp.task('publish:brave', gulp.series('dist', 'publish:package.json'))
