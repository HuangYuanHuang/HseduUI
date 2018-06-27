import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'onlineFilter',
    pure: true
})
export class OnlinePipe implements PipeTransform {

    transform(items: any[], filter?: any): any {
        return items.filter(item => item.isOnline === true);

    }

}
