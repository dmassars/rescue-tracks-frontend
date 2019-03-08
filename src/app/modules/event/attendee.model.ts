import { AbstractModel } from "../../abstract.model";

import { AnimalMeeting } from "../meeting/animal-meeting.model";
import {
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

    set _meetingSetups(meetingSetups: MeetingSetup[]) {
        this.add("meetingSetup", MeetingSetup, meetingSetups[0]);
    }
}
