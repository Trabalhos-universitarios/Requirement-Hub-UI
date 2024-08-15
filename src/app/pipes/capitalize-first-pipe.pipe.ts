import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstPipe'
})
export class CapitalizeFirstPipePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace(/\b\w/g, char => char.toUpperCase());
  }
}
