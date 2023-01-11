import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(time: string): string {
    const dTime = DateTime.fromISO(time);
    const hour = dTime.hour < 10 ? `0${dTime.hour}` : `${dTime.hour}`;
    const minute = dTime.minute < 10 ? `0${dTime.minute}` : `${dTime.minute}`;
    return `${hour}:${minute}`;
  }
}
