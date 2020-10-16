require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
class EmailMessage {
  constructor(emailAddress, message) {
    this.emailAddress = emailAddress;
    this.message = message;
  }

  async send() {
    try {
      await sgMail.send(this.messageBody());
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }

    return true;
  }

  messageBody() {
    return {
      to: this.emailAddress,
      from: "noreply@dxw.com",
      subject: "Your upcoming rotation",
      text: this.message,
    };
  }
}

module.exports = EmailMessage;
