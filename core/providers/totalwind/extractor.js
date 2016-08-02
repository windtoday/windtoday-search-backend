'use strict'

var isBlacklisted = require('../../schema/is-blacklisted')
var extract = require('../../extract')
var lodash = require('lodash')

var CONST = {
  SOURCE_NAME: 'totalwind',
  IGNORE_LOG_PROPS: ['updatedAt', 'createdAt', 'link', 'title', 'provider']
}

function createExtractor (type, category) {
  function extractor (data) {
    if (isBlacklisted(data.title)) return

    data.type = type
    data.provider = CONST.SOURCE_NAME
    data.category = category

    var raw = lodash.lowerCase(data.title)

    var dataExtract = {
      price: extract.price(raw),
      year: extract.year(raw)
    }

    if (lodash.isEqual(category, 'sails'))
      lodash.assign(dataExtract, extract.sail(raw))

    lodash.merge(data, dataExtract)

    var self = this

    this.validate(data, function (validationError, instance) {
      ++self.stats.total
      if (!validationError) {
        self.log.info(lodash.omit(instance, CONST.IGNORE_LOG_PROPS))
        ++self.stats.valid
        var category = instance.category
        if (self.db[category]) {
          ++self.stats.add
          self.db[category].addObject(instance)
        }
      } else {
        self.log.debug(validationError)
      }
    })
  }

  return extractor
}

module.exports = createExtractor