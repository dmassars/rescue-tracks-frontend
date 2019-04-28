import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

import { Observable, ReplaySubject, Subscription } from "rxjs";

import * as _ from "lodash";

import {
    Attendee,
    Animal,
    AnimalMeeting,
    Meeting,
    EventService,
    MeetingService
} from "../../../modules";

@Component({
    selector: "page-meeting-show",
    templateUrl: "show.html",
    styleUrls: ["show.scss"],
})
export class MeetingPage implements OnInit, OnDestroy {

    private paramsSub: Subscription;

    public counselorMeeting: ReplaySubject<Meeting>;
    public animals: Observable<Animal[]>;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private meetingService: MeetingService) {

        this.counselorMeeting = new ReplaySubject<Meeting>();
    }

    ngOnInit(): void {
        this.paramsSub = this.route.params.subscribe(params => {
            this.animals = this.meetingService.getEventAnimals(Number(localStorage.getItem("eventId")));
            this.meetingService
                .getMeetingDetails(+params.id)
                .subscribe(this.counselorMeeting);
        });
    }

    ngOnDestroy(): void {
        this.paramsSub.unsubscribe();
    }

    cleanPhotoUrl(url): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }

    meetingForAnimal(animal: Animal): AnimalMeeting {
        return this.meetingService.currentMeetingForAnimal(animal);
    }

    startMeeting(animal: Animal) {
        if(this.meetingForAnimal(animal)) {
            alert(`${animal.name} is already in a meeting! Please check with the adoption counselor listed for more information.`);
            return;
        }
        this.counselorMeeting.subscribe((meeting) => {
            localStorage.setItem("meetWithAttendee", JSON.stringify(meeting.attendee))
            localStorage.setItem("meetWithAnimal", JSON.stringify(animal));
            this.router.navigate(["meetings", meeting.id, "with"]);
        });
    }

    endMeeting() {
        this.counselorMeeting.switchMap((meeting) => {
            return this.meetingService.endMeeting(meeting.id).map(result => {
                alert(`Don't forget to return ${meeting.attendee.firstName}'s id!`);
                return result;
            });
        }).subscribe((result: {success: boolean, error: string}) => {
            if(result.success) {
                this.router.navigate(["/events", localStorage.getItem("eventId")]);
            } else {
                alert(result.error);
            }
        });
    }
}
