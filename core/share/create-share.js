'use strict'

const { get, size } = require('lodash')
const bufferapp = require('buffer-node')
const { each } = require('async')

const { accounts, access_token: accessToken } = require('config').buffer
const bufferToken = get(global, accessToken)

const createSendBuffer = require('./create-send-buffer')

function createShare (composeMessage, getShareables) {
  function share ({ log }) {
    const client = bufferapp(bufferToken)
    const sendToBuffer = createSendBuffer({
      client,
      accounts,
      composeMessage,
      log
    })

    const createUpdates = (docs, cb) => each(docs, sendToBuffer, cb)
    function addBuffer (docs, cb) {
      const shareables = getShareables(docs)
      log.debug('shareables', { size: size(shareables) })
      return createUpdates(shareables, cb)
    }

    return addBuffer
  }

  return share
}

module.exports = createShare
