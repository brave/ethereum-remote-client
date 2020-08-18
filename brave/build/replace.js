const gulp = require('gulp')
const replace = require('gulp-replace')
const { createTask } = require('../../development/build/task')

function createBraveReplaceTasks () {
  const replaceTask = createTask('brave-replace', function () {
    return gulp.src(['ui/app/**/*.js'])
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015489591-Basic-Safety-Tips/gm,
          'https://support.brave.com/hc/en-us/articles/360034535452-How-can-I-add-my-other-Crypto-Wallets-to-Brave-',
        ),
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015289932/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-',
        ),
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015489031/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-',
        ),
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-',
        ),
      )
      .pipe(
        replace(
          /https:\/\/metamask\.zendesk\.com\/hc\/en-us\/articles\/360015489331-Importing-an-Account/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-',
        ),
      )
      .pipe(
        replace(
          /https:\/\/medium\.com\/metamask\/introducing-privacy-mode-42549d4870fa/gm,
          'https://support.brave.com/hc/en-us/articles/360035488071-How-do-I-manage-my-Crypto-Wallets-',
        ),
      )
      .pipe(gulp.dest((file) => file.base))
  })

  return replaceTask
}

module.exports = createBraveReplaceTasks
