import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { APIModule } from "../api/api.module";
import { APIInterceptor } from "../api/api.interceptor";
import { MeetingModule } from "../meeting/meeting.module";

import { EventIsActivePipe } from "./event-is-active.pipe";
import { FormatEventDatePipe } from "./format-event-date.pipe";
import { FormatTimePipe } from "./format-time.pipe";
import { TimeAgoPipe } from "./time-ago.pipe";

import { EventService } from "./event.service";

import { AuthenticationInterceptor } from "../authentication/authentication.interceptor";

@NgModule({
  declarations: [
    // Pipes
    EventIsActivePipe,
    FormatEventDatePipe,
    FormatTimePipe,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,

    APIModule,
  ],
  exports: [
    EventIsActivePipe,
    FormatEventDatePipe,
    FormatTimePipe,
    TimeAgoPipe,
  ],
  providers: [
    EventService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
  ],
})
export class EventModule { }
