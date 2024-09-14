import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstPipe'
})
export class CapitalizeFirstPipePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Substitui os underscores por espaços e capitaliza cada palavra
    return value
        .toLowerCase() // Converte toda a string para minúscula
        .replace(/_/g, ' ') // Substitui underscores por espaços
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitaliza a primeira letra de cada palavra
  }
}
