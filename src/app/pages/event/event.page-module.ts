import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
// import { Ng2SmartTableModule } from 'ng2-smart-table';
// ts
import {MenubarModule} from 'primeng/menubar';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalModule } from "../../modules/components/modal";
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


import {
  EventRoutes,

  EventIndexPage,
  EventPage,
  SelectAnimalsPage,
  StartEventPage,
  StartMeetingPage,
} from ".";

import { JoinEventModalComponent } from "./modals/join.modal";

import { EventModule, MeetingModule } from "../../modules";

@NgModule({
  declarations: [
    EventIndexPage,
    EventPage,
    SelectAnimalsPage,
    StartEventPage,
    StartMeetingPage,

    JoinEventModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    // Ng2SmartTableModule,
    MenubarModule,
    TabMenuModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    ModalModule,
    EventModule,
    EventRoutes,
    MeetingModule
  ],
})
export class EventPageModule { }
