import { AbstractControl, ValidatorFn } from "@angular/forms"

export class MinValueValidator {
    static validMinValue(min: number): ValidatorFn {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (control: AbstractControl): { [key: string]: any } | null => {
            const invalid = control.value < min
            return invalid ? { "invalidMinValue": { value: control.value, min } } : null
        }
    }
}
