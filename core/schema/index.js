'use strict'

const {
  assign,
  capitalize,
  isFinite,
  round,
  toUpper,
  pickBy
} = require('lodash')
const startOfDay = require('date-fns/start_of_day')
const { waterfall, asyncify } = require('async')
const osom = require('osom')

const getReferralLink = require('./get-referral-link')
const getCondition = require('./get-condition')
const getRangeProps = require('../range')

const prettyTitle = require('./transform/pretty-title')
const isValidCondition = require('./validate/condition')
const isValidSailSize = require('./validate/sail-size')
const isValidTitle = require('./validate/title')
const isValidPrice = require('./validate/price')
const getDescription = require('../description')
const serializer = require('./serializer')
const isUrl = require('../util/is-url')

const validator = osom({
  /* common */
  title: {
    required: true,
    type: String,
    validate: isValidTitle
  },
  category: {
    required: true,
    type: Array
  },
  seller: {
    required: true,
    type: String
  },
  condition: {
    required: true,
    type: String,
    validate: isValidCondition,
    transform: [capitalize]
  },
  provider: {
    required: true,
    type: String
  },
  path: {
    type: String
  },
  link: {
    required: true,
    type: String,
    validate: isUrl
  },
  image: {
    type: String,
    validate: isUrl
  },
  createdAt: {
    type: Number
  },
  updatedAt: {
    type: Number
  },
  timestamp: {
    type: Number
  },
  isForced: {
    type: Boolean,
    default: false
  },

  /** identify:common **/
  brand: String,
  model: String,
  price: {
    required: true,
    type: Number,
    validate: isValidPrice,
    transform: [round]
  },

  year: Number,

  'sail size': {
    type: Number,
    validate: isValidSailSize
  },

  modality: {
    type: String,
    transform: [capitalize]
  },

  'board size': {
    type: Number,
    validate: isFinite
  },

  'board type': String,

  'boom size': Number,

  'boom type': {
    type: String,
    transform: [capitalize]
  },

  'fin size': {
    type: Number,
    validate: isFinite
  },

  'fin type': String,

  'mast carbon': Number,

  'mast type': {
    type: String,
    transform: [toUpper]
  },

  'mast size': Number,

  'sail size range': String,
  'board size range': String,
  'mast size range': String,
  'mast carbon range': String,
  'boom size range': String,
  'fin size range': String
})

const titleize = asyncify(prettyTitle)
const validate = asyncify(validator)

module.exports = function (schema, cb) {
  const now = Date.now()

  const doc = assign({}, schema, {
    updatedAt: startOfDay(now).getTime(),
    condition: getCondition(schema),
    link: getReferralLink(schema),
    timestamp: now
  })

  const schemaSerialized = serializer(doc)

  const tasks = [
    function validateSchema (next) {
      return validate(schemaSerialized, next)
    },
    function assignPrettyTitle (doc, next) {
      return titleize(doc, (err, title) =>
        next(err, assign({}, doc, { title }))
      )
    },
    function assignRangeProps (doc, next) {
      return next(null, assign(doc, getRangeProps(doc)))
    },
    function assignDescription (doc, next) {
      return next(null, assign(doc, { description: getDescription(doc) }))
    },
    function sanetizeProps (doc, next) {
      return next(null, pickBy(doc))
    }
  ]

  return waterfall(tasks, cb)
}
