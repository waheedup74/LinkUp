import { Injectable } from "@angular/core";

@Injectable()
export class SharedDataService {
    currentYear: number = (new Date()).getFullYear();
    minimumYear: number = 1949;

    dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"];
    years: number[] = [];


    generateYears() {
        for (var i = this.minimumYear; i < this.currentYear; i++) {
            this.minimumYear++;
            this.years.push(this.minimumYear);
        }
    }
}