const axios = require("axios");
const moment = require("moment");

class UpcomingRotation {
  constructor(type) {
    this.type = type;
    this.date = moment().add(1, "week").format("YYYY-MM-DD");
    this.url = {
      ooh: "https://dxw-support-rota.herokuapp.com/out-of-hours/rota.json",
      support: "https://dxw-support-rota.herokuapp.com/support/rota.json",
    }[type];

    if (this.url === undefined) {
      throw new Error(`Rotation type ${type} does not exist`);
    }
  }

  async find() {
    const response = await axios.get(this.url);
    const inconsistentRotation = response.data.find((rotation) => {
      return rotation.start_date === this.date;
    });
    return this.consistentRotation(inconsistentRotation);
  }

  consistentRotation(rotation) {
    if (rotation) {
      return {
        start_date: rotation.start_date,
        end_date: rotation.end_date,
        members: this.members(rotation),
      };
    }
  }

  members(rotation) {
    console.log(this.type);
    switch (this.type) {
      case "ooh":
        return this.outOfHoursMembers(rotation);
      case "support":
        return this.inHoursMembers(rotation);
      default:
        throw new Error(`The rotation type ${this.type} is unknown.`);
    }
  }

  outOfHoursMembers(rotation) {
    return [
      {
        rota: "out-of-hours",
        role: "first line",
        name: rotation.first_line.name,
        email: rotation.first_line.email,
      },
      {
        rota: "out-of-hours",
        role: "second line",
        name: rotation.second_line.name,
        email: rotation.second_line.email,
      },
    ];
  }

  inHoursMembers(rotation) {
    console.log(rotation);
    return [
      {
        rota: "in-hours",
        role: "developer",
        name: rotation.developer.name,
        email: rotation.developer.email,
      },
      {
        rota: "in-hours",
        role: "ops",
        name: rotation.ops.name,
        email: rotation.ops.email,
      },
    ];
  }
}

module.exports = UpcomingRotation;
