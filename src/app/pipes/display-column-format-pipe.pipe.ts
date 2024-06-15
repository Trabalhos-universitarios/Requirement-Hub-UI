import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayColumnFormatPipe'
})
export class DisplayColumnFormatPipePipe implements PipeTransform {

  private columnMap: { [key: string]: string } = {
    'identifierRequirement': 'Identificador',
    'nameRequirement': 'Nome',
    'authorRequirement': 'Autor',
    'creationDate': 'Data de criação',
    'priorityRequirement': 'Prioridade de desenvolvimento',
    'typeRequirement': 'Tipo',
    'versionRequirement': 'Versão atual',
    'status': 'Status atual',
    'actions': 'Ações',
  };

  transform(column: string): string {
    return this.columnMap[column] || column;
  }
}
