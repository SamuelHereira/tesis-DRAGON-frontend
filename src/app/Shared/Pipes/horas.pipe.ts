import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: number): string {
    if (!value && value !== 0) {
      return '';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const hoursString = String(hours).padStart(2, '0');
    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(seconds).padStart(2, '0');

    return `${hoursString}:${minutesString}:${secondsString}`;
  }
}
