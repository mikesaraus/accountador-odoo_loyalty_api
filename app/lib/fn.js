module.exports = {
  /**
   * Requests log filename generator
   *
   * @param {Date?} time                                                    Time from rfs filename generator
   * @param {Number | String?} index                                        Index from rfs filename generator
   * @param {{ ext: String?, prefix: String?, time: Boolean? }?} options    Format options
   */
  logFilenameFormat: (time, index = 0, options = { ext: 'log', prefix: '', time: false }) => {
    if (!time) time = new Date()
    const pad = (n) => String(n).padStart(2, 0)
    const yearmonth = time.getFullYear() + pad(time.getMonth() + 1)
    const day = pad(time.getDate())
    const hour = pad(time.getHours())
    const minute = pad(time.getMinutes())
    return `${options.prefix ? `${options.prefix}-` : ''}${yearmonth}-${day}${options.time ? `${hour}${minute}` : ''}${
      index >= 0 ? '.' + index : ''
    }.${options.ext ? (options.ext != 'log' ? 'log.' + options.ext : options.ext) : 'log'}`
  },
}
