import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const date: Date = new Date(value);
    const day: string = date.getDate().toString();
    const monthNames: string[] = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const month: string = monthNames[date.getMonth()];
    const year: string = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }
}
