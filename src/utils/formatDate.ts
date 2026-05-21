import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export function formatDate(date: string | Date, template = 'DD/MM/YYYY'): string {
  return dayjs(date).format(template);
}

export function formatDatetime(date: string | Date): string {
  return dayjs(date).format('HH:mm DD/MM/YYYY');
}

export function fromNow(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function daysUntil(date: string | Date): number {
  return dayjs(date).diff(dayjs(), 'day');
}
