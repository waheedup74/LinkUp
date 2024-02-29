import { AbstractControl, ValidatorFn } from "@angular/forms"

export class MaxValueValidator {
    static validMaxValue(max: number): ValidatorFn {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (control: AbstractControl): { [key: string]: any } | null => {
            const invalid = control.value > max
            return invalid ? { "invalidMaxValue": { value: control.value, max } } : null
        }
    }
}
