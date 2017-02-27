'use strict'

module.exports = {
  slack: {
    channel: 'emoji',
    iconUrl: 'https://dl.dropboxusercontent.com/u/29279948/Slack/Icons/Kanna.png',
    username: 'kanna',
    message: '<%= ymd %> 以前のメッセージを <%= count %> 件けしたー',
    search: {
      before: '7 days',
      count: 1000,
    },
  },
}
