'use strict'

const createScore = require('./create')

const test = item => item.model && item.year

const getKey = (item, serializeProp, logMissing) => {
  let key = ''
  // we added brand because model implies brand.
  key += serializeProp(key, item.brand)
  key += serializeProp(key, item.model)
  key += serializeProp(key, item.year)
  return key
}

module.exports = ({ log, propName, data }) =>
  createScore({ data, test, getKey, propName, log })
