require('dotenv').config()

const {
  WebClient
} = require('@slack/web-api')
const token = process.env.SLACK_TOKEN

class SlackMessage {
  constructor (emailAddress, message) {
    this.emailAddress = emailAddress
    this.message = message
    this.slackClient = new WebClient(token)
  }

  async send () {
    const user = await this.user()
    return await this.slackClient.chat.postMessage({
      channel: user.user.id,
      text: this.message
    })
  }

  async user () {
    return await this.slackClient.users.lookupByEmail({
      email: this.emailAddress
    })
  }
}

module.exports = SlackMessage
