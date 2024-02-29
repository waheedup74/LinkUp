import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gradeCalc'
})
export class GradeCalcPipe implements PipeTransform {

  transform(value: number): string {
    let grade = "";

    if (value >= 90) grade = 'A';
    else if (value >= 80 && value < 90) grade = 'B';
    else if (value >= 70 && value < 80) grade = 'C';
    else if (value >= 60 && value < 70) grade = 'D';
    else if (value >= 60 && value < 60) grade = 'E'; 
    else grade = 'F';

    return grade;
  }

}
