import daysService from "@/services/days.service.js";

describe("Service - DaysService", () => {
  it("build a day", () => {
    const A_DATE = new Date(2018, 8, 9);
    const expected = {
      date: A_DATE,
      dinner: "",
      lunch: ""
    };
    expect(daysService.createADay(A_DATE)).toEqual(expected);
  });

  it("should return next day", () => {
    expect(daysService.getNextDate("2018-01-01")).toEqual("2018-01-02");
  });

  it("should return previous day", () => {
    expect(daysService.getPreviousDate("2018-01-01")).toEqual("2017-12-31");
  });
});
