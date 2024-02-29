import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPropertyCheck]'
})
export class PropertyCheckDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input() set appPropertyCheck(condition: boolean) {
    if (!condition) this.viewContainerRef.createEmbeddedView(this.templateRef);
    else this.viewContainerRef.clear();
  }
}
