import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import * as moment from "moment";
import "twix";

import { Observable, ReplaySubject } from "rxjs";
import "rxjs/add/operator/map";

import * as _ from "lodash";

import { SocketService } from "../api/socket.service";

import { EventModel } from "./event.model";
import { Attendee } from "./attendee.model";
import { Meeting } from "../meeting/meeting.model";
import { Message } from "./message.model";
import { Animal } from "../api/animal";

@Injectable()
export class EventService {
    constructor(private http: HttpClient, private socket: SocketService, private router: Router) {}

    public setupEvent(date: string, startTime: string, endTime: string): Observable<EventModel> {
        return this.http.post<EventModel>(
                   `events`, {
                       startTime: moment(`${date} ${startTime}`).format(),
                       endTime:   moment(`${date} ${endTime}`).format(),
                   });
    }

    public getEvents(active?: boolean): Observable<EventModel[]> {
        let params: {active?: string} = {};

        if (active) {
            params.active = "true";
        }
        return this.http
                   .get<EventModel[]>(`events`, {params})
                   .map((events: EventModel[]) => {
                      return _.map(events, (event: EventModel) => new EventModel(event))
                   });
    }

    public getEvent(eventId: number): Observable<EventModel> {
        return this.http
                   .get<EventModel>(`events/${eventId}`)
                   .map((event: EventModel) => new EventModel(event));
    }

    public joinEvent(eventId: number): Observable<{success: boolean, eventId: number}> {
        return Observable.of({success: true, eventId: 3});
    }

    public getEventAttendance(eventId: number): Observable<Attendee[]> {
        const transformAttendees = (attendees: Attendee[]) => _.map(attendees, (attendee: any) => new Attendee(
                _.chain(attendee.__adopter__)
                 .pick(["id", "firstName", "lastName", "phoneNumber", "__meetingSetups__"])
                 .extend({
                     startedAt: attendee.createdAt,
                     approvalStatus: attendee.approvalStatus
                 }).value()
            ));

        const updateAttendance = (attendees: Attendee[]) => {
            let result = transformAttendees(attendees);
            localStorage.setItem("eventAttendance", JSON.stringify(result));
            return result;
        };


        let attendance: ReplaySubject<Attendee[]> = this.socket.bindAction<Attendee[]>("event", "adopters", {event_id: eventId}, updateAttendance)

        this.http
            .get<Attendee[]>(`events/${eventId}/attendance`)
            .subscribe((attendees) => {
                updateAttendance(attendees);
                attendance.next(transformAttendees(attendees));
            });

        return attendance;
    }

    public addAttendee(eventId: number, attendee: Attendee): Observable<Attendee> {

        if (_.get(attendee, "meetingSetup")) {
            _.set(attendee, "meetingSetup.animal", {id: attendee.meetingSetup.animal.id});
        }

        return this.http.post<Attendee>(
                `events/${eventId}/attendance`,
                { attendee }
            );
    }

    public startMeeting(eventId: number, attendee: Attendee): Observable<{id: number}> {
        return this.http.put<{id: number}>(
                `events/${eventId}/attendance`,
                { attendee }
            );
    }

    // Duplicated in meeting service
    public getEventAnimals(eventId: number): Observable<Animal[]> {
        let mapAnimals = (animals) => _.map(animals, animal => new Animal(animal));

        let animals: ReplaySubject<Animal[]> = this.socket.bindAction<Animal[]>("event", "animals", {event_id: eventId}, mapAnimals);

        this.http
            .get<Animal[]>(`events/${eventId}/animals-for-meeting`)
            .map(mapAnimals)
            .subscribe(animals.next.bind(animals));

        return animals;
    }

    public sendMessage(eventId: number, message: String): Observable<void> {
        return this.http.post<void>(
            `events/${eventId}/messages`,
            { message }
        );
    }

    public getEventMessages(eventId: number): Observable<Message[]> {
        let mapMessages = (messages) => _.map(messages, message => new Message(message));

        let messages = this.socket.bindAction<Message[]>("event", "messages", {event_id: eventId}, mapMessages);

        this.http
            .get<Animal[]>(`events/${eventId}/messages`)
            .map(mapMessages)
            .subscribe(messages.next.bind(messages));

        return messages;
    }

    public getMeetingsAtEvent(eventId: number): Observable<Meeting[]> {
        return this.http.get<Meeting[]>(`events/${eventId}/meetings`)
                   .map((meetings) => _.map(meetings, meeting => new Meeting(meeting)));
    }

    public compareEventsByTime(eventA: EventModel, eventB: EventModel): number {
        let mEventAStart = moment(eventA.startTime);
        let mEventBStart = moment(eventB.startTime);
        let mEventAEnd   = moment(eventA.endTime);
        let mEventBEnd   = moment(eventB.endTime);

        if (mEventAStart.isBefore(mEventBStart) || (mEventAStart.isSame(mEventBStart) && mEventAEnd.isBefore(mEventBEnd))) {
            return 1;
        } else if (mEventAStart.isSame(mEventBStart) && mEventAEnd.isSame(mEventBEnd)) {
            return 0;
        }

        return -1;
    }
}
