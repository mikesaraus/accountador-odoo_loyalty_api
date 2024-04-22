
/**
 *
 * @param {*} origin  String to check
 * @returns {Boolean}       True if origin is valid or undefined
 */
const verifyOrigin = (origin) => {
  return typeof origin === 'undefined' ||
    (whitelistServers.length === 1 && whitelistServers[0] === '*') ||
    whitelistServers.indexOf(origin) !== -1
    ? true
    : false
}

module.exports = {
    verifyOrigin,

    appCorsOption: (origin, callback) => {
      if (verifyOrigin(origin)) {
        callback(null, true)
      } else {
        console.log('Request Blocked', JSON.stringify(origin))
        callback('Not allowed by CORS')
      }
    },
}
