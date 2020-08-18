const gulp = require('gulp')
const watch = require('gulp-watch')
const livereload = require('gulp-livereload')
const { createTask } = require('../../development/build/task')

function copyTask (taskName, opts) {
  const source = opts.source
  const destination = opts.destination
  const destinations = opts.destinations || [destination]
  const pattern = opts.pattern || '/**/*'
  const devMode = opts.devMode

  return createTask(taskName, function () {
    if (devMode) {
      watch(source + pattern, (event) => {
        livereload.changed(event.path)
        performCopy()
      })
    }

    return performCopy()
  })

  function performCopy () {
    let stream = gulp.src(source + pattern, { base: source })

    destinations.forEach(function (destination) {
      stream = stream.pipe(gulp.dest(destination))
    })

    return stream
  }
}

const imagesTask = copyTask('brave-images', {
  devMode: true,
  source: './brave/images/',
  destinations: ['./dist/brave/images'],
})

const fontsTask = copyTask('brave-fonts', {
  devMode: true,
  source: './brave/fonts/',
  destinations: ['./dist/brave/fonts'],
})

const imagesTaskProd = copyTask('brave-images-prod', {
  source: './brave/images/',
  destinations: ['./dist/brave/images'],
})

const fontsTaskProd = copyTask('brave-fonts-prod', {
  source: './brave/fonts/',
  destinations: ['./dist/brave/fonts'],
})

module.exports = { fontsTask, imagesTask, fontsTaskProd, imagesTaskProd }
