import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

import {
    EventModel,

    EventService,
} from "../../../modules";

@Component({
    selector: 'page-event-start',
    templateUrl: 'start.html',
})
export class StartEventPage {
    constructor(private eventService: EventService, private router: Router) { }

    @Input()
    public date: string;

    @Input()
    public startTime: string;

    @Input()
    public endTime: string;

    public setupEvent() {
        this.eventService.setupEvent(this.date, this.startTime, this.endTime)
            .subscribe((event: EventModel) =>
                this.router.navigate(["/events", event.id, "animals","update"])
            );
    }
}
