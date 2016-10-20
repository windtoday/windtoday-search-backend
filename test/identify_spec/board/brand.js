'use strict'

require('should')
const { get } = require('lodash')
const log = require('../../../core/log')('board_brand_unidentify')
const board = require('../../../core/identify/board')(log)

describe('identify » board » brand', function () {
  it('not detect', function () {
    [
      ''
    ].forEach(function (title) {
      const boardDetected = board({title})
      get(boardDetected, 'category').should.be.equal('boards')
    })
  })

  it('detect', function () {
    [
      'starboard futura'
    ].forEach(function (title) {
      const boardDetected = board({title})
      get(boardDetected, 'category').should.be.equal('boards')
      get(boardDetected, 'brand').should.be.equal('Starboard')
    })
  })
})
