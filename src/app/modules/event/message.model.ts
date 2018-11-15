import { AbstractModel } from "../../abstract.model";

import { User } from "../authentication/user.model";

export class Message extends AbstractModel {
    public message: string;
    public sender: User;

    set _sender(user: User) {
        this.add("sender", User, user);
    }
}
