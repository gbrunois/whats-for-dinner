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
  createDays(days, beginDate, endDate) {
    let i = moment(beginDate, FORMAT);
    let end = moment(endDate, FORMAT);
    const result = [];
    while (i <= end) {
      result.push(
        daysService.findDay(days, i.format(FORMAT)) ||
          daysService.createADay(i.format(FORMAT))
      );
      i.add(1, "days");
    }
    return result;
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
    return moment(date, FORMAT).format("dddd Do MMM");
  },
  findDay(days, date) {
    return days.find(d => d.date === date);
  },
  getFirstDayOfCurrentWeek() {
    return moment()
      .weekday(0)
      .format(FORMAT);
  },
  getLastDayOfCurrentWeek() {
    return moment()
      .weekday(7)
      .format(FORMAT);
  },
  parseDate(date) {
    return moment(date, FORMAT).format(FORMAT);
  },
  getLastDayOfWeek(date) {
    return moment(date, FORMAT)
      .weekday(7)
      .format(FORMAT);
  },
  getFirstDayOfWeek(date) {
    return moment(date, FORMAT)
      .weekday(0)
      .format(FORMAT);
  },
  getPreviousStartDayOfWeek(date) {
    return moment(date, FORMAT)
      .weekday(-7)
      .format(FORMAT);
  },
  getNextStartDayOfWeek(date) {
    return moment(date, FORMAT)
      .weekday(7)
      .format(FORMAT);
  },
  getParts(date) {
    const m = moment(date, FORMAT);
    return {
      year: m.year(),
      month: m.month(),
      day: m.day()
    };
  }
};

export default daysService;
