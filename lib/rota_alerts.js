const UpcomingRotation = require('../lib/upcoming_rotation')
const SlackMessage = require('../lib/slack_message')
const moment = require('moment')

class RotaAlerts {
  async run () {
    const upcoming = await this.upcoming()

    if (upcoming) {
      await this.sendMessage(upcoming.first_line.email, upcoming.start_date)
      await this.sendMessage(upcoming.second_line.email, upcoming.start_date)
    }
  }

  async upcoming () {
    const rotationFinder = new UpcomingRotation()
    return await rotationFinder.find()
  }

  async sendMessage (email, startDate) {
    const date = moment(startDate).format('dddd Do MMMM')
    const text = `You have an upcoming out of hours allocation on ${date}`
    const slackMessage = new SlackMessage(email, text)

    return await slackMessage.send()
  }

  static async runner () {
    const alerts = new RotaAlerts()
    await alerts.run()
  }
}

module.exports = RotaAlerts
