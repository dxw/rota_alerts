const axios = require("axios");
const moment = require("moment");

const url = "https://dxw-support-rota.herokuapp.com/out-of-hours/rota.json";

class UpcomingRotation {
  constructor() {
    this.date = moment().add(1, "week").format("YYYY-MM-DD");
  }

  async find() {
    const response = await axios.get(url);

    return response.data.find((rotation) => {
      return rotation.start_date === this.date;
    });
  }
}

module.exports = UpcomingRotation;
