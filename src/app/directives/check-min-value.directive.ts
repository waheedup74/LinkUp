import { Directive, Input } from "@angular/core"
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms"

@Directive({
    selector: "[appValidMinValue]",
    providers: [{ provide: NG_VALIDATORS, useExisting: ValidMinValueDirective, multi: true }],
})
export class ValidMinValueDirective implements Validator {
    @Input("min") min: number = 0;

    validate(control: AbstractControl): { [key: string]: any } | null {
        return control;//this.min ? MinValueValidator.validMinValue(this.min)(control) : null
    }
}
