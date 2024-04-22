const router = require('express').Router(),

  paths = require('./router')

try {
  paths.forEach((_newRoute) => {
    _newRoute.methods.forEach((_method) => {
      router[_method.toLowerCase()](_newRoute.path, _newRoute.handlers)
    })
  })
} catch (e) {
  console.error(JSON.stringify(e))
}

module.exports = router
