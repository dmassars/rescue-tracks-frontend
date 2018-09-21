import { AbstractModel } from "../../abstract.model";

import { AnimalMeeting } from "../meeting/animal-meeting.model";

export class Attendee extends AbstractModel {
    public firstName: string;
    public lastName: string;
    public approvalStatus: string;
    public email: string;
    public phoneNumber: string;
    public startedAt: Date;

    public animalMeetings: AnimalMeeting[];

    set _animalMeetings(animalMeetings: AnimalMeeting[]) {
        this.addArray("animalMeetings", AnimalMeeting, animalMeetings);
    }
}
