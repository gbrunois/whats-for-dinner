import daysService from '@/services/days.service.js';

describe('Service - DaysService', () => {
  it('build a day', () => {
    const A_DATE = new Date(2018, 8, 9);
    const expected = {
      date: A_DATE,
      dinner: '',
      lunch: '',
    };
    expect(daysService.createADay(A_DATE)).toEqual(expected);
  });

  it('should return getPreviousStartDayOfWeeky', () => {
    expect(daysService.getPreviousStartDayOfWeek('2018-01-01')).toEqual(
      '2017-12-24'
    );
  });

  it('should return getNextStartDayOfWeek', () => {
    expect(daysService.getNextStartDayOfWeek('2018-01-01')).toEqual(
      '2018-01-07'
    );
  });

  it('should return getLastDayOfWeek', () => {
    expect(daysService.getLastDayOfWeek('2018-01-01')).toEqual('2018-01-07');
  });

  it('should return getFirstDayOfWeek', () => {
    expect(daysService.getFirstDayOfWeek('2018-01-01')).toEqual('2017-12-31');
  });

  describe('createDays', () => {
    it('without existing days', () => {
      expect(daysService.createDays([], '2018-01-01', '2018-01_03')).toEqual([
        {
          date: '2018-01-01',
          dinner: '',
          lunch: '',
        },
        {
          date: '2018-01-02',
          dinner: '',
          lunch: '',
        },
        {
          date: '2018-01-03',
          dinner: '',
          lunch: '',
        },
      ]);
    });

    it('with existing days', () => {
      expect(
        daysService.createDays(
          [
            {
              date: '2018-01-01',
              dinner: '',
              lunch: '',
              id: '123',
            },
          ],
          '2018-01-01',
          '2018-01_03'
        )
      ).toEqual([
        {
          date: '2018-01-01',
          dinner: '',
          lunch: '',
          id: '123',
        },
        {
          date: '2018-01-02',
          dinner: '',
          lunch: '',
        },
        {
          date: '2018-01-03',
          dinner: '',
          lunch: '',
        },
      ]);
    });
  });
});
