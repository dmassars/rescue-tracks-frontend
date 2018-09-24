import * as _ from "lodash";

import { AbstractModel } from "../../abstract.model";

// import { Animal } from "../api";
// import { Attendee } from "../event/attendee.model";

// import { EventModel } from "../"

export class MeetingSetup extends AbstractModel {
    // public event: EventModel;
    // public attendee: Attendee;
    // public animal: Animal;
    public meetingTime: Date;
    public started: boolean;

    // set _event(event: EventModel) {
    //     this.add("event", EventModel, event);
    // }

    // set _attendee(attendee: Attendee) {
    //     this.add("attendee", Attendee, attendee);
    // }

    // set _animal(animal: Animal) {
    //     this.add("animal", Animal, animal);
    // }

    protected static transform(params: any) {
        return _.chain(params)
                .extend({__attendee__: params.__adopter__})
                .omit("__adopter__")
                .value();
    }
}
