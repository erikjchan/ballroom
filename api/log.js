
/**
 * A logger we can turn on and off
 */

const DEBUG_LEVEL = 1;

module.exports = level => msg => {
  if (DEBUG_LEVEL === level) console.log(msg)
}
