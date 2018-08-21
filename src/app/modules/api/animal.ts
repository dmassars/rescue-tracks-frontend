import { AbstractModel } from "../../abstract.model";

import { AnimalMeeting } from "../meeting/animal-meeting.model";

export class Animal extends AbstractModel {
    static readonly ADOPTED                       = "Healthy In Home";
    static readonly ADOPTED_AWAITING_FINALIZATION = "Adopted/Needs Finalization";
    static readonly AVAILABLE                     = "Available";
    static readonly HOLD                          = "Hold/Waiting Period";
    static readonly HOLD_BEHAVIOR                 = "Hold/Behavioral Eval";
    static readonly HOLD_FOSTER_FAIL              = "Hold/Possible Foster Fail";
    static readonly HOLD_INTEREST                 = "Hold/Enough Interest";
    static readonly HOLD_MEDICAL                  = "Hold/Medical";

    readonly ageInMonths: number;
    readonly attributes:  {
        dogs: boolean,
        cats: boolean,
        kids: boolean,
        other: string[],
    };
    readonly breed:       string;
    readonly canWalk:     boolean;
    readonly data:        {};
    readonly description: string;
    readonly externalId:  string;
    readonly gender:      string;
    readonly id:          number;
    readonly name:        string;
    readonly photo:       string;
    readonly size:        string;
    readonly status:      string;
    selected:             boolean;

    public animalMeetings: AnimalMeeting[];

    set _animalMeetings(animalMeetings: AnimalMeeting[]) {
        this.addArray("animalMeetings", AnimalMeeting, animalMeetings);
    }
}
