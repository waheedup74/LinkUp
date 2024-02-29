import { Directive, OnInit, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appFontsize]'
})
export class FontSizeDirective implements OnInit {

  @Input() defaultSize: string = '';
  @Input() defaultSizeType: string = 'px';

  @HostBinding('style.fontSize') fontSize: string = '';

  constructor() { }

  ngOnInit() {
    this.fontSize = this.defaultSize + this.defaultSizeType;
  }

  @HostListener('document:keydown.W') keyboard_W(eventData: Event) {
    let _tempFontsize = Number(this.defaultSize);
    _tempFontsize += 0.1;
    this.defaultSize = _tempFontsize + '';
    this.fontSize = _tempFontsize + this.defaultSizeType;
  }
  @HostListener('document:keydown.S') keyboard_S(eventData: Event) {
    let _tempFontsize = Number(this.defaultSize);
    _tempFontsize -= 0.1;
    this.defaultSize = _tempFontsize + '';
    this.fontSize = _tempFontsize + this.defaultSizeType;
  }

}
