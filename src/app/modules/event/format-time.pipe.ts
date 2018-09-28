import { Pipe, PipeTransform } from '@angular/core';

import * as moment from "moment";

@Pipe({
    name: 'timeOfDay'
})
export class FormatTimePipe implements PipeTransform {
    transform(time: Date): string {
        if(!time) {
            return "";
        }
        let mTime = moment(time);

        return mTime.format("LT");
    }
}
