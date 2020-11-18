const RotaAlerts = require("../lib/rota_alerts");
const UpcomingRotation = require("../lib/upcoming_rotation");
const SlackMessage = require("../lib/slack_message");
const EmailMessage = require("../lib/email_message");

jest.mock("../lib/upcoming_rotation");
jest.mock("../lib/slack_message");
jest.mock("../lib/email_message");

describe("RotaAlerts", () => {
  beforeEach(() => {
    UpcomingRotation.mockClear();
    SlackMessage.mockClear();
    EmailMessage.mockClear();
  });

  test("sends notifications when a out of hours rotation is available", async () => {
    UpcomingRotation.mockImplementationOnce(() => {
      return {
        find: () => {
          return Promise.resolve({
            start_date: "2020-01-09",
            end_date: "2020-01-16",
            first_line: {
              name: "Eve",
              email: "eve@example.com",
            },
            second_line: {
              name: "Trent",
              email: "trent@example.com",
            },
          });
        },
      };
    });

    const rotaAlerts = new RotaAlerts("ooh");
    await rotaAlerts.run();

    expect(SlackMessage).toHaveBeenCalledTimes(2);
    expect(EmailMessage).toHaveBeenCalledTimes(2);
    expect(SlackMessage).toHaveBeenCalledWith(
      "eve@example.com",
      "You have an upcoming **out of hours** allocation on Thursday 9th January. " +
      "Your role is **first line**." +
      "Can't do it? Ask in #dxw-tech-team and see if someone wants to swap"
    );
    expect(SlackMessage).toHaveBeenCalledWith(
      "trent@example.com",
      "You have an upcoming **out of hours** allocation on Thursday 9th January. " +
      "Your role is **second line**." +
      "Can't do it? Ask in #dxw-tech-team and see if someone wants to swap"
    );
    expect(EmailMessage).toHaveBeenCalledWith(
      "eve@example.com",
      "You have an upcoming **out of hours** allocation on Thursday 9th January. " +
      "Your role is **first line**." +
      "Can't do it? Ask in #dxw-tech-team and see if someone wants to swap"
    );
    expect(EmailMessage).toHaveBeenCalledWith(
      "trent@example.com",
      "You have an upcoming **out of hours** allocation on Thursday 9th January. " +
      "Your role is **second line**." +
      "Can't do it? Ask in #dxw-tech-team and see if someone wants to swap"
    );
  });

  test("does not send Slack notifications when there is no rotation", async () => {
    UpcomingRotation.mockImplementationOnce(() => {
      return {
        find: () => {
          Promise.resolve(undefined);
        },
      };
    });

    const rotaAlerts = new RotaAlerts("ooh");
    await rotaAlerts.run();

    expect(SlackMessage).toHaveBeenCalledTimes(0);
    expect(EmailMessage).toHaveBeenCalledTimes(0);
  });
});
