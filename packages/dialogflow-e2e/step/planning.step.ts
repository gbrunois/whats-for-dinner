import { Given } from 'cucumber'
import dateUtils from './dateUtils'
import { ApiService } from './api.service'
import { IPlanningInfo } from './types/planning-info'

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
