import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import * as _ from "lodash";

import { EventIndexPage } from "./index/index.page";
import { StartEventPage } from "./start/start.page";
import { StartMeetingPage } from "./start-meeting/start-meeting.page";
import { SelectAnimalsPage } from "./select-animals/select-animals.page";
import { EventPage } from "./show/show.page";

const routes: Routes = [
    {path: "", component: EventIndexPage},
    {path: "start", component: StartEventPage},
    {path: ":id/meeting/:attendeeId", component: StartMeetingPage},
    {path: ":id/animals", component: SelectAnimalsPage},
    {path: ":id/animals/:action", component: SelectAnimalsPage},
    {path: ":id/animals/:action", component: SelectAnimalsPage},
    {path: ":id/animals/meeting/:meetingId", component: SelectAnimalsPage},
    {path: ":id", component: EventPage},
    {path: "**", redirectTo: ""},
];

export const EventRoutes: ModuleWithProviders = RouterModule.forChild(routes);
