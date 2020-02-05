const gulp = require('gulp')
const {copyTask, gulpParallel} = require('./common-gulp')
const createBraveManifestTask = require('./brave-manifest')
const createBravePublishTask = require('./brave-publish')
const createBraveLocalesTask = require('./brave-locales')
const createBraveHTMLTask = require('./brave-html')
const {createBraveReplaceLinksTask, createBraveReplacePathsTask} = require('./brave-replace-paths')
const createBraveLoadStylesTasks = require('./brave-load-styles')
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
createBraveReplaceLinksTask()
createBraveReplacePathsTask()
createBraveLocalesTask()
createBraveHTMLTask()
createBravePublishTask()
createBraveLoadStylesTasks()

gulp.task('copy',
  gulp.series(
    gulp.parallel(...copyTaskNames, 'copy:images:brave', 'copy:fonts:brave'),
    'manifest:production',
    gulp.parallel('manifest:brave', 'locales:brave', 'html:brave')
  )
)

gulp.task('dev:copy',
  gulp.series(
    gulp.parallel(...copyDevTaskNames, 'dev:copy:images:brave', 'dev:copy:fonts:brave'),
    gulp.parallel('manifest:brave', 'locales:brave', 'html:brave')
  )
)

gulp.task('test:copy',
  gulp.series(
    gulp.parallel(...copyDevTaskNames),
    gulp.parallel('manifest:brave', 'locales:brave', 'html:brave'),
    'manifest:testing'
  )
)

gulp.task('build',
  gulp.series(
    'clean',
    'load-brave-styles',
    'replace-brave-links',
    'replace-brave-paths',
    'build:scss',
    'build:extension:js',
    'build:extension:js:deps:background',
    'build:extension:js:deps:ui',
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
    'dev:load-brave-styles',
    'replace-brave-links',
    'replace-brave-paths',
    'clean',
    'dev:scss',
    gulp.parallel(
      'dev:extension:js',
      'build:extension:js:deps:background',
      'dev:copy',
      'dev:reload'
    )
  )
)

gulp.task('publish:brave', gulp.series('dist', 'publish:package.json'))
