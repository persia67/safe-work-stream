import moment from 'moment-jalaali';

/**
 * تبدیل تاریخ میلادی به شمسی با فرمت زیبا
 * @param gregorianDate - تاریخ میلادی به فرمت YYYY-MM-DD یا Date object
 * @param format - فرمت خروجی (پیش‌فرض: 'jYYYY/jMM/jDD')
 * @returns تاریخ شمسی فرمت‌شده
 */
export const formatPersianDate = (gregorianDate: string | Date, format: string = 'jYYYY/jMM/jDD'): string => {
  if (!gregorianDate) return '-';
  
  try {
    return moment(gregorianDate).format(format);
  } catch (error) {
    console.error('خطا در تبدیل تاریخ:', error);
    return '-';
  }
};

/**
 * تبدیل تاریخ میلادی به شمسی با نام ماه فارسی
 * @param gregorianDate - تاریخ میلادی به فرمت YYYY-MM-DD یا Date object
 * @returns تاریخ شمسی با نام ماه (مثلاً: ۱۵ فروردین ۱۴۰۳)
 */
export const formatPersianDateWithMonthName = (gregorianDate: string | Date): string => {
  if (!gregorianDate) return '-';
  
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  try {
    const date = moment(gregorianDate);
    const day = date.format('jDD');
    const monthIndex = parseInt(date.format('jM')) - 1;
    const year = date.format('jYYYY');
    
    return `${day} ${persianMonths[monthIndex]} ${year}`;
  } catch (error) {
    console.error('خطا در تبدیل تاریخ:', error);
    return '-';
  }
};

/**
 * تبدیل تاریخ شمسی به میلادی
 * @param persianDate - تاریخ شمسی به فرمت object {year, month, day}
 * @returns تاریخ میلادی به فرمت YYYY-MM-DD
 */
export const persianToGregorian = (persianDate: { year: number; month: number; day: number }): string => {
  if (!persianDate || !persianDate.year || !persianDate.month || !persianDate.day) {
    return '';
  }
  
  try {
    return moment(`${persianDate.year}/${persianDate.month}/${persianDate.day}`, 'jYYYY/jM/jD').format('YYYY-MM-DD');
  } catch (error) {
    console.error('خطا در تبدیل تاریخ شمسی به میلادی:', error);
    return '';
  }
};

/**
 * تبدیل تاریخ میلادی به object شمسی برای DatePicker
 * @param gregorianDate - تاریخ میلادی به فرمت YYYY-MM-DD
 * @returns object شمسی {year, month, day}
 */
export const gregorianToPersian = (gregorianDate: string): { year: number; month: number; day: number } | null => {
  if (!gregorianDate) return null;
  
  try {
    const date = moment(gregorianDate, 'YYYY-MM-DD');
    return {
      year: parseInt(date.format('jYYYY')),
      month: parseInt(date.format('jMM')),
      day: parseInt(date.format('jDD'))
    };
  } catch (error) {
    console.error('خطا در تبدیل تاریخ میلادی به شمسی:', error);
    return null;
  }
};

/**
 * گرفتن تاریخ امروز به شمسی
 * @param format - فرمت خروجی
 * @returns تاریخ امروز به شمسی
 */
export const getTodayPersian = (format: string = 'jYYYY/jMM/jDD'): string => {
  return moment().format(format);
};

/**
 * گرفتن تاریخ امروز به میلادی
 * @returns تاریخ امروز به فرمت YYYY-MM-DD
 */
export const getTodayGregorian = (): string => {
  return moment().format('YYYY-MM-DD');
};
