const UpcomingRotation = require("../lib/upcoming_rotation");
const SlackMessage = require("../lib/slack_message");
const moment = require("moment");

class RotaAlerts {
  async run(type) {
    const upcoming = await this.upcoming(type);

    if (upcoming) {
      await this.sendMessage(upcoming.first_line.email, upcoming.start_date);
      await this.sendMessage(upcoming.second_line.email, upcoming.start_date);
    }
  }

  async upcoming(type) {
    const rotationFinder = new UpcomingRotation(type);
    return await rotationFinder.find();
  }

  async sendMessage(email, startDate) {
    const date = moment(startDate).format("dddd Do MMMM");
    const text = `You have an upcoming out of hours allocation on ${date}`;
    const slackMessage = new SlackMessage(email, text);

    return await slackMessage.send();
  }

  static async runner() {
    const oohAlerts = new RotaAlerts("ooh");
    await oohAlerts.run();

    const supportAlerts = new RotaAlerts("support");
    await supportAlerts.run();
  }
}

module.exports = RotaAlerts;
