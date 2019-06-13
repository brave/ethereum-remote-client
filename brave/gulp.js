const gulp = require('gulp')
const replace = require('gulp-replace')

/*
 * Brave
 */

const overrideDirs = [
  'ui/app/**/*',
  'app/scripts/**/*'
]

const bravePrefix = '~/brave/'

/*
 * ToDo(ryanml) - Write a method to convert simple paths to a Regex obj
 * then a simple mapping can be created for these replacements.
 * Ex (psuedo-ish):
 * const replacements = [
 *   {
 *     target: 'actions',
 *     replace: 'ui/app/store/actions'
 *   }
 * ]
 *
 * replacements.map((item) => {
 *   .pipe(
 *     replace(convertToRegex(item.target), fmtPath(item.replace))
 *   )
 * })
 */
module.exports = function () {
  return gulp.src(overrideDirs)
    .pipe(
      replace(
        /\'(.*)\/home\'/gm,
        `'${bravePrefix}ui/app/pages/home'`
      )
    )
    .pipe(
      replace(
        /\'\.\/routes\'/gm,
        `'${bravePrefix}ui/app/pages/routes'`
      )
    )
    .pipe(
      replace(
        /\'(.*)\/actions\'/gm,
        `'${bravePrefix}ui/app/store/actions'`
      )
    )
    .pipe(
      replace(
        /\'(.*)\/preferences\'/gm,
        `'${bravePrefix}app/scripts/controllers/preferences'`
      )
    )
    .pipe(
      replace(
        /\'(.*)\/metamask-controller\'/gm,
        `'${bravePrefix}app/scripts/metamask-controller'`
      )
    )
    .pipe(
      replace(
        /\'(.*)\/metamask\/metamask\'/gm,
        `'${bravePrefix}ui/app/ducks/metamask/metamask'`
      )
    )
    .pipe(
      replace(
        /\'(.*)\/components\/menu\'/gm,
        `'${bravePrefix}ui/app/components/app/dropdowns/components/menu'`
      )
    )
    .pipe(
      replace(
        /\'(.*)\/token-menu-dropdown\.js\'/gm,
        `'${bravePrefix}ui/app/components/app/dropdowns/token-menu-dropdown'`
      )
    )
    .pipe(gulp.dest(file => file.base))
}
