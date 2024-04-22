const {  service_view} = require('./service')

module.exports = {
  view: (req, res) => {
    let payload = { ...req.params, ...req.query }
    service_view(payload, (err, results) => {
      if (err) {
        return res.json({error: err})
      }
      return res.json({results: results})
    })
  },
}
