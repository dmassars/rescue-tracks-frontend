import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";

import * as _ from "lodash";

import {
    Attendee,

    EventService,
} from "../../../modules";

@Component({
    selector: 'page-event-start-meeting',
    templateUrl: 'start-meeting.html',
})
export class StartMeetingPage implements OnInit, OnDestroy {

    private paramsSub: Subscription;

    public eventId: Observable<number>;

    public attendee: Observable<Attendee>;

    constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

    ngOnInit(): void {
        this.paramsSub = this.route.params.subscribe(params => {
            this.eventId = Observable.of(+params.id);
            let attendees = JSON.parse(localStorage.getItem("eventAttendance"));
            let attendee = _.find<Attendee>(attendees, (attendee) => attendee.id == +params.attendeeId);
            this.attendee = Observable.of(new Attendee(attendee));
        });
    }

    ngOnDestroy(): void {
        this.paramsSub.unsubscribe();
    }

    startMeeting(): void {
        Observable.forkJoin(
            this.eventId,
            this.attendee
        ).switchMap(([eventId, attendee]) =>
            this.eventService.startMeeting(eventId, attendee)
        ).subscribe((meeting: {id: number}) => {
            this.router.navigate(["meetings", meeting.id])
        });
    }
}
