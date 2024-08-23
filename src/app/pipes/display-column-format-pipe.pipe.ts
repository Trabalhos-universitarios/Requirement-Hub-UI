import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayColumnFormatPipe'
})
export class DisplayColumnFormatPipePipe implements PipeTransform {

  private columnMap: { [key: string]: string } = {
    'identifier': 'Identificador',
    'name': 'Nome',
    'author': 'Autor',
    'creationDate': 'Data de criação',
    'dateCreated': 'Data de criação',
    'priority': 'Prioridade de desenvolvimento',
    'type': 'Tipo',
    'version': 'Versão atual',
    'status': 'Status atual',
    'actions': 'Ações',
    'source':'Fonte',
    'risk':'Risco',
    'responsible':'Responsavel',
    'effort':'Esforço',
    'release':'Release',
    'dependency':'Dependência',
  };

  transform(column: string): string {
    return this.columnMap[column] || column;
  }
}
