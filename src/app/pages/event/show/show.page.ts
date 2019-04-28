import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription, ReplaySubject } from "rxjs";
import * as _ from "lodash";

import * as moment from "moment";
import "twix";

import {
    Attendee,
    Animal,
    EventModel,
    Meeting,
    Message,

    EventService,
} from "../../../modules";

import { MeetingSetup } from "../../../modules/meeting";

@Component({
    selector: "page-event-show",
    templateUrl: "show.html",
    styleUrls: ["show.scss"]
})
export class EventPage implements OnInit, OnDestroy {

    @ViewChild('messageContainer')
    messageContainer: ElementRef;

    private paramsSub: Subscription;

    public eventModel: Observable<EventModel>;

    public newAttendee: Attendee;

    public newMessage: String;

    public waitlist: Observable<Attendee[]>;

    public myMeetings: Observable<Meeting[]>;

    public messages: Observable<Message[]>;

    public animals: Observable<Animal[]>;

    public waitlistFilter: string;

    public waitlistFilterObservable: ReplaySubject<string>;

    public attendanceOptions = [{
        value: "has_meeting",
        display: "Approved with meeting",
    },{
    //     value: "approved",
    //     display: "Approved",
    // },{
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
        this.newMessage = "";
    }

    ngOnInit(): void {
        this.waitlistFilterObservable = new ReplaySubject<string>(1);
        
        this.paramsSub = this.route.params.subscribe(params => {
            localStorage.setItem("eventId", +params.id + "");
            this.eventModel = this.eventService.getEvent(+params.id).map((event: EventModel) => {
                if(moment(event.startTime).twix(event.endTime).isCurrent()) {
                    this.animals = this.eventService.getEventAnimals(+params.id);
                    this.generateMeetingTimes(event);

                    this.waitlist = Observable.combineLatest(
                        this.eventService.getEventAttendance(+params.id)
                                            .map((attendances) => {
                                                let groupings = _.groupBy(attendances, "approvalStatus");

                                                return _.chain(this.attendanceOptions)
                                                        .map((option) => _.orderBy(groupings[option.value], "startedAt"))
                                                        .flatten()
                                                        .value()
                                            }),
                        this.waitlistFilterObservable
                    ).map(([attendances, filter]) => {
                        if (this.waitlistFilter == "all") {
                            return attendances;
                        } else {
                            return _.filter(attendances, (attendance) => attendance.approvalStatus == this.waitlistFilter);
                        }
                    });
                    this.myMeetings = this.eventService.getMeetingsAtEvent(+params.id);
                    this.subscribeToMessages(+params.id);
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
                    this.newAttendee.meetingSetup = new MeetingSetup();
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

    sendMessage() {
        if (this.newMessage.trim().length) {
            let eventId = +localStorage.getItem("eventId");
            let sub = this.eventService.sendMessage(eventId as any, this.newMessage).subscribe(() => {
                this.newMessage = "";
                this.subscribeToMessages(eventId);
                sub.unsubscribe();
            });
        }
    }

    private subscribeToMessages(id) {
        this.messages = this.eventService.getEventMessages(id);

        this.messages.subscribe(() => {
            setTimeout(() => {
                this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
            });
        });
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
