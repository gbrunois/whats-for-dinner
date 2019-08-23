import { Given } from 'cucumber'
import dateUtils from './dateUtils'
import { ApiService } from './api.service'
import { IPlanningInfo } from './types/planning-info'
import { expect } from 'chai'

Given('A planning', async function(data) {
  const planningInfo: IPlanningInfo[] = data
    .raw()
    .splice(1, data.raw().length)
    .map((row) => ({
      date: dateUtils.getDateFromGherkins(row[0]),
      lunch: row[1],
      dinner: row[2],
    }))

  await ApiService.getInstance().createNewPlanning(planningInfo)
})

Given('The planning is', async function(data) {
  const expectedPlanningInfo: IPlanningInfo[] = data
    .raw()
    .splice(1, data.raw().length)
    .map((row) => ({
      date: dateUtils.getDateFromGherkins(row[0]),
      lunch: row[1],
      dinner: row[2],
    }))

  const actualPlanningInfo = await ApiService.getInstance().getAllDays()
  expect(actualPlanningInfo.length).to.deep.equal(expectedPlanningInfo.length)
  expectedPlanningInfo.forEach((expectedDay) => {
    const actualDay = actualPlanningInfo.find((day) => day.date === expectedDay.date)
    expect(actualDay).not.to.be.undefined
    expect(actualDay.lunch).to.be.equal(expectedDay.lunch)
    expect(actualDay.dinner).to.be.equal(expectedDay.dinner)
  })
})
