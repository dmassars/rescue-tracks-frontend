import * as _ from "lodash";

import { AbstractModel } from "../../abstract.model";

import { Animal } from "../api";
import { Attendee } from "../event";
import { User } from "../authentication/user.model";

export class AnimalMeeting extends AbstractModel {

    public concludedAt: Date;
    public adopted: Boolean;

    public animal: Animal;

    get startedAt(): Date {
        return this.createdAt;
    }

    set _animal(animal: Animal) {
        this.add("animal", Animal, animal);
    }

    set _attendee(attendee: Attendee) {
        this.add("attendee", Attendee, attendee)
    }

    set _adoptionCounselor(adoptionCounselor: User) {
        this.add("adoptionCounselor", User, adoptionCounselor);
    }

    protected static transform(params: any) {
        return _.chain(params)
                .extend({__attendee__: params.__adopter__})
                .omit("__adopter__")
                .value();
    }
}
