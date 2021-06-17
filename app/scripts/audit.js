const { execSync } = require('child_process')

// Ping security team before adding to ignoredAdvisories
const ignoredAdvisories = [
  786, // braces: RxDoS
  877, // web3: no fix available
  1693, // postcss: Regular Expression Denial of Service
  1751, // glob-parent: Regular expression denial of service
  1755, // normalize-url: Regular Expression Denial of Service
  1754, // css-what: Denial of Service
  1753, // trim-newlines: Regular Expression Denial of Service
  1748, // ws: Regular Expression Denial of Service
  1747, // browserslist: Regular Expression Denial of Service
]
const prettyPrint = (advisories) => {
  advisories.forEach(({ url, module_name }) => { // eslint-disable-line camelcase
    console.log(`Module: ${module_name} ${url}`) // eslint-disable-line camelcase
  })
}

try {
  return execSync('yarn audit --json')
} catch (e) {
  const stdoutRaw = e.stdout.toString()
  const JSONLines = stdoutRaw.split('\n')

  // There is erroneous data that is not valid JSON that
  // yarn can produce, as they do not echo out a valid JSON
  // blob with this flag. Its format is json-lines as opposed
  // to pure JSON
  const advisories = JSONLines.filter((line) => {
    try {
      JSON.parse(line)
    } catch {
      return false
    }
    return true
  // Extra data.advisory for later convenience
  }).map((line) => {
    return JSON.parse(line).data.advisory
  }).filter((item) => item && item.id && !ignoredAdvisories.includes(item.id))

  console.log('Ignoring NPM advisories:', ignoredAdvisories)

  if (advisories.length) {
    prettyPrint(advisories)
    console.log('Audit failed')
    return process.exit(1)
  }

  console.log('-'.repeat(30))
  console.log('Audit complete')
  console.log('-'.repeat(30))

  return process.exit(0)
}
