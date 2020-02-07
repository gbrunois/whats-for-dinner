import { expect } from 'chai'
import { Then, When } from 'cucumber'
import dateUtils from './dateUtils'
import { fail } from 'assert'

When('User say {string}', function(message) {
  const formatted_message = dateUtils.replaceDateVariablesInMessage(message)
  return this.driverFluent.userSaysText(formatted_message)
})

Then('Bot say {string}', function(message) {
  return this.driverFluent.waitBotSaysText((msg: string | undefined) => {
    if (msg === undefined) {
      fail('Message is undefined')
    } else {
      expect(msg.split('\n').join(' ')).to.be.equal(dateUtils.replaceDateVariablesInMessage(message))
    }
  })
})

Then('Bot answer one of this phrases', function(data) {
  const phrases: string[] = data.raw().map((row) => dateUtils.replaceDateVariablesInMessage(row[0]))
  return this.driverFluent.waitBotSaysText((msg) => {
    expect(phrases.includes(msg), msg).to.be.true
  })
})
