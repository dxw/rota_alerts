const EmailMessage = require("../lib/email_message.js");
const sgMail = require("@sendgrid/mail");

jest.mock("@sendgrid/mail");

describe("EmailMessage", () => {
  test("it sends an email message", async () => {
    const message = new EmailMessage("foo@example.com", "Details of your upcoming rotation");
    await message.send();

    expect(sgMail.send).toHaveBeenCalledWith({
      to: "foo@example.com",
      from: "stuart@dxw.com",
      subject: "Your upcoming rotation",
      text: "Details of your upcoming rotation",
    });
  });
});
