import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeFloat'
})
export class RemoveFloatPipe implements PipeTransform {

  transform (value: number): unknown {
    return Math.trunc(value);
  }

}
