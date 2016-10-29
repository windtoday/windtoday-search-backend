'use strict'

const identifyCategory = require('./category')
const { get, merge, noop } = require('lodash')
const categories = require('../category')
const createLogger = require('../log')
const noopIdentifier = () => noop
const identify = require('.')

function createCategoryLogger (loggerKeyword, category) {
  return createLogger(`${loggerKeyword}_${category}_unidentify`)
}

/**
 * It autodetect the category based on keywords matching
 * and it applies the specific extractor.
 */
function createAutodetection (loggerKeyword) {
  function autodetect (str) {
    const category = identifyCategory(str)
    const identifier = get(identify, categories.singular(category), noopIdentifier)
    const log = createCategoryLogger(loggerKeyword, category)
    const detection = identifier(log)(str)
    return merge({ category }, detection)
  }

  return autodetect
}

module.exports = createAutodetection
