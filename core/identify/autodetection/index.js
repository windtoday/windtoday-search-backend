'use strict'

const getIdentifiers = require('./identifiers')
const getCategories = require('../category')
const { assign } = require('lodash')
const flow = require('./flow')

function createAutodetection (loggerKeyword) {
  function autodetect (str) {
    const {data, output} = getCategories(str)
    const identifiers = getIdentifiers(data)
    const detection = flow(output, loggerKeyword, identifiers)

    detection.data.category = data
    assign(detection.data, {category: data})
    return detection
  }

  return autodetect
}

module.exports = createAutodetection
