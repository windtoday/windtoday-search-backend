'use strict'

const category = require('../../core/category')
require('should')

describe('categories', function () {
  describe('plural', function () {
    it('access raw category', function () {
      category.sails.should.be.equal('sails')
    })

    it('determinate the category', function () {
      [
        'sails',
        'SAILS'
      ].forEach(function (key) {
        category(key).should.be.equal('sails')
      })
    })
  })

  describe('singular', function () {
    it('determinate the category', function () {
      [
        'sails',
        'SAILS'
      ].forEach(function (key) {
        category.singular(key).should.be.equal('sail')
      })
    })
  })
})
