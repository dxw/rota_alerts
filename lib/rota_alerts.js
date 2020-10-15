const UpcomingRotation = require("../lib/upcoming_rotation");
const SlackMessage = require("../lib/slack_message");
const EmailMessage = require("../lib/email_message");
const moment = require("moment");

class RotaAlerts {
  constructor(type) {
    this.type = type;
  }

  async run() {
    const rotation = await this.upcoming(this.type);

    if (rotation) {
      await this.sendMessage(rotation.first_line.email, rotation.start_date);
      await this.sendMessage(rotation.second_line.email, rotation.start_date);
    }
  }

  async upcoming(type) {
    const rotationFinder = new UpcomingRotation(type);
    return await rotationFinder.find();
  }

  async sendMessage(email, startDate) {
    const date = moment(startDate).format("dddd Do MMMM");
    const text = this.message(date);
    const slackMessage = new SlackMessage(email, text);
    const emailMessage = new EmailMessage(email, text);

    await Promise.all([slackMessage.send(), emailMessage.send()]);
  }

  message(date) {
    let typeDescription = {
      ooh: "out of hours",
      support: "support",
    }[this.type];

    return `You have an upcoming ${typeDescription} allocation on ${date}. Can't do it? Ask in #dxw-tech-team and see if someone wants to swap`;
  }

  static async runner() {
    const oohAlerts = new RotaAlerts("ooh");
    await oohAlerts.run();

    const supportAlerts = new RotaAlerts("support");
    await supportAlerts.run();
  }
}

module.exports = RotaAlerts;
