const gulp = require('gulp')
const replace = require('gulp-replace')

/*
 * This task allows us to avoid unecessary large component
 * overrides when a simple href attribute just needs to be replaced
 */
const createBraveReplaceLinksTask = () => {
  gulp.task('replace-brave-links', function () {
    return gulp.src(['ui/app/**/*'])
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015489591-Basic-Safety-Tips/gm,
          'https://support.brave.com/hc/en-us/articles/360034535452-How-can-I-add-my-other-Crypto-Wallets-to-Brave-'
        )
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015289932/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-'
        )
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015489031/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-'
        )
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015489331-Importing-an-Account/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-'
        )
      )
      .pipe(
        replace(
          /https:\/\/medium\.com\/metamask\/introducing-privacy-mode-42549d4870fa/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-'
        )
      )
      .pipe(gulp.dest(file => file.base))
  })
}

const createBraveReplacePathsTask = () => {
  const overrideDirs = [
    'ui/app/**/*',
    'app/scripts/**/*',
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
  gulp.task('replace-brave-paths', function () {
    return gulp.src(overrideDirs)
      .pipe(
        replace(
          /'(.*)\/home'/gm,
          `'${bravePrefix}ui/app/pages/home'`
        )
      )
      .pipe(
        replace(
          /'\.\/routes'/gm,
          `'${bravePrefix}ui/app/pages/routes'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/actions'/gm,
          `'${bravePrefix}ui/app/store/actions'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/preferences'/gm,
          `'${bravePrefix}app/scripts/controllers/preferences'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/metamask-controller'/gm,
          `'${bravePrefix}app/scripts/metamask-controller'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/metamask\/metamask'/gm,
          `'${bravePrefix}ui/app/ducks/metamask/metamask'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/components\/menu'/gm,
          `'${bravePrefix}ui/app/components/app/dropdowns/components/menu'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/token-menu-dropdown\.js'/gm,
          `'${bravePrefix}ui/app/components/app/dropdowns/token-menu-dropdown'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/select-action\.component'/gm,
          `'${bravePrefix}ui/app/pages/first-time-flow/select-action/select-action.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/lib\/backend-metametrics'/gm,
          `'${bravePrefix}app/scripts/lib/backend-metametrics'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/security-tab\.component'/gm,
          `'${bravePrefix}ui/app/pages/settings/security-tab/security-tab.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/welcome\.component'/gm,
          `'${bravePrefix}ui/app/pages/first-time-flow/welcome/welcome.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/select-action\.component'/gm,
          `'${bravePrefix}ui/app/pages/first-time-flow/welcome/welcome.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/constants\/routes'/gm,
          `'${bravePrefix}ui/app/helpers/constants/routes'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/lib\/setupMetamaskMeshMetrics'/gm,
          `'${bravePrefix}app/scripts/lib/setupMetamaskMeshMetrics'`
        )
      )
      .pipe(
        replace(
          /'extensionizer'/gm,
          `'${bravePrefix}lib/extensionizer'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/metafox-logo\.component'/gm,
          `'${bravePrefix}ui/app/components/ui/metafox-logo/metafox-logo.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/mascot'/gm,
          `'${bravePrefix}ui/app/components/ui/mascot'`
        )
      )
      .pipe(
        replace(
          /\} from '\.\/new-account\.component'/gm,
          `} from '${bravePrefix}ui/app/pages/first-time-flow/create-password/new-account/new-account.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/import-with-seed-phrase\.component'/gm,
          `'${bravePrefix}ui/app/pages/first-time-flow/create-password/import-with-seed-phrase/import-with-seed-phrase.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/confirm-seed-phrase\.component'/gm,
          `'${bravePrefix}ui/app/pages/first-time-flow/seed-phrase/confirm-seed-phrase/confirm-seed-phrase.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/keychains\/restore-vault'/gm,
          `'${bravePrefix}ui/app/pages/keychains/restore-vault'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/networks-tab\.constants'/gm,
          `'${bravePrefix}ui/app/pages/settings/networks-tab/networks-tab.constants'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/controllers\/infura'/gm,
          `'${bravePrefix}app/scripts/controllers/infura'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/setupSentry'/gm,
          `'${bravePrefix}app/scripts/lib/setupSentry'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/reveal-seed-phrase\.component'/gm,
          `'${bravePrefix}ui/app/pages/first-time-flow/seed-phrase/reveal-seed-phrase/reveal-seed-phrase.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/advanced-tab\.component'/gm,
          `'${bravePrefix}ui/app/pages/settings/advanced-tab/advanced-tab.component'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/connect-screen'/gm,
          `'${bravePrefix}ui/app/pages/create-account/connect-hardware/connect-screen'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/threebox'/gm,
          `'${bravePrefix}app/scripts/controllers/threebox'`
        )
      )
      .pipe(
        replace(
          /'(.*)\/unlock-page\.container'/gm,
          `'${bravePrefix}ui/app/pages/unlock-page/unlock-page.container'`
        )
      )
      .pipe(
        replace(
          /\'(.*)\/app-header\'/gm,
          `'${bravePrefix}ui/app/components/app/app-header'`
        )
      )
      .pipe(gulp.dest(file => file.base))
  })
}

module.exports = { createBraveReplaceLinksTask, createBraveReplacePathsTask }
