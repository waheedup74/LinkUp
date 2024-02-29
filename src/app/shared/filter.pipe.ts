import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchText: string, ...args: unknown[]): any {

    if (!searchText || searchText == '') return value;
    let searchedVal = "";
    let matchingStatus = false;
    const resultGroups = [];

    for (const group of value) {
      if (searchText.length == 1) {
        if (group.groupName.charAt(0) == searchText) {
          resultGroups.push(group);
        }
      }
      else {
        for (let i = 0; i < group.groupName.length; i++) {
          for (var j = 0; j < searchText.length; j++) {
            if (group.groupName.charAt(i) == searchText[j]) {
              searchedVal += searchText[j];
              matchingStatus = true;
              break;
            }
            else if (group.groupName.charAt(i) != searchText[j]) matchingStatus = false;
          }
          if (searchedVal != "" && searchedVal == searchText && matchingStatus)
            resultGroups.push(group);

          else if (searchedVal != "" && searchedVal != searchText.substring(0, searchedVal.length) && matchingStatus)
            searchedVal = "";

          else if (!matchingStatus && searchedVal.length > 0) searchedVal = "";
        }
      }
    }
    return resultGroups;
  }

}
