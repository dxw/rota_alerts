const UpcomingRotation = require("../lib/upcoming_rotation");
const MockDate = require("mockdate");
const axios = require("axios");

jest.mock("axios");

describe("UpcomingRotations", () => {
  describe("when rotation has the 'ooh' shape (first_line/second_line)", () => {
    beforeEach(() => {
      // Mock the HTTP reponse from the API
      const oohData = {
        data: [
          {
            start_date: "2020-01-01",
            end_date: "2020-01-08",
            first_line: {
              name: "Alice",
              email: "alice@example.com",
            },
            second_line: {
              name: "Bob",
              email: "bob@example.com",
            },
          },
          {
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
          },
        ],
      };

      axios.get.mockImplementationOnce(() => Promise.resolve(oohData));
    });

    test("returns a consistently shaped entity when one is available", async () => {
      MockDate.set("2020-01-02");

      const upcomingRotation = new UpcomingRotation("ooh");

      expect(await upcomingRotation.find()).toEqual({
        start_date: "2020-01-09",
        end_date: "2020-01-16",
        members: [
          {
            rota: "out-of-hours",
            role: "first line",
            name: "Eve",
            email: "eve@example.com",
          },
          {
            rota: "out-of-hours",
            role: "second line",
            name: "Trent",
            email: "trent@example.com",
          },
        ],
      });
    });

    test("returns nothing when there is no rotation", async () => {
      MockDate.set("2020-01-03");

      const upcomingRotation = new UpcomingRotation("ooh");

      expect(await upcomingRotation.find()).toEqual(undefined);
    });

    test("raises an error if the rotation type does not exist", () => {
      expect(() => {
        new UpcomingRotation("foo");
      }).toThrow("Rotation type foo does not exist");
    });
  });

  describe("when rotation has the 'support' shape (developer/ops)", () => {
    beforeEach(() => {
      // Mock the HTTP reponse from the API
      const supportData = {
        data: [
          {
            start_date: "2020-01-09",
            end_date: "2020-01-16",
            developer: {
              name: "Sandy",
              email: "Sandy@example.com",
            },
            ops: {
              name: "Frances",
              email: "Frances@example.com",
            },
          },
        ],
      };

      axios.get.mockImplementationOnce(() => Promise.resolve(supportData));
    });

    test("returns a consistently shaped entity when one is available", async () => {
      MockDate.set("2020-01-02");

      const upcomingRotation = new UpcomingRotation("support");

      expect(await upcomingRotation.find()).toEqual({
        start_date: "2020-01-09",
        end_date: "2020-01-16",
        members: [
          {
            rota: "in-hours",
            role: "developer",
            name: "Sandy",
            email: "Sandy@example.com",
          },
          {
            rota: "in-hours",
            role: "ops",
            name: "Frances",
            email: "Frances@example.com",
          },
        ],
      });
    });
  });

  afterEach(() => {
    MockDate.reset();
  });
});
