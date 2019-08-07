import { MenuDate } from '@/api/menu-date'

describe('MenuDate', () => {
  describe('toString', () => {
    it('should return the formatted date', () => {
      const aMenuDate = new MenuDate('2012-01-01')
      expect(aMenuDate.toString()).toBe('2012-01-01')
    })
  })

  describe('toHumanFormat', () => {
    it('should return the date in human format', () => {
      const aMenuDate = new MenuDate('2012-01-01')
      expect(aMenuDate.toHumanFormat()).toBe('Sunday 1st Jan')
    })
  })
})
