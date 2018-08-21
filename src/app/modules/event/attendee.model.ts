import { AbstractModel } from "../../abstract.model";

export class Attendee extends AbstractModel {
    firstName: string;
    lastName: string;
    preapproved: boolean;
    email: string;
    phoneNumber: string;
    startedAt: Date;
}
