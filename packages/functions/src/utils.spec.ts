import { Utils } from './utils'

const TODAY = new Date('2019-05-14T11:01:58.135Z')

describe('utils', () => {
  beforeEach(() => {
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => TODAY.valueOf())
  })

  describe('isoDateToDate', () => {
    it('should return today date when input is "today"', () => {
      expect(Utils.isoDateToDate("aujourd'hui")).toEqual(TODAY)
    })

    it('should return a date when input is an iso date', () => {
      const expectedDate = new Date(2019, 5, 17, 12, 0, 0)
      expect(Utils.isoDateToDate('2019-06-17T12:00:00+02:00')).toEqual(expectedDate)
    })
  })

  describe('toFullDate', () => {
    it('should return the full date format', () => {
      expect(Utils.toFullDate(new Date(2019, 5, 17, 12, 0, 0))).toBe('lundi 17 juin')
      expect(Utils.toFullDate(new Date(2019, 6, 22, 12, 0, 0))).toBe('lundi 22 juillet')
    })
  })

  describe('isToday', () => {
    it('should return true when is today', () => {
      expect(Utils.isToday(new Date('2019-05-14T00:00:00'))).toBeTruthy()
    })

    it('should return false when is not today', () => {
      expect(Utils.isToday(new Date('2019-05-13T00:00:00'))).toBeFalsy()
    })
  })

  describe('isTomorrow', () => {
    it('should return true when is tomorrow', () => {
      expect(Utils.isTomorrow(new Date('2019-05-15T00:00:00'))).toBeTruthy()
    })

    it('should return false when is not tomorrow', () => {
      expect(Utils.isTomorrow(new Date('2019-05-14T00:00:00'))).toBeFalsy()
    })
  })
})
