import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription, ReplaySubject } from "rxjs";
import * as _ from "lodash";

import * as moment from "moment";
import "twix";

import {
    Attendee,
    EventModel,
    Meeting,

    EventService,
} from "../../../modules";

@Component({
    selector: "page-event-show",
    templateUrl: "show.html",
    styleUrls: ["show.scss"]
})
export class EventPage implements OnInit, OnDestroy {

    private paramsSub: Subscription;

    public eventModel: Observable<EventModel>;

    public newAttendee: Attendee;

    public waitlist: Observable<Attendee[]>;

    public myMeetings: Observable<Meeting[]>;

    constructor(private route: ActivatedRoute, private eventService: EventService) {
        this.newAttendee = new Attendee();
    }

    ngOnInit(): void {
        this.paramsSub = this.route.params.subscribe(params => {
            localStorage.setItem("eventId", +params.id + "");
            this.eventModel = this.eventService.getEvent(+params.id).map((event: EventModel) => {
                if(moment(event.startTime).twix(event.endTime).isCurrent()) {
                    this.waitlist = this.eventService.getEventAttendance(+params.id);
                    this.myMeetings = this.eventService.getMeetingsAtEvent(+params.id)
                        .map((meetings) => _.map(meetings, (meeting) => new Meeting(meeting)));
                }

                return event;
            });
        });
    }

    ngOnDestroy(): void {
        this.paramsSub.unsubscribe();
    }

    addToWaitlist(): void {
        this.eventModel.subscribe((eventModel) => {
            this.eventService.addAttendee(eventModel.id, this.newAttendee)
                .subscribe((attendee: Attendee) => {
                    this.newAttendee = new Attendee();
                });
        });
    }
}
