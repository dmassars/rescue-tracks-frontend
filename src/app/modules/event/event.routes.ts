import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

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
    {path: ":id", component: EventPage},
];

export const EventRoutes: ModuleWithProviders = RouterModule.forChild(routes);
