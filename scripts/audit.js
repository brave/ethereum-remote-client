const execSync = require('child_process').execSync

// Yarn audit status codes:
//
// Only moderate warnings and above should be taken in to consideration
//
// 1 - INFO
// 2 - LOW
// 4 - MODERATE
// 8 - HIGH
// 16 - CRITICAL

try {
  return execSync('yarn audit')
} catch (e) {
  const stdout = e.stdout.toString()

  if (e.status >= 4) {
    console.log(stdout)
    throw new Error('Moderate or higher vulnerabilities found during yarn audit')
  }

  const numLowVulns = stdout.match(/Package\b/g).length

  if (numLowVulns >= 10) {
    console.log(stdout)
    throw new Error(`10 or more low vulnerabilities identified`)
  }

  console.log('-'.repeat(30))
  console.log('Audit complete')
  console.log('-'.repeat(30))

  return process.exit(0)
}
