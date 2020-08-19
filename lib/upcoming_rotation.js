const axios = require("axios");
const moment = require("moment");

class UpcomingRotation {
  constructor(type) {
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

    return response.data.find((rotation) => {
      return rotation.start_date === this.date;
    });
  }
}

module.exports = UpcomingRotation;
