import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: "rt-modal",
    templateUrl: "./modal.component.html",
})
export class ModalComponent implements OnInit {
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    @Input() open: EventEmitter<any>;

    @Input() isActive: boolean;

    @Input() isGeneric: boolean;
    @Input() isRoute: boolean; // this could be determined from the router

    constructor(private router: Router) {}

    ngOnInit() {
        if (this.open) {
            this.open.subscribe(() => {
                this.isActive = true;
            });
        }
    }

    closeModal($event?) {
        this.isActive = false;
        if (this.isRoute) {
            this.router.navigate([{outlets: {modal: null}}]);
        }
        this.close.next($event);
    }
}
