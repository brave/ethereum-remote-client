/* The migrator has two methods the user should be concerned with:
 *
 * getData(), which returns the app-consumable data object
 * saveData(), which persists the app-consumable data object.
 */

// Migrations must start at version 1 or later.
// They are objects with a `version` number
// and a `migrate` function.
//
// The `migrate` function receives the previous
// config data format, and returns the new one.

const migrations = [
  require('./002').default,
  require('./003').default,
  require('./004').default,
  require('./005').default,
  require('./006').default,
  require('./007').default,
  require('./008').default,
  require('./009').default,
  require('./010').default,
  require('./011').default,
  require('./012').default,
  require('./013').default,
  require('./014').default,
  require('./015').default,
  require('./016').default,
  require('./017').default,
  require('./018').default,
  require('./019').default,
  require('./020').default,
  require('./021').default,
  require('./022').default,
  require('./023').default,
  require('./024').default,
  require('./025').default,
  require('./026').default,
  require('./027').default,
  require('./028').default,
  require('./029').default,
  require('./030').default,
  require('./031').default,
  require('./032').default,
  require('./033').default,
  require('./034').default,
  require('./035').default,
  require('./036').default,
  require('./037').default,
  require('./038').default,
  require('./039').default,
  require('./040').default,
  require('./041').default,
  require('./042').default,
  require('./043').default,
  require('./044').default,
  require('./045').default,
  require('./046').default,
  require('./047').default,
  require('./048').default,
]

export default migrations
