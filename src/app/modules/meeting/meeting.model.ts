import * as _ from "lodash";

import { AbstractModel } from "../../abstract.model";

import { Attendee, EventModel } from "../event";
import { User } from "../authentication/user.model";
import { Animal } from "../api";
import { AnimalMeeting } from "./animal-meeting.model";

export class Meeting extends AbstractModel {
    public animals: Animal[];
    public animalMeetings: AnimalMeeting[];
    public attendee: Attendee;
    public event: EventModel;
    public adoptionCounselor: User;

    set _animals(animals: Animal[]) {
        this.addArray("animals", Animal, animals);
    }

    set _animalMeetings(animalMeetings: AnimalMeeting[]) {
        this.addArray("animalMeetings", AnimalMeeting, animalMeetings);
    }

    get activeAnimalMeeting(): AnimalMeeting {
        return _.find(this.animalMeetings, (meeting: AnimalMeeting) => !meeting.concludedAt);
    }

    set _attendee(attendee: Attendee) {
        this.add("attendee", Attendee, attendee)
    }

    set _event(event: EventModel) {
        this.add("event", EventModel, event)
    }

    set _adoptionCounselor(adoptionCounselor: User) {
        this.add("adoptionCounselor", User, adoptionCounselor)
    }
}
