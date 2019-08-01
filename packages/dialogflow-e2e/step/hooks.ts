import { BeforeAll, Before, After, AfterAll } from 'cucumber'
import { BotDriverService } from './botDriver.service'
import { ApiService } from './api.service'

BeforeAll(function() {
  BotDriverService.getInstance()
})

Before(async function() {
  await ApiService.getInstance().init()
  await ApiService.getInstance().eraseAllPlannings()
  this.driverFluent = BotDriverService.getInstance()
  return this.driverFluent.start()
})
After(function() {
  return this.driverFluent.stop()
})
AfterAll(function() {
  return BotDriverService.getInstance().clean()
})
