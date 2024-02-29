import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  initialNumber: number = 0;
  endNumber: number = 0;
  tempSelectedPageNo: number = 0;

  constructor() { }

  transform(value: any, selectedPageNo: number): unknown {
    if (selectedPageNo == 0) return value.slice(0, 5);

    this.tempSelectedPageNo = selectedPageNo - 1;
    this.initialNumber = this.tempSelectedPageNo * 5;
    this.endNumber = this.initialNumber + 5;

    return value.slice(this.initialNumber, this.endNumber);
  }

}
