import { expect } from 'chai'
import dateUtils from './dateUtils'

describe('dateUtils', () => {
  describe('parseDate', () => {
    it('should return the input value if its already in YYYY-MM-DD format', () => {
      expect(dateUtils.getDateFromGherkins('2018-02-15')).to.equals('2018-02-15')
    })
    it('should return today for J', () => {
      let TODAY = '2018-02-15'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J')).to.equals(TODAY)

      TODAY = '2018-02-17'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J')).to.equals(TODAY)
    })
    it('should return tomorow for J+1', () => {
      let TODAY = '2018-02-15'
      let TOMOROW = '2018-02-16'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J+1')).to.equals(TOMOROW)

      TODAY = '2018-02-28'
      TOMOROW = '2018-03-01'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J+1')).to.equals(TOMOROW)
    })
    it('should return yesterday for J-1', () => {
      let TODAY = '2018-05-15'
      let YESTERDAY = '2018-05-14'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J-1')).to.equals(YESTERDAY)

      TODAY = '2018-06-01'
      YESTERDAY = '2018-05-31'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J-1')).to.equals(YESTERDAY)
    })

    it('should return tomorow for J+1 jour', () => {
      const TODAY = '2017-12-31'
      const TOMOROW = '2018-01-01'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J+1 jour')).to.equals(TOMOROW)
    })

    it('should return works with J+1 month', () => {
      const TODAY = '2018-05-15'
      const ONE_MONTH_LATER = '2018-06-15'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J+1 mois')).to.equals(ONE_MONTH_LATER)
    })

    it('should return works with J+2 an', () => {
      const TODAY = '2018-05-15'
      const TWO_YEARS_LATER = '2020-05-15'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J+2 ans')).to.equals(TWO_YEARS_LATER)
    })

    it('should return works with J-20 an', () => {
      const TODAY = '2018-05-15'
      const TWENTY_YEARS_AGO = '1998-05-15'
      dateUtils.today = new Date(TODAY)
      expect(dateUtils.getDateFromGherkins('J-20 ans')).to.equals(TWENTY_YEARS_AGO)
    })
  })

  describe('formatMessageDates', () => {
    it('should return message with parsed date with default format', () => {
      const TODAY = '2018-02-15'
      dateUtils.today = new Date(TODAY)
      const message = 'Test message [J]'
      expect(dateUtils.formatMessageWithDates(message)).to.equals('Test message 2018-02-15')
    })

    it('should return message with parsed date with format DD/MM/YYYY', () => {
      const TODAY = '2018-02-15'
      dateUtils.today = new Date(TODAY)
      const message = 'Test message [J]'
      const FORMAT = 'DD/MM/YYYY'
      expect(dateUtils.formatMessageWithDates(message, FORMAT)).to.equals('Test message 15/02/2018')
    })

    it("should not parse date if it's not within square brackets", () => {
      const TODAY = '2018-02-15'
      dateUtils.today = new Date(TODAY)
      const message = 'Today we are the J. or maybe the (J)'
      const FORMAT = 'DD/MM/YYYY'
      expect(dateUtils.formatMessageWithDates(message, FORMAT)).to.equals('Today we are the J. or maybe the (J)')
    })

    it('should fill date with tomomrow', () => {
      const TODAY = '2018-02-15'
      dateUtils.today = new Date(TODAY)
      const message = 'Tomorow we will be the [J+1]'
      const FORMAT = 'DD/MM/YYYY'
      expect(dateUtils.formatMessageWithDates(message, FORMAT)).to.equals('Tomorow we will be the 16/02/2018')
    })

    it('should fill date with yesterdeay', () => {
      const TODAY = '2018-02-15'
      dateUtils.today = new Date(TODAY)
      const message = 'Yesterdeay we were the [J-1]'
      const FORMAT = 'DD/MM/YYYY'
      expect(dateUtils.formatMessageWithDates(message, FORMAT)).to.equals('Yesterdeay we were the 14/02/2018')
    })
  })

  describe('getDatesInMessage', () => {
    it('should return a parameter value', () => {
      const message = 'Un exemple de message <J+1:fullDateFormat> avec une date'
      expect(dateUtils.getDatesInMessage(message)).to.deep.eq([
        {
          originalValue: '<J+1:fullDateFormat>',
          paramValue: 'J+1',
          targetFormat: 'fullDateFormat',
        },
      ])
    })

    it('should return two parameters value', () => {
      const message = 'Un exemple de message <J+1:fullDateFormat> avec une date <J+1 mois:YYYY-MM-JJ> puis une autre'
      expect(dateUtils.getDatesInMessage(message)).to.deep.eq([
        {
          originalValue: '<J+1:fullDateFormat>',
          paramValue: 'J+1',
          targetFormat: 'fullDateFormat',
        },
        {
          originalValue: '<J+1 mois:YYYY-MM-JJ>',
          paramValue: 'J+1 mois',
          targetFormat: 'YYYY-MM-JJ',
        },
      ])
    })
  })

  describe('replaceDateVariablesInMessage', () => {
    it('should tranform a message', () => {
      let TODAY = '2019-07-16'
      dateUtils.today = new Date(TODAY)
      const message = 'Un exemple de message <J+1:dddd DD MMMM> avec une date'
      const expectedMessage = 'Un exemple de message mercredi 17 juillet avec une date'
      expect(dateUtils.replaceDateVariablesInMessage(message)).to.be.eq(expectedMessage)
    })
  })
})
