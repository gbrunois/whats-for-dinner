import moment from "moment";

const FORMAT = "YYYY-MM-DD";

function findDay(days, date) {
  return days.find(d => d.date === date);
}

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
        findDay(days, i.format(FORMAT)) ||
          daysService.createADay(i.format(FORMAT))
      );
      i.add(1, "days");
    }
    return result;
  },
  getNow() {
    return moment().format(FORMAT);
  },
  toHumanFormat(date) {
    return moment(date, FORMAT).format("dddd Do MMM");
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
  }
};

export default daysService;
