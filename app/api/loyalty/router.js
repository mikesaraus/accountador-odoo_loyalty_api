const { view, create } = require('./controller')

// Add New Route Here
module.exports = [
  {
    methods: ['get'],
    path: '/',
    handlers: [view],
  },
]
