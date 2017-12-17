'use strict'

const Promise = require('bluebird')
const config = require('config')
const log = require('fancy-log')
const ms = require('ms')
const pad = require('pad-left')
const promiseRetry = require('promise-retry')
const sleep = require('promise.sleep')
const { WebClient } = require('@slack/client')
const template = require('lodash.template')

// ----------------------------------------------------------------------------

const { SLACK_API_TOKEN } = process.env
const SLACK_DELETE_CHANNELS = config.get('slack.deleteChannels')
const SLACK_NOTIFY_CHANNEL = config.get('slack.notifyChannel')
const SLACK_ICON_URL = config.get('slack.iconUrl')
const SLACK_USERNAME = config.get('slack.username')
const SLACK_MESSAGE = config.get('slack.message')
const SLACK_SEARCH_BEFORE = config.get('slack.search.before')

// ----------------------------------------------------------------------------

module.exports = async function() {
  const web = new WebClient(SLACK_API_TOKEN)
  const now = new Date()
  const before = new Date()
  before.setTime(now - ms(SLACK_SEARCH_BEFORE))

  const beforeText = [
    before.getFullYear(),
    pad(before.getMonth() + 1, 2, '0'),
    pad(before.getDate(), 2, '0'),
  ].join('-')

  let deletedCount = 0
  for (let channel of SLACK_DELETE_CHANNELS) {
    const searchText = `in:#${channel} before:${beforeText}`

    let maxPage = Infinity
    for (let page = 1; page <= maxPage;) {
      const { messages } = await promiseRetry(() => web.search.messages(searchText, {
        page,
      }))

      if (maxPage === Infinity) {
        log(`${messages.total} messages found in ${channel}`)
        maxPage = messages.paging.pages
      }

      const botMessages = messages.matches.filter(match => !match.user)
      if (botMessages.length === 0) {
        ++page
        continue
      }

      await Promise.map(botMessages, async match => {
        try {
          await promiseRetry(() => web.chat.delete(match.ts, match.channel.id))
        } catch (e) { }
        await sleep(1000)
        ++deletedCount
      }, { concurrency: 1 })
    }
  }

  log(`Deleted ${deletedCount} messages`)

  if (deletedCount > 0) {
    const message = template(SLACK_MESSAGE)({
      ymd: beforeText,
      count: deletedCount,
    })
    await web.chat.postMessage(SLACK_NOTIFY_CHANNEL, message, {
      username: SLACK_USERNAME,
      icon_url: SLACK_ICON_URL,
    })
  }
}

// vim: se et ft=javascript ts=2 sw=2 sts=2 :
