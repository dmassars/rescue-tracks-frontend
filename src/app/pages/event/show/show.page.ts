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

import { MeetingSetup } from "../../../modules/meeting";

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

    public waitlistFilter: string;

    public waitlistFilterObservable: ReplaySubject<string>;

    public attendanceOptions = [{
        value: "has_meeting",
        display: "Approved with meeting",
    },{
        value: "approved",
        display: "Approved",
    },{
       value: "online_application",
       display: "Application submitted online",
    },{
        value: "walkup",
        display: "Walkup"
    }];

    public availableMeetingTimes: Date[];

    constructor(private route: ActivatedRoute, private eventService: EventService) {
        this.newAttendee = new Attendee();
        this.newAttendee.meetingSetup = new MeetingSetup();
    }

    ngOnInit(): void {
        this.waitlistFilterObservable = new ReplaySubject<string>(1);

        this.paramsSub = this.route.params.subscribe(params => {
            localStorage.setItem("eventId", +params.id + "");
            this.eventModel = this.eventService.getEvent(+params.id).map((event: EventModel) => {
                if(moment(event.startTime).twix(event.endTime).isCurrent()) {

                    this.generateMeetingTimes(event);

                    this.waitlist = Observable.combineLatest(
                        this.eventService.getEventAttendance(+params.id)
                                            .map((attendances) => _.orderBy(attendances, "startedAt")),
                        this.waitlistFilterObservable
                    ).map(([attendances, filter]) => {
                        if (this.waitlistFilter == "all") {
                            return attendances;
                        } else {
                            return _.filter(attendances, (attendance) => attendance.approvalStatus == this.waitlistFilter);
                        }
                    });
                    this.myMeetings = this.eventService.getMeetingsAtEvent(+params.id);
                }

                return event;
            });
        });

        this.waitlistFilter = localStorage.getItem("waitlistFilter") || "all";
        this.updateWaitlistFilter();
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

    attendanceOptionsDisplay(option) {
        try {
            return _.find(this.attendanceOptions, (opt) => opt.value == option).display;
        } catch (e) {
            return "Unknown";
        }
    }

    updateWaitlistFilter() {
        localStorage.setItem("waitlistFilter", this.waitlistFilter);

        this.waitlistFilterObservable.next(this.waitlistFilter);
    }

    private generateMeetingTimes(event: EventModel): void {
        if (this.availableMeetingTimes && this.availableMeetingTimes.length) {
            return;
        }

        let startTime = moment(event.startTime).startOf("hour");
        let endTime = moment(event.endTime);
        this.availableMeetingTimes = [];

        while (startTime.isBefore(moment(event.startTime))) {
            startTime.add(15, "minutes");
        }

        while (startTime.isBefore(endTime)) {
            this.availableMeetingTimes.push(startTime.toDate());
            startTime.add(15, "minutes");
        }
    }
}
