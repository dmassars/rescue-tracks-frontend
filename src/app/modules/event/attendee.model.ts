import { AbstractModel } from "../../abstract.model";

import {
    AnimalMeeting,
    MeetingSetup,
} from "../meeting";

export class Attendee extends AbstractModel {
    public firstName: string;
    public lastName: string;
    public approvalStatus: string;
    public email: string;
    public phoneNumber: string;
    public startedAt: Date;

    public animalMeetings: AnimalMeeting[];
    public meetingSetup: MeetingSetup;

    set _animalMeetings(animalMeetings: AnimalMeeting[]) {
        this.addArray("animalMeetings", AnimalMeeting, animalMeetings);
    }

    set _meetingSetup(meetingSetup: MeetingSetup) {
        this.add("meetingSetup", MeetingSetup, meetingSetup);
    }
}
