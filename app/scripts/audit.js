const { execSync } = require('child_process')

const prettyPrint = (advisories) => {
  advisories.forEach(({ severity, module_name }) => { // eslint-disable-line camelcase
    console.log(`Module Name: ${module_name} Severity: ${severity}`) // eslint-disable-line camelcase
  })
}

try {
  return execSync('yarn audit --json')
} catch (e) {
  const stdoutRaw = e.stdout.toString()
  const JSONLines = stdoutRaw.split('\n')

  const advisoryCount = {
    'low': 0,
    'moderate': 0,
    'high': 0,
  }
  // Approved exceptions only, in cases where
  // both a patch will likely not be available
  // and where the actual risk is low.
  const exceptions = []

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
  // Filter out exceptions
  }).filter((item) => {
    return item && !exceptions.includes(item['module_name'])
  })

  // Set advisory counts
  advisories.forEach(({ severity }) => {
    advisoryCount[severity] = ++advisoryCount[severity]
  })

  // If there are any moderate or high vulnerabilities, fail.
  if (advisoryCount.moderate || advisoryCount.high) {
    prettyPrint(advisories)
    throw new Error('Moderate or higher vulnerabilities found during yarn audit')
  }

  // If there are 10 or more low vulneravilities, fail.
  if (advisoryCount.low >= 10) {
    prettyPrint(advisories)
    throw new Error('10 or more low vulnerabilities identified')
  }

  // Extra info
  (({ low, moderate, high }) => {
    console.log(`Advisory counts: Low: ${low}, Moderate: ${moderate}, High: ${high}`)
  })(advisoryCount)

  console.log('-'.repeat(30))
  console.log('Audit complete')
  console.log('-'.repeat(30))

  return process.exit(0)
}
