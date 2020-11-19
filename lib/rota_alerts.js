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
      await this.sendMessage(rotation.members[0], rotation.start_date);
      await this.sendMessage(rotation.members[1], rotation.start_date);
    }
  }

  async upcoming(type) {
    const rotationFinder = new UpcomingRotation(type);
    return await rotationFinder.find();
  }

  async sendMessage(membership, startDate) {
    const date = moment(startDate).format("dddd Do MMMM");
    const text = this.message(membership, date);
    const slackMessage = new SlackMessage(membership.email, text);
    const emailMessage = new EmailMessage(membership.email, text);

    await Promise.all([slackMessage.send(), emailMessage.send()]);
  }

  message(membership, date) {
    return (
      `You have an upcoming **${membership.rota}** allocation on ${date}. ` +
      `Your role is **${membership.role}**. ` +
      "Can't do it? Ask in #dxw-tech-team and see if someone wants to swap"
    );
  }

  static async runner() {
    const oohAlerts = new RotaAlerts("ooh");
    await oohAlerts.run();

    const supportAlerts = new RotaAlerts("support");
    await supportAlerts.run();
  }
}

module.exports = RotaAlerts;
