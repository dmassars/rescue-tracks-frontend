import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import * as moment from "moment";
import "twix";

import * as socketIO from "socket.io-client";

import { Observable, ReplaySubject } from "rxjs";
import "rxjs/add/operator/map";

import * as _ from "lodash";

import { EventModel } from "./event.model";
import { Attendee } from "./attendee.model";
import { Meeting } from "../meeting/meeting.model";
import { Animal } from "../api/animal";

const BASE_RESCUE_TRACKS_URL = "http://localhost:9000";

@Injectable()
export class EventService {
    constructor(private http: HttpClient, private router: Router) {}

    public setupEvent(date: string, startTime: string, endTime: string): Observable<EventModel> {
        return this.http.post<EventModel>(
                   `${BASE_RESCUE_TRACKS_URL}/events`, {
                       startTime: moment(`${date} ${startTime}`).format(),
                       endTime:   moment(`${date} ${endTime}`).format(),
                   });
    }

    public getEvents(): Observable<EventModel[]> {
        return this.http
                   .get<EventModel[]>(`${BASE_RESCUE_TRACKS_URL}/events`)
                   .map((events: EventModel[]) =>
                       _.map(events, (event: EventModel) => Object.assign(new EventModel(), event))
                   );
    }

    public getEvent(eventId: number): Observable<EventModel> {
        return this.http
                   .get<EventModel>(`${BASE_RESCUE_TRACKS_URL}/events/${eventId}`)
                   .map((event: EventModel) => Object.assign(new EventModel(), event));
    }

    public getEventAttendance(eventId: number): Observable<Attendee[]> {
        let action = "adopters";
        let socket: SocketIOClient.Socket = socketIO(`${BASE_RESCUE_TRACKS_URL}/event`, {
              query: {
                  event_id: eventId,
                  action
              }
          });

        let attendance: ReplaySubject<Attendee[]> = new ReplaySubject<Attendee[]>(1);

        let updateAttendance = (attendees: Attendee[]) => {
          localStorage.setItem("eventAttendance", JSON.stringify(attendees));
          attendance.next(attendees);
        };

        this.http
            .get<Attendee[]>(`${BASE_RESCUE_TRACKS_URL}/events/${eventId}/attendance`)
            .subscribe(updateAttendance);

        socket.on(action, updateAttendance);

        return attendance;
    }

    public addAttendee(eventId: number, attendee: Attendee): Observable<Attendee> {
        return this.http.post<Attendee>(
                `${BASE_RESCUE_TRACKS_URL}/events/${eventId}/attendance`,
                { attendee }
            );
    }

    public startMeeting(eventId: number, attendee: Attendee): Observable<{id: number}> {
        return this.http.put<{id: number}>(
                `${BASE_RESCUE_TRACKS_URL}/events/${eventId}/attendance`,
                { attendee }
            );
    }

    public getMeetingsAtEvent(eventId: number): Observable<Meeting[]> {
        return this.http.get<Meeting[]>(`${BASE_RESCUE_TRACKS_URL}/events/${eventId}/meetings`);
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
