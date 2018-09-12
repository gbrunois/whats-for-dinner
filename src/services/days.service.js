import moment from "moment";

const FORMAT = "YYYY-MM-DD";

const daysService = {
  createADay(date) {
    return {
      date,
      dinner: "",
      lunch: ""
    };
  },
  getNextDate(date) {
    return moment(date, FORMAT)
      .add(1, "days")
      .format(FORMAT);
  },
  getPreviousDate(date) {
    return moment(date, FORMAT)
      .add(-1, "days")
      .format(FORMAT);
  },
  getNow() {
    return moment().format(FORMAT);
  },
  toHumanFormat(date) {
    return moment(date, FORMAT).format("LL");
  }
};

export default daysService;
