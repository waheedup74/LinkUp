import { Directive, Input } from "@angular/core"
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms"

@Directive({
    selector: "[appValidMaxValue]",
    providers: [{ provide: NG_VALIDATORS, useExisting: ValidMaxValueDirective, multi: true }],
})
export class ValidMaxValueDirective implements Validator {
    @Input("max") max: number = 0

    validate(control: AbstractControl): { [key: string]: any } | null {
        //  return this.max ? MaxValueValidator.validMaxValue(this.max)(control) : null
        return control;
    }
}
