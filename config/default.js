'use strict'

module.exports = {
  slack: {
    channel: 'emoji',
    iconUrl: 'https://i.imgur.com/z9ZkgzU.png',
    username: 'kanna',
    message: '<%= ymd %> 以前のメッセージを <%= count %> 件けしたー',
    search: {
      before: '3 days',
      count: 1000,
    },
  },
}
