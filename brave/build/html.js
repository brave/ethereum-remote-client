const gulp = require('gulp')
const replace = require('gulp-replace')
const { createTask } = require('../../development/build/task')

function createBraveHTMLTasks () {
  const htmlTask = createTask('brave-html', function () {
    return gulp.src('./dist/brave/**/*.html')
      .pipe(replace(/<title>MetaMask<\/title>/g, '<title>Crypto Wallets</title>'))
      .pipe(replace(/MetaMask/g, 'Brave'))
      .pipe(gulp.dest('./dist/brave/', { overwrite: true }))
  })

  return htmlTask
}

module.exports = createBraveHTMLTasks
