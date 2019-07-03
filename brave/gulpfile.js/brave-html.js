const gulp = require('gulp')
const replace = require('gulp-replace')

const createBraveHTMLTask = () =>
  gulp.task('html:brave', function () {
    return gulp.src('./dist/brave/**/*.html')
      .pipe(replace(/<title>MetaMask<\/title>/g, '<title>Crypto Wallets</title>'))
      .pipe(replace(/MetaMask/g, 'Brave'))
      .pipe(gulp.dest('./dist/brave/', { overwrite: true }))
  })

module.exports = createBraveHTMLTask
