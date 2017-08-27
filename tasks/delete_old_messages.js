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
const SLACK_DELETE_CHANNEL = config.get('slack.deleteChannel')
const SLACK_NOTIFY_CHANNEL = config.get('slack.notifyChannel')
const SLACK_ICON_URL = config.get('slack.iconUrl')
const SLACK_USERNAME = config.get('slack.username')
const SLACK_MESSAGE = config.get('slack.message')
const SLACK_SEARCH_BEFORE = config.get('slack.search.before')
const SLACK_SEARCH_COUNT = config.get('slack.search.count')

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
  const searchText = `in:#${SLACK_DELETE_CHANNEL} before:${beforeText}`

  let deletedCount = 0
  let page = 1
  let maxPage = Infinity
  for (let page = 1; page < maxPage;) {
    const { messages } = await web.search.messages(searchText, {
      count: SLACK_SEARCH_COUNT,
      page,
    })
    if (maxPage === Infinity) {
      log(`${messages.total} messages found`)
      maxPage = Math.ceil(messages.total / SLACK_SEARCH_COUNT)
    }
    if (messages.matches.length === 0) {
      ++page
      continue
    }

    await Promise.map(messages.matches, async (match) => {
      const isBot = !match.user
      if (isBot) {
        try {
          await promiseRetry(() => web.chat.delete(match.ts, match.channel.id))
        } catch (e) { }
        await sleep(1000)
        ++deletedCount
      }
    }, { concurrency: 1 })
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