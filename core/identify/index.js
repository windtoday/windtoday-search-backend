'use strict'

const categorySingular = require('../category').singular
const createLogger = require('../log')

const identify = {
  autodetection: require('./autodetection'),
  board: require('./board'),
  boom: require('./boom'),
  fin: require('./fin'),
  mast: require('./mast'),
  price: require('./price'),
  sail: require('./sail'),
  year: require('./year'),
  other: require('./other')
}

function createIdentify (opts) {
  const { path, log } = opts
  const logKeyword = log.keyword

  switch (path) {
    case 'sails':
    case 'boards':
    case 'masts':
    case 'booms':
    case 'fins':
      const category = categorySingular(path)
      const identifyLog = createLogger(`${logKeyword}_unidentify`)
      return identify[category](identifyLog)
    default:
      const autodetectionLogger = createLogger(`${logKeyword}_${path}`)
      return identify.autodetection(autodetectionLogger)
  }
}

Object.keys(identify).forEach(key => {
  createIdentify[key] = identify[key]
})

module.exports = createIdentify
