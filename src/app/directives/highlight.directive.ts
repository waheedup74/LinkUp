import { Directive, OnInit, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {

  @Input() defaultColor: string = 'white';
  @Input() highLightColor: string = '#e9e9f5';
  @HostBinding('style.backgroundColor') bgColor: string = 'white';

  constructor() { }

  ngOnInit() {
  this.bgColor = this.defaultColor;
  }

  @HostListener('mouseenter') mouseenter(eventData: Event) {
   this.bgColor = this.highLightColor;
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    // this.renderer.setStyle(this.eleRef.nativeElement, 'background-color', 'white');
    this.bgColor = this.defaultColor;
  }
}
