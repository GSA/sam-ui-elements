import { TestBed } from '@angular/core/testing';
import { Calendar } from './calendar';
import { By } from '@angular/platform-browser';

describe('The calendar class', () => {
  describe('isolated tests', () => {
    let obj: Calendar;
    beforeEach(() => {
        obj = new Calendar();
    });

    it('tests weekStartDate', () => {
        let date = new Date("01/01/2018");
        let weekStartDate = obj.weekStartDate(date); 
        expect(weekStartDate.getMonth()).toBe(11);//december, 0-based
        expect(weekStartDate.getDate()).toBe(31);
        expect(weekStartDate.getFullYear()).toBe(2017);
    });

    it('tests monthDates', () => {
        let monthDates = obj.monthDates(2018, 0, (date)=>{ return date; }, (date)=>{ return date; }); 
        expect(monthDates[0][0].getMonth()).toBe(11);//december, 0-based
        expect(monthDates[0][0].getDate()).toBe(31);
        expect(monthDates[0][0].getFullYear()).toBe(2017);
    });

    it('tests monthDays', () => {
        let monthDays = obj.monthDays(2018, 0); 
        expect(monthDays[0][0]).toBe(0);
    });

    it('tests monthText', () => {
        let monthText = obj.monthText(2018, 0);
        let expectedValue = `    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31         `;
        expect(monthText).toBe(expectedValue);
    });
  });
});
