import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userNameFilter',
  //  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filter?: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item.userName.toLowerCase().indexOf(filter.toLowerCase()) !== -1);

  }

}
