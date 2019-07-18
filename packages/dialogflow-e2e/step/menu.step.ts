import { expect } from 'chai'
import { Then, When } from 'cucumber'
import dateUtils from './dateUtils'

When('User say {string}', function(message) {
  return this.driverFluent.userSaysText(dateUtils.replaceDateVariablesInMessage(message))
})

Then('Bot say {string}', function(message) {
  return this.driverFluent.waitBotSaysText((msg) => {
    expect(msg).to.be.equal(dateUtils.replaceDateVariablesInMessage(message))
  })
})

Then('Bot answer one of this phrases', function(data) {
  const phrases: string[] = data
    .raw()
    .splice(1, data.raw().length)
    .map((row) => dateUtils.replaceDateVariablesInMessage(row[0]))
  return this.driverFluent.waitBotSaysText((msg) => {
    expect(phrases.includes(msg)).to.be.true
  })
})
