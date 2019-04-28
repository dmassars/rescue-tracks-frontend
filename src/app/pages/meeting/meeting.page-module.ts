import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { MeetingModule } from "../../modules/";

import {
  EndPage,
  MeetingPage,
  MeetWithPage,
} from ".";

import { MeetingRoutes } from "./meeting.routes";

@NgModule({
  declarations: [
    // Pages
    MeetingPage,
    
    // Modals
    EndPage,
    MeetWithPage,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MeetingModule,

    MeetingRoutes,
  ],
})
export class MeetingPageModule { }
