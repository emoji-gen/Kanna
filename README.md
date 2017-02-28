# Kanna &nbsp;[![CircleCI](https://circleci.com/gh/emoji-gen/Kanna/tree/master.svg?style=shield)](https://circleci.com/gh/emoji-gen/Kannna/tree/master) [![Dependency Status](https://gemnasium.com/badges/github.com/emoji-gen/Kanna.svg)](https://gemnasium.com/github.com/emoji-gen/Kanna)

Slack bot for Emoji Generator organizers.

## Getting started
### 1. Create OpenShift Account
### 2. Create OpenShift Application
Cartridges
 - [Custom Node.js cartridge for OpenShift](https://github.com/icflorescu/openshift-cartridge-nodejs)
 - [Cron](https://hub.openshift.com/addons/26-cron)

### 3. Add environment variables
```
$ rhc env set SLACK_API_TOKEN=XXX -a appname
```

### 4. Deploy
```
$ git remote add deploy ssh://xxxxxxxxxxxxxxxxxxxxxxxx@appname-domain.rhcloud.com/~/git/appname.git/
$ git push deploy master
```

## License
ISC &copy; [Emoji Generator](https://emoji.pine.moe/)
