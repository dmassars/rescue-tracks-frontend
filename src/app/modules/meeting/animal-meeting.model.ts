import { AbstractModel } from "../../abstract.model";

import { Animal } from "../api";
import { User } from "../authentication/user.model";

export class AnimalMeeting extends AbstractModel {

    public concludedAt: Date;

    public animal: Animal;

    get startedAt(): Date {
        return this.createdAt;
    }

    set _animal(animal: Animal) {
        this.add("animal", Animal, animal);
    }

    set _adoptionCounselor(adoptionCounselor: User) {
        this.add("adoptionCounselor", User, adoptionCounselor);
    }
}
