import { Directive, HostListener } from "@angular/core"

@Directive({
    selector: "[appDisableRightClick]",
})
export class DisableRightClickDirective {
    @HostListener("contextmenu", ["$event"])
    onContextMenu(event: MouseEvent): void {
        event.preventDefault()
    }
}
