Kanna
-----

Slack bot for Emoji Generator organizers.

## Getting started
### 1. Create OpenShift Account
### 2. Create OpenShift Application
Cartridges
 - [Custom Node.js cartridge for OpenShift](https://github.com/icflorescu/openshift-cartridge-nodejs)
 - [MongoDB](https://hub.openshift.com/addons/21-mongodb)
 - [Cron](https://hub.openshift.com/addons/26-cron)

### 3. Add environment variables
```
$ rhc env set SLACK_API_TOKEN=XXX \
              SLACK_CHANNEL_NAME=channel \
              SLACK_ICON_URL=http://example.com/icons/icon.png -a appname
```

### 4. Deploy
```
$ git remote add deploy ssh://xxxxxxxxxxxxxxxxxxxxxxxx@appname-domain.rhcloud.com/~/git/appname.git/
$ git push deploy master
```

## License
ISC &copy; [Emoji Generator](https://emoji.pine.moe/)
