const gulp = require('gulp')
const gulpMultiProcess = require('gulp-multi-process')
const livereload = require('gulp-livereload')
const watch = require('gulp-watch')

function createCopyTasks (label, opts) {
  if (!opts.devOnly) {
    const copyTaskName = `copy:${label}`
    copyTask(copyTaskName, opts)
  }
  const copyDevTaskName = `dev:copy:${label}`
  copyTask(copyDevTaskName, Object.assign({ devMode: true }, opts))
}

function copyTask (taskName, opts) {
  const source = opts.source
  const destination = opts.destination
  const destinations = opts.destinations || [destination]
  const pattern = opts.pattern || '/**/*'
  const devMode = opts.devMode

  return gulp.task(taskName, function () {
    if (devMode) {
      watch(source + pattern, (event) => {
        livereload.changed(event.path)
        performCopy()
      })
    }

    return performCopy()
  })

  function performCopy () {
    // stream from source
    let stream = gulp.src(source + pattern, { base: source })

    // copy to destinations
    destinations.forEach(function (destination) {
      stream = stream.pipe(gulp.dest(destination))
    })

    return stream
  }
}

function gulpParallel (...args) {
  return function spawnGulpChildProcess (cb) {
    return gulpMultiProcess(args, cb, true)
  }
}

module.exports = {
  createCopyTasks,
  copyTask,
  gulpParallel
}
