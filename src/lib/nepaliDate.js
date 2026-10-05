import data from './bsData.json';
import { makeCalendar } from './nepaliCore.js';

const cal = makeCalendar(data);

export const { toAd, toBs, today, daysInBsMonth, getYearStatus, getMonthName, format, getSupportedRange } = cal;
